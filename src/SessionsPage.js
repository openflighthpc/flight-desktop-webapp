import React from 'react';

import {
  Overlay,
  OverlayContainer,
  Spinner,
  UnauthorizedError,
  DefaultErrorMessage,
  utils,
  // useInterval,
} from 'flight-webapp-components';

import SessionCard from './SessionCard';
import { useFetchSessions } from './api';
import { useInterval } from './utils';
import LaunchDropdown from "./LaunchDropdown";
import {Link} from "react-router-dom";

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
      <div className="d-flex justify-content-center mt-5">
        <InfoRowButtons/>
      </div>
    </div>
  );
}

function SessionsList({ reload, sessions }) {
  if (sessions == null || !sessions.length) {
    return <NoSessionsFound />;
  }

  return (
    <>
      <InfoRow sessions={sessions} />
      <div className="desktops app-card-deck">
        {
          sessions.map((session) => (
            <SessionCard key={session.id} reload={reload} session={session} />
          ))
        }
      </div>
    </>
  );
}

function InfoRow({ sessions }) {
  const sessionOrSessions = sessions.length === 1 ? 'session' : 'sessions';

  return (
    <div className={`row justify-content-between align-items-center mb-4`}>
      <span className={`tagline mb-0`}>
        You have {sessions.length} desktop {sessionOrSessions} currently running.
      </span>
      <div className="d-flex">
        <InfoRowButtons/>
      </div>
    </div>
  );
}

function InfoRowButtons() {
  return (
    <>
      <LaunchDropdown/>
      <Link
        className="button link white-text px-3 ml-2"
        title="Default desktop settings"
        to="/configs"
      >
        <i className="fa fa-solid fa-cog"></i>
      </Link>
    </>
  )
}

export default SessionsPage;
