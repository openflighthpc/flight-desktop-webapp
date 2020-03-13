import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from 'use-http';

import ErrorBoundary from './ErrorBoundary';
import NoVNC from './NoVNC';
import Spinner from './Spinner';
import { DefaultErrorMessage } from './ErrorBoundary';

function buildUrl(id) {
  const port = 41363;
  const password = 'rZjgqb0L';

  return `http://localhost:8000?id=${id}&port=${port}&password=${password}`;
}

function SessionPage() {
  const { id } = useParams();
  const { loading, error, data: session } = useFetch(buildUrl(id), {}, [ id ]);
  const sessionName = id.split('-')[0];

  if (loading) {
    return (
      <Layout headerText={sessionName}>
        <Spinner text="Loading session..." />
      </Layout>
    );
  } else if (error) {
    return <DefaultErrorMessage />;
  } else {
    const websocketPort = session.websocketPort || session.port;
    const sessionUrl = session.url || `ws://localhost:9090/ws/127.0.0.1/${websocketPort}`;
    return (
      <Layout headerText={sessionName}>
        <ErrorBoundary>
          <NoVNC
            connectionName={sessionUrl}
            password={session.password}
            onBeforeConnect={() => {
              console.log('about to connect')
            }}
            onDisconnected={(e) => {
              console.log('disconnected', e);
            }}
          />
        </ErrorBoundary>
      </Layout>
    );
  }
}

function Layout({ children, sessionName }) {
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
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionPage;
