import React from 'react';
import { Link } from "react-router-dom";

import TerminateButton from './TerminateButton';
import placeholderImage from './placeholder.jpg';
import { CardFooter } from './CardParts';
import { prettyDesktopName, useInterval } from './utils';
import { useFetchScreenshot, useTerminateSession } from './api';

function SessionCard({ reload, session }) {
  const { get: getScreenshot, image: screenshot } = useFetchScreenshot(session.id);
  useInterval(getScreenshot, 1 * 60 * 1000, { immediate: false });
  const session_name = session.name || session.id.split('-')[0];
  const { loading, del } = useTerminateSession(session.id);
  const terminateSession = () => {
    del().then(() => reload());
  };

  return (
      <div
        className="card border-primary mb-2"
        data-testid="session-card"
      >
        <h5 className="card-header bg-primary text-light">
          {session_name}
        </h5>
        <div className="card-body">
          <div className="row mb-2">
            <div className="col">
              <Link to={`/sessions/${session.id}`}>
                <img
                  className="card-img"
                  src={
                    screenshot != null ?
                      `data:image/png;base64,${screenshot}` :
                      placeholderImage
                  }
                  alt="Session screenshot"
                />
              </Link>
            </div>
          </div>
          <dl className="row">
            <dt
              className="col-sm-4 text-truncate"
              title="Desktop"
            >
              Desktop
            </dt>
            <dd
              className="col-sm-8 text-truncate"
              title={prettyDesktopName[session.desktop]}
            >
              {prettyDesktopName[session.desktop]}
            </dd>
          </dl>
        </div>
        <CardFooter>
          <div className="btn-toolbar justify-content-center">
            <Link
              className="btn btn-primary mr-2"
              to={`/sessions/${session.id}`}
            >
              <i className="fa fa-bolt mr-1"></i>
              <span>Connect</span>
            </Link>
            <TerminateButton
              session={session}
              terminateSession={terminateSession}
              terminating={loading}
            />
          </div>
        </CardFooter>
      </div>
  );
}

export default SessionCard;
