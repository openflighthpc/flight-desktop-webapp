import React from 'react';
import { Link } from "react-router-dom";

import { CardFooter } from './CardParts';
import placeholderImage from './placeholder.jpg';

const prettyDesktopName = {
  chrome: "Google Chrome browser session",
  gnome: "GNOME v3",
  kde: "KDE Plasma Desktop",
  terminal: "Terminal",
  xfce: "Xfce desktop",
  xterm: "xterm",
};

function SessionCard({ session }) {
  const name = session.name || session.id.split('-')[0];

  return (
    <div className="col-sm-6 col-lg-4">
      <div className="card border-primary mb-2">
        <h5 className="card-header bg-primary text-light">
          {name}
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
              to="/XXX"
            >
              <i className="fa fa-bolt mr-1"></i>
              <span>Connect</span>
            </Link>
            <Link
              className="btn btn-danger"
              to="/XXX"
            >
              <i className="fa fa-trash mr-1"></i>
              <span>Terminate</span>
            </Link>
          </div>
        </CardFooter>
      </div>
    </div>
  );
}

export default SessionCard;
