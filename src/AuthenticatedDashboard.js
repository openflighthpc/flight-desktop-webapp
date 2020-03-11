import React, { useContext } from 'react';
import { Link } from "react-router-dom";

import { CardFooter } from './CardParts';
import Logo from './png_trans_logo.png';
import { Context as CurrentUserContext } from './CurrentUserContext';

function AuthenticatedDashboard() {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <div>
      <img
        src={Logo}
        alt="OpenflightHPC Logo"
        className="center"
        width="100%"
      >
      </img>

      <p>
        You are signed in as {currentUser.username}.
      </p>

      <div className="card-deck">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">
              View your running desktop sessions
            </h5>
            <p className="card-text">
              You can view your running desktops session by clicking on the
              button below.
            </p>
            <p className="card-text">
              You will be able to establish a connection or shutdown a desktop
              session.
            </p>
          </div>
          <CardFooter>
            <Link
              className="btn btn-success btn-block"
              to="/sessions"
            >
              <i className="fa fa-desktop mr-1"></i>
              <span>View sessions</span>
            </Link>
          </CardFooter>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">
              Start a new desktop session
            </h5>
            <p className="card-text">
              You can click the <i>Launch</i> button to fire up a new
              desktop session.
            </p>
          </div>
          <CardFooter>
            <Link
              className="btn btn-success btn-block"
              to="/sessions/new"
            >
              <i className="fa fa-rocket mr-1"></i>
              <span>Launch</span>
            </Link>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}


export default AuthenticatedDashboard;
