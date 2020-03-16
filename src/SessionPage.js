import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import NoVNC from './NoVNC';
import Spinner from './Spinner';
import { DefaultErrorMessage } from './ErrorBoundary';
import { useFetchSession } from './api';

function SessionPage() {
  const { id } = useParams();
  const {
    data: session,
    error: sessionLoadingError,
    loading: sessionLoading,
  } = useFetchSession(id);
  const sessionName = id.split('-')[0];
  const vnc = useRef(null);
  const [connectionState, setConnectionState] = useState('connecting');

  if (sessionLoading) {
    return (
      <Layout headerText={sessionName}>
        <Spinner text="Loading session..." />
      </Layout>
    );
  } else if (sessionLoadingError) {
    return <DefaultErrorMessage />;
  } else {
    let websocketPort = session.websocketPort || session.port;
    websocketPort = Number.parseInt(websocketPort, 10) + 35460;
    const sessionUrl = session.url || `ws://localhost:9090/ws/127.0.0.1/${websocketPort}`;
    return (
      <Layout
        connectionState={connectionState}
        headerText={sessionName}
        onDisconnect={() => {
          if (vnc.current) {
            setConnectionState('disconnecting');
            vnc.current.onUserDisconnect();
          }
        }}
        onReconnect={() => {
          if (vnc.current) {
            setConnectionState('connecting');
            vnc.current.onReconnect();
          }
        }}
      >
        <ErrorBoundary>
          <ConnectStateIndicator connectionState={connectionState} />
          <div className={connectionState === 'connected' ? 'd-block' : 'd-none'}>
            <NoVNC
              connectionName={sessionUrl}
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
}

function Layout({
  children,
  connectionState,
  headerText,
  onDisconnect,
  onReconnect,
  onTerminate,
}) {
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
                      {headerText}
                    </h5>
                    <Toolbar
                      connectionState={connectionState}
                      onDisconnect={onDisconnect}
                      onReconnect={onReconnect}
                      onTerminate={onTerminate}
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

  const terminateBtn = (
    <button
      className="btn btn-danger btn-sm"
      onClick={onTerminate}
    >
      <i className="fa fa-trash mr-1"></i>
      <span>Terminate session</span>
    </button>
  );

  return (
    <div className="btn-toolbar">
      {disconnectBtn}
      {reconnectBtn}
      {terminateBtn}
    </div>
  );
}

function ConnectStateIndicator({ connectionState }) {
  switch (connectionState) {
    case 'connecting':
      return (<Spinner text="Initializing connection..." />);
    case 'disconnecting':
      return (<Spinner text="Disconnecting..." />);
    case 'disconnected':
      return (<div className="text-center">Session has been disconnected.</div>);
    default:
      return null;
  }
}

export default SessionPage;
