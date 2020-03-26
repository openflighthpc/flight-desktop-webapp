import React from 'react';
import { Link } from "react-router-dom";

import SessionCard from './SessionCard';
import Spinner from './Spinner';
import { DefaultErrorMessage } from './ErrorBoundary';
import { errorCode, isObject, useInterval } from './utils';
import { useFetchSessions } from './api';
import { useMediaGrouping } from './useMedia';

function getSessionsFromResponse(data) {
  if (!isObject(data)) { return null; }
  if (!Array.isArray(data.data)) { return null; }
  return data.data;
}

function SessionsPage() {
  const { data, error, loading, get } = useFetchSessions();
  useInterval(get, 1 * 60 * 1000);

  if (error) {
    if (errorCode(data) === 'Unauthorized') {
      return <UnauthorizedError />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    const sessions = getSessionsFromResponse(data);
    return (
      <>
      { loading && <Spinner text="Loading sessions..."/> }
      { sessions != null && <SessionsList sessions={sessions} reload={get} /> }
      </>
    );
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

function SessionsList({ reload, sessions }) {
  const { groupedItems: groupedSessions, perGroup } = useMediaGrouping(
    ['(min-width: 1200px)', '(min-width: 992px)', '(min-width: 768px)', '(min-width: 576px)'],
    [3, 2, 2, 1],
    1,
    sessions || [],
  );
  if (sessions == null || !sessions.length) {
    return <NoSessionsFound />;
  }
  const decks = groupedSessions.map(
    (group, index) => {
      let blanks = null;
      if ( group.length < perGroup ) {
        const a = new Array(perGroup - group.length);
        a.fill(0);
        blanks = a.map((i, index) => <div key={index} className="card invisible"></div>)
      }
      return (
        <div key={index} className="card-deck">
          {
            group.map((session) => (
              <SessionCard key={session.id} reload={reload} session={session} />
            ))
          }
          {blanks}
        </div>
      );
    }
  );
  const sessionOrSessions = sessions.length === 1 ? 'session' : 'sessions';

  return (
    <div>
      <p>
        You have {sessions.length} currently running desktop
        {' '}{sessionOrSessions}.  Use the <i>Connect</i> button to establish
        a connection to a desktop session or the <i>Terminate</i> button to
        shutdown a desktop session.
      </p>
      {decks}
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
