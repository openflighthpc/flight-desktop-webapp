import React, { useContext, useRef, useState } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import { useToast } from './ToastContext';

import {
  ConfigContext,
  DefaultErrorMessage,
  ErrorBoundary,
  FullscreenButton,
  NotFound,
  Overlay,
  Spinner,
} from 'flight-webapp-components';

import SessionHeaderText from './SessionHeaderText';
import NoVNC from './NoVNC';
import PreparePasteButton from './PreparePasteButton';
import ConfigureButton from './configure/ConfigureButton.js';
import TerminateButton from './TerminateButton';
import WrappedScreenshot from './Screenshot';
import styles from './NoVNC.module.css';
import { useFetchSession } from './api';
import { useForceRender } from './utils';

function buildWebsocketUrl(session, config) {
  // We expect restapi to be running on an externally accessible machine.
  //
  // Remote sessions are not on the same machine as restapi, we need to use
  // the session's primary IP address.
  //
  // Active sessions are on the same machine as restapi and can be proxied to
  // at 127.0.0.1.  We prefer 127.0.0.1 to the session's primary IP address as
  // that may be behind a firewall.
  let proxyIP;
  if (session.state === 'Remote') {
    proxyIP = session.ip
  } else {
    proxyIP = "127.0.0.1"
  }

  if (config.devOnlyWebsocketRootUrl) {
    // This branch is intended for development and testing only.  The code
    // here is intentionally less robust in the URL it constructs.  It is
    // expected that the developer sets things up correctly.
    const rootUrl = config.devOnlyWebsocketRootUrl;
    const prefix = config.websocketPathPrefix;
    return `${rootUrl}${prefix}/${proxyIP}/${session.port}`;

  } else {
    const apiUrl = new URL(config.apiRootUrl, window.location.origin);
    const wsUrl = new URL(config.apiRootUrl, window.location.origin);

    if (apiUrl.protocol.match(/https/)) {
      wsUrl.protocol = 'wss';
    } else {
      wsUrl.protocol = 'ws';
    }

    let prefix = config.websocketPathPrefix;
    wsUrl.pathname = `${prefix}/${proxyIP}/${session.port}`;

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

  if (sessionLoading) {
    return <Loading id={id} />;
  } else if (sessionLoadingError) {
    if (sessionLoadingError.name === "404") {
      return <NotFound />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    return (
      <Connected
        id={id}
        session={session}
      />
    );
  }
}

function Loading({ id }) {
  return (
    <Layout>
      <Screenshot id={id} />
      <Overlay>
        <Spinner text="Loading session..." />
      </Overlay>
    </Layout>
  );
}

function Connected({ id, session }) {
  const [connectionState, setConnectionState] = useState('connecting');
  const config = useContext(ConfigContext);
  const history = useHistory();
  const vnc = useRef(null);
  const forceRender = useForceRender();
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
      onConfigured={(newName, newSize) => {
        session.name = newName;
        session.geometry = newSize;
        forceRender();
      }}
      onDisconnect={() => {
        if (vnc.current) {
          setConnectionState('disconnecting');
          vnc.current.onUserDisconnect();
        }
      }}
      onReconnect={onReconnect}
      onTerminate={() => setConnectionState('terminating')}
      onTerminated={() => history.push('/')}
      onZenChange={() => vnc.current && vnc.current.resize()}
      session={session}
      vnc={vnc}
    >
      <ErrorBoundary>
        <ConnectStateIndicator
          connectionState={connectionState}
          id={id}
          onReconnect={onReconnect}
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
  onConfigured,
  onDisconnect,
  onReconnect,
  onTerminate,
  onTerminated,
  onZenChange,
  session,
  vnc,
}) {

  return (
    <div className="centernav col-12 fullscreen">
      <div className="overflow-auto">
        <div className="row no-gutters">
          <div className="col">
              <div className="card-header toolbar text-light">
                <div className="row no-gutters">
                  <div className="col">
                    <div className="d-flex align-items-center">
                      <h5 className="flex-grow-1 mb-0">
                        <SessionHeaderText session={session}/>
                      </h5>
                      <Toolbar
                        connectionState={connectionState}
                        onConfigured={onConfigured}
                        onDisconnect={onDisconnect}
                        onReconnect={onReconnect}
                        onTerminate={onTerminate}
                        onTerminated={onTerminated}
                        onZenChange={onZenChange}
                        session={session}
                        vnc={vnc}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="fullscreen-content">
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
  onConfigured,
  onDisconnect,
  onReconnect,
  onTerminate,
  onTerminated,
  onZenChange,
  session,
  vnc,
}) {
  const { addToast } = useToast();

  function handlePaste(text) {
    vnc.current.setClipboardText(text);
    const body = (
      <div>
        Your session's clipboard has been updated. You can now paste
        normally within your session.
      </div>
    );
    addToast({body: body, icon: 'success', header: 'Paste prepared'});
  }

  function handleFallbackError() {
    console.log('Giving up.');  // eslint-disable-line no-console
    const body = (
      <div>
        An unexpected error has occurred whilst preparing paste.  Please
        contact your system administrator for further assistance.
      </div>
    );
    addToast({body, icon: 'danger', header: 'Unexpected error' });
  }

  return (
    <div className="btn-toolbar" style={{ minHeight: '31px' }}>
      <FullscreenButton onZenChange={onZenChange} />
      <div className="dropdown">
        <a aria-expanded="false"
           aria-haspopup="true"
           className="link white-text dropdown-toggle no-caret"
           data-toggle="dropdown"
           id="dropdownMenuButton"
        >
          <i className="fa-solid fa-bars pl-2"></i>
        </a>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {connectionState === 'connected' &&
            <a
              className="dropdown-item"
              onClick={onDisconnect}
              tabIndex={0}
            >
              Disconnect
            </a>
          }
          {connectionState === 'disconnected' &&
            <a
              className="dropdown-item"
              onClick={onReconnect}
              tabIndex={0}
            >
              Reconnect
            </a>
          }
          {connectionState === 'connected' &&
            <PreparePasteButton
              className="dropdown-item"
              onPaste={handlePaste}
              onFallbackError={handleFallbackError}
              onFallbackPaste={handlePaste}
            />
          }
          {session != null &&
            <ConfigureButton
              className="dropdown-item"
              onConfigured={onConfigured}
              session={session}
            />
          }
          {session != null &&
            <TerminateButton
              className="dropdown-item"
              onTerminate={onTerminate}
              onTerminated={onTerminated}
              session={session}
            />
          }
        </div>
      </div>
    </div>
  );
}

function ConnectStateIndicator({ connectionState, id, onReconnect }) {
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
      <Screenshot id={id} />
      <Overlay>{indicator}</Overlay>
    </div>
  );
}

function Screenshot({ id }) {
  return (
    <WrappedScreenshot
      className={`d-block m-auto ${styles.NoVNCWrapper}`}
      session={{ id }}
    />
  );
}

export default SessionPage;
