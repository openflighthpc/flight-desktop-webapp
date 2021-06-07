import React, { useContext, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useToast } from './ToastContext';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import {
  ConfigContext,
  DefaultErrorMessage,
  ErrorBoundary,
  FullscreenButton,
  Overlay,
  Spinner,
} from 'flight-webapp-components';

import NoVNC from './NoVNC';
import TerminateButton from './TerminateButton';
import WrappedScreenshot from './Screenshot';
import styles from './NoVNC.module.css';
import { useFetchSession } from './api';

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
    const apiUrl = new URL(config.apiRootUrl, window.location.origin);
    const wsUrl = new URL(config.apiRootUrl, window.location.origin);

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

  if (sessionLoading) {
    return <Loading id={id} />;
  } else if (sessionLoadingError) {
    return <DefaultErrorMessage />;
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
      onTerminate={() => setConnectionState('terminating')}
      onTerminated={() => history.push('/sessions')}
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
  onDisconnect,
  onReconnect,
  onTerminate,
  onTerminated,
  onZenChange,
  session,
  vnc,
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
                      onTerminated={onTerminated}
                      onZenChange={onZenChange}
                      session={session}
                      vnc={vnc}
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
  onTerminated,
  onZenChange,
  session,
  vnc,
}) {
  const { addToast } = useToast();
  const fallbackText = useRef();
  const [showFallback, setShowFallback] = useState(false);

  const toggleFallback = function() {
    try {
      fallbackText.current.value = "";
    } catch(e) {
      console.log("Failed to clear textarea:", e);
    }
    setShowFallback(!showFallback);
  }

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
      className="btn-sm mr-1"
      session={session}
      onTerminate={onTerminate}
      onTerminated={onTerminated}
    >
    </TerminateButton>
  ) : null;

  const fullscreenBtn = <FullscreenButton onZenChange={onZenChange} />;

  const pasteButton = <React.Fragment>
    <button
      className="btn btn-sm btn-light"
      onClick={async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text !== "" && this.vnc.current) {
            this.vnc.current.setClipboardText(text);
          }
        } catch (e) {
          console.log('e:', e);  // eslint-disable-line no-console
          if (navigator.userAgent.indexOf("Firefox") !== -1) {
            console.log("Attempting firefox fallback");
            toggleFallback();

          } else { // The paste will fail unless using HTTPs
            console.log("Paste failed!");
            var body = (
              <div>
                Paste is currently disabled! Please contact your system
                administrator for further assistance.
              </div>
            );
            addToast({body, icon: 'danger', header: 'Paste Disabled' });
          }
        }
      }}
    >
      <i className="fa fa-paste mr-1"></i>
      Prepare paste
    </button>
    <Modal isOpen={showFallback} toggle={toggleFallback}>
      <ModalHeader>Paste Text</ModalHeader>
      <ModalBody>
        You must buffer the text before pasting within firefox.
        <textarea ref={fallbackText} style={{ width: "100%", height: "100%" }}></textarea>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-secondary" onClick={toggleFallback}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={ () => {
          try {
            vnc.current.setClipboardText(fallbackText.current.value);
          } catch(e) {
            console.log("e:", e);
          }
          toggleFallback();
        }}>
          Buffer
        </button>
      </ModalFooter>
    </Modal>
  </React.Fragment>

  return (
    <div className="btn-toolbar" style={{ minHeight: '31px' }}>
      {fullscreenBtn}
      {disconnectBtn}
      {reconnectBtn}
      {terminateBtn}
      {pasteButton}
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
