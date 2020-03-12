import React from 'react';

import NoVNC from './NoVNC';
import ErrorBoundary from './ErrorBoundary';

function SessionPage() {
  const session = {
    "desktop": "terminal",
    "hostname": "gateway1",
    "id": "d58cc7aa-768e-453a-8b1a-585679645155",
    "image": null,
    "ip": "54.77.246.95",
    "password": "rZjgqb0L",
    "port": "5903",
    "websocket_port": "41363",
  };
  const sessionName = session.name || session.id.split('-')[0];
  const websocketPort = session.websocket_port || session.port;
  const sessionUrl = session.url || `ws://localhost:9090/ws/127.0.0.1/${websocketPort}`;

  return (
    <div className="overflow-auto">
      <div className="row no-gutters">
        <div className="col">
          <div className="card border-primary">
            <div className="card-header bg-primary text-light">
              <div className="row no-gutters">
                <div className="col">
                  <h5>
                    {sessionName}
                  </h5>
                </div>
                <div className="col-2">
                  <button
                    className="btn btn-secondary btn-sm float-right"
                    onClick={() => {
                      console.log('Need to disconnect now');
                    }}
                  >
                    <i className="fa fa-times mr-1"></i>
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <ErrorBoundary>
                <NoVNC
                  connectionName={sessionUrl}
                  isSecure={false}
                  password={session.password}
                  onBeforeConnect={() => {
                    console.log('about to connect')
                  }}
                  onDisconnected={(e) => {
                    console.log('disconnected', e);
                  }}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionPage;
