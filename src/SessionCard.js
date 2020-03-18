import React from 'react';
import { Link } from "react-router-dom";

import { CardFooter } from './CardParts';
import placeholderImage from './placeholder.jpg';
import { useTerminateSession } from './api';

const prettyDesktopName = {
  chrome: "Google Chrome browser session",
  gnome: "GNOME v3",
  kde: "KDE Plasma Desktop",
  terminal: "Terminal",
  xfce: "Xfce desktop",
  xterm: "xterm",
};

function SessionCard({ reload, session }) {
  const session_name = session.name || session.id.split('-')[0];
  const { loading, del } = useTerminateSession(session.id);
  const terminateSession = () => {
    del().then(() => reload());
  };

  return (
    <div className="col-sm-6 col-lg-4">
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
              <img
                className="card-img"
                src={
                  session.image == null ?
                    placeholderImage :
                    `data:image/png;base64,${session.image}`
                }
                alt="Session screenshot"
              />
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
            <button
              className={`btn btn-danger ${loading ? 'disabled' : null}`}
              onClick={terminateSession}
              disabled={loading}
            >
              {
                loading ?
                  <i className="fa fa-spinner fa-spin mr-1"></i> :
                  <i className="fa fa-trash mr-1"></i>
              }
              <span>{ loading ? 'Terminating...' : 'Terminate' }</span>
            </button>
          </div>
        </CardFooter>
      </div>
    </div>
  );
}

export default SessionCard;
