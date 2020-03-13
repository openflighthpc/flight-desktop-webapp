import React, { useContext, useEffect } from 'react';
import { Link } from "react-router-dom";

import SessionCard from './SessionCard';
import { Context as CurrentUserContext } from './CurrentUserContext';
import { SessionsContext } from './SessionsContext';
import { retrievSessions } from './api';
import { DefaultErrorMessage } from './ErrorBoundary';

function SessionsPage() {
  const { currentUser } = useContext(CurrentUserContext);
  const { sessions, actions } = useContext(SessionsContext);
  useEffect(
    () => { retrievSessions(actions); },
    [currentUser, actions],
  );

  switch (sessions.state) {
    case "uninitialised":
    case "loading":
      return <Spinner text="Loading sessions..."/>;
    case "loaded":
      return <SessionsList sessions={sessions.data} />;
    case "errored":
    default:
      return <DefaultErrorMessage />;
  }
}

function Spinner({ text }) {
  return (
    <div className="text-center">
      <i className="fa fa-spinner fa-spin mr-1"></i>
      {text}
    </div>
  );
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

export default SessionsPage;
