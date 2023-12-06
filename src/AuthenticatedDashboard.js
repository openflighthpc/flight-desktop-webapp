import { Link } from "react-router-dom";

import Blurb from './Blurb';
import { CardFooter } from './CardParts';

function AuthenticatedDashboard() {
  return (
    <>
      <div
        className="centernav col-8"
      >
        <Blurb />
        <div className="card-deck">
          <div className="card">
            <div className="card-body fa-background fa-background-desktop">
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
            <div className="card-body fa-background fa-background-rocket">
              <h5 className="card-title text-center">
                Start a new desktop session
              </h5>
              <p className="card-text">
                You can launch a new desktop session by clicking on the button
                below and selecting the desktop session you wish to launch.
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
    </>
  );
}


export default AuthenticatedDashboard;
