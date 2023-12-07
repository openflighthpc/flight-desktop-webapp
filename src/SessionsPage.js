import React from 'react';
import { Link } from "react-router-dom";

import {
  Overlay,
  OverlayContainer,
  Spinner,
  UnauthorizedError,
  DefaultErrorMessage,
  utils,
  // useInterval,
  useMediaGrouping,
} from 'flight-webapp-components';

import SessionCard from './SessionCard';
import styles from './SessionsPage.module.css';
import { useFetchSessions } from './api';
import { useInterval } from './utils';

function SessionsPage() {
  const { data, error, loading, get } = useFetchSessions();
  useInterval(get, 1 * 60 * 1000);

  if (error) {
    if (utils.errorCode(data) === 'Unauthorized') {
      return <UnauthorizedError />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    const sessions = utils.getResourcesFromResponse(data);
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
      <p className="tagline mt-4">
        No sessions found.
      </p>
      <NewDesktopButton
        className="mt-5"
      />
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
        <div key={index} className="desktops app-card-deck">
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
      <InfoRow sessions={sessions} />
      {decks}
    </React.Fragment>
  );
}

function InfoRow({ sessions }) {
  const sessionOrSessions = sessions.length === 1 ? 'session' : 'sessions';

  return (
    <div className={`row justify-content-between mb-3`}>
      <p className={`tagline mb-0`}>
        You have {sessions.length} desktop {sessionOrSessions} currently running.
      </p>
      <NewDesktopButton />
    </div>
  );
}

function NewDesktopButton({ className }) {
  return(
    <Link
      to="/sessions/new"
      className={className + " button link"}
    >
      NEW DESKTOP
    </Link>
  );
}

export default SessionsPage;
