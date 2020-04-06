import React from 'react';
import styled from 'styled-components'
import { Link } from "react-router-dom";

import Overlay, { OverlayContainer } from './Overlay';
import SessionCard from './SessionCard';
import Spinner from './Spinner';
import UnauthorizedError from './UnauthorizedError';
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
      <React.Fragment>
        {
          loading && (
            <OverlayContainer>
              <Overlay>
                <Spinner
                  text={ sessions == null ? 'Loading sessions...' : 'Refreshing sessions...' }
                />
              </Overlay>
            </OverlayContainer>
          )
        }
        { sessions != null && <SessionsList sessions={sessions} reload={get} /> }
      </React.Fragment>
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

  return (
    <React.Fragment>
      <IntroCard sessions={sessions} />
      {decks}
    </React.Fragment>
  );
}

const IntroCard = styled(({ className, sessions }) => {
  const sessionOrSessions = sessions.length === 1 ? 'session' : 'sessions';

  return (
    <div className={`${className} card card-body mb-2`}>
      <p className="card-text">
        You have {sessions.length} currently running desktop
        {' '}{sessionOrSessions}.  Use the <i>Connect</i> button to establish
        a connection to a desktop session or the <i>Terminate</i> button to
        shutdown a desktop session.
      </p>
    </div>
  );
})`
  :before {
    color: var(--success);
    content: "\f108";
    font-family: FontAwesome;
    opacity: 0.2;
    position: absolute;
    top: 50%;
    left: 24px;
    bottom: unset;
    right: 32px;
    right: unset;
    transform: translateY(-50%);
    font-size: 3em;
  }

  .card-text {
    padding-left: 64px;
  }
`;

export default SessionsPage;
