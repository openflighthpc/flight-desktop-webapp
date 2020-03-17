import React from 'react';
import { Link } from "react-router-dom";

import SessionCard from './SessionCard';
import Spinner from './Spinner';
import { DefaultErrorMessage } from './ErrorBoundary';
import { errorCode } from './utils';
import { useFetchSessions } from './api';

function SessionsPage() {
  const { data, error, loading } = useFetchSessions();

  if (loading) {
    return <Spinner text="Loading sessions..."/>;
  } else if (error) {
    if (errorCode(data) === 'Unauthorized') {
      return <UnauthorizedError />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    return <SessionsList sessions={data} />;
  }
}

function NoSessionsFound() {
  return (
    <div>
      <p>
        No sessions found.  You may want to <Link to="/sessions/new">start a
          new session</Link>.
      </p>
    </div>
  );
}

function SessionsList({ sessions }) {
  if (!sessions.length) {
    return <NoSessionsFound />;
  }
  const cards = sessions.map(
    (session) => <SessionCard key={session.id} session={session} />
  );
  return (
    <div>
      <p>
        You have {sessions.length} currently running desktop sessions.  Use
        the <i>Connect</i> button to establish a connection to a desktop
        session or the <i>Terminate</i> button to shutdown a desktop session.
      </p>
      <div className="row">
        {cards}
      </div>
    </div>
  );
}

function UnauthorizedError() {
  return (
    <div className="card">
      <div className="card-body">
        <h3>Unauthorized</h3>
        <p>
          There was a problem authorizing your username and password.  Please
          check that they are entered correctly and try again.
        </p>
      </div>
    </div>
  );
}

export default SessionsPage;
