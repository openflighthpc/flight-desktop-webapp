import React, { useContext, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import NoVNC from './NoVNC';
import Overlay from './Overlay';
import Spinner from './Spinner';
import TerminateButton from './TerminateButton';
import placeholderImage from './placeholder.jpg';
import { Context as ConfigContext } from './ConfigContext';
import { DefaultErrorMessage } from './ErrorBoundary';
import { useFetchScreenshot } from './api';
import { useFetchSession, useTerminateSession } from './api';

function buildWebsocketUrl(session, config) {
  if (config.devOnlyWebsocketRootUrl) {
    // This branch is intended for development and testing only.  The code
    // here is intentionally less robust in the URL it constructs.  It is
    // expected that the developer sets things up correctly.
    const rootUrl = config.devOnlyWebsocketRootUrl;
    const prefix = config.websocketPathPrefix;
    const pathIP = config.websocketPathIp || session.ip;
    return `${rootUrl}${prefix}/${pathIP}/${session.port}`;

  } else {
    const apiUrl = new URL(config.apiRootUrl);
    const wsUrl = new URL(config.apiRootUrl);

    if (apiUrl.protocol.match(/https/)) {
      wsUrl.protocol = 'wss';
    } else {
      wsUrl.protocol = 'ws';
    }

    let prefix = config.websocketPathPrefix;
    const pathIP = config.websocketPathIp || session.ip;
    wsUrl.pathname = `${prefix}/${pathIP}/${session.port}`;

    return wsUrl.toString()
  }
}

function SessionPage() {
  const { id } = useParams();
  const {
    data: session,
    error: sessionLoadingError,
    loading: sessionLoading,
  } = useFetchSession(id);
  const { image: screenshot } = useFetchScreenshot(id);

  if (sessionLoading) {
    return <Loading screenshot={screenshot} />;
  } else if (sessionLoadingError) {
    return <DefaultErrorMessage />;
  } else {
    return (
      <Connected
        id={id}
        screenshot={screenshot}
        session={session}
      />
    );
  }
}

function Loading({ screenshot }) {
  return (
    <Layout>
      <Screenshot screenshot={screenshot} />
      <Overlay>
        <Spinner text="Loading session..." />
      </Overlay>
    </Layout>
  );
}

function Connected({ id, screenshot, session }) {
  const [connectionState, setConnectionState] = useState('connecting');
  const config = useContext(ConfigContext);
  const history = useHistory();
  const vnc = useRef(null);
  const { del, loading: terminating } = useTerminateSession(id);
  const terminateSession = () => {
    setConnectionState('terminating');
    del().then(() => history.push(`/sessions`));
  };
  const websocketUrl = buildWebsocketUrl(session, config);
  function onReconnect() {
    if (vnc.current) {
      setConnectionState('connecting');
      vnc.current.onReconnect();
    }
  }

  return (
    <Layout
      connectionState={connectionState}
      onDisconnect={() => {
        if (vnc.current) {
          setConnectionState('disconnecting');
          vnc.current.onUserDisconnect();
        }
      }}
      onReconnect={onReconnect}
      onTerminate={terminateSession}
      session={session}
      terminating={terminating}
    >
      <ErrorBoundary>
        <ConnectStateIndicator
          connectionState={connectionState}
          onReconnect={onReconnect}
          screenshot={screenshot}
        />
        <div className={connectionState === 'connected' ? 'd-block' : 'd-none'}>
          <NoVNC
            connectionName={websocketUrl}
            password={session.password}
            onBeforeConnect={() => {
              console.log('connected')
              setConnectionState('connected')
            }}
            onDisconnected={(e) => {
              console.log('disconnected', e);
              setConnectionState('disconnected')
            }}
            ref={vnc}
          />
        </div>
      </ErrorBoundary>
    </Layout>

  );
}

function Layout({
  children,
  connectionState,
  onDisconnect,
  onReconnect,
  onTerminate,
  session,
  terminating,
}) {
  // `id` could be null when we are navigating away from the page.
  const { id } = useParams();
  const sessionName = id == null ? '' : id.split('-')[0];

  return (
    <div className="overflow-auto">
      <div className="row no-gutters">
        <div className="col">
          <div className="card border-primary">
            <div className="card-header bg-primary text-light">
              <div className="row no-gutters">
                <div className="col">
                  <div className="d-flex align-items-center">
                    <h5 className="flex-grow-1 mb-0">
                      {sessionName}
                    </h5>
                    <Toolbar
                      connectionState={connectionState}
                      onDisconnect={onDisconnect}
                      onReconnect={onReconnect}
                      onTerminate={onTerminate}
                      session={session}
                      terminating={terminating}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toolbar({
  connectionState,
  onDisconnect,
  onReconnect,
  onTerminate,
  session,
  terminating,
}) {
  const disconnectBtn = connectionState === 'connected' ? (
    <button
      className="btn btn-secondary btn-sm mr-1"
      onClick={onDisconnect}
    >
      <i className="fa fa-times mr-1"></i>
      <span>Disconnect</span>
    </button>
  ) : null;

  const reconnectBtn = connectionState === 'disconnected' ? (
    <button
      className="btn btn-secondary btn-sm mr-1"
      onClick={onReconnect}
    >
      <i className="fa fa-bolt mr-1"></i>
      <span>Reconnect</span>
    </button>
  ) : null;

  const terminateBtn = session != null ? (
    <TerminateButton
      className="btn-sm"
      session={session}
      terminateSession={onTerminate}
      terminating={terminating}
    >
    </TerminateButton>
  ) : null;

  return (
    <div className="btn-toolbar" style={{ minHeight: '31px' }}>
      {disconnectBtn}
      {reconnectBtn}
      {terminateBtn}
    </div>
  );
}

function ConnectStateIndicator({ connectionState, onReconnect, screenshot }) {
  let indicator;
  let onClick;
  switch (connectionState) {
    case 'connecting':
      indicator = (<Spinner text="Initializing connection..." />);
      break;
    case 'disconnecting':
      indicator = (<Spinner text="Disconnecting..." />);
      break;
    case 'terminating':
      indicator = (<Spinner text="Terminating..." />);
      break;
    case 'disconnected':
      indicator = (<div className="text-center">Session has been disconnected.</div>);
      onClick = onReconnect;
      break;
    default:
      indicator = null;
  }

  if (indicator == null) {
    return null;
  }
  return (
    <div
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Screenshot screenshot={screenshot} />
      <Overlay>{indicator}</Overlay>
    </div>
  );
}

function Screenshot({ screenshot }) {
  return (
    <img
      alt="Session screenshot"
      className="d-block m-auto vnc-height"
      src={
        screenshot != null ?
          `data:image/png;base64,${screenshot}` :
          placeholderImage
      }
    />
  );
}

export default SessionPage;
