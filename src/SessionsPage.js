import React, { useContext, useEffect } from 'react';

import SessionCard from './SessionCard';
import { Context as CurrentUserContext } from './CurrentUserContext';
import { SessionsContext } from './SessionsContext';
import { retrievSessions } from './api';

function SessionsPage() {
  const { currentUser } = useContext(CurrentUserContext);
  const { state: sessionsState, actions } = useContext(SessionsContext);
  useEffect(
    () => { retrievSessions(actions); },
    [currentUser, actions],
  );

  switch (sessionsState.state) {
    case "uninitialised":
    case "loading":
      return <Spinner text="Loading sessions..."/>;
    case "loaded":
      return <SessionsList sessions={sessionsState.sessions} />;
    case "errored":
    default:
      return <Error errors={sessionsState.errors} />;
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

function Error({ errors }) {
  return (
    <div>
      Ooops.  Something went wrong.
    </div>
  );
}

function SessionsList({ sessions }) {
  const cards = sessions.map((session) => <SessionCard session={session} />);
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
