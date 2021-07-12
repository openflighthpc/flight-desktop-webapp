import { useContext } from 'react';
import { Link } from "react-router-dom";

import { CurrentUserContext, useEnvironment } from 'flight-webapp-components';

import QuickLaunchButton from './QuickLaunchButton'

function NavItems() {
  const { currentUser } = useContext(CurrentUserContext);
  const environment = useEnvironment();

  const homeNav = (
    <li className="nav-item">
      <a
        className="nav-link nav-menu-button"
        href="/"
      >
        {environment('environment.name') || 'Home'}
      </a>
    </li>
  );

  if (currentUser == null) {
    return homeNav;
  }

  return (
    <>
    {homeNav}
    <li className="nav-item">
      <Link
        className="nav-link nav-menu-button"
        to="/sessions"
      >
        My sessions
      </Link>
    </li>
    <li className="nav-item">
      <Link
        className="nav-link nav-menu-button"
        to="/sessions/new"
      >
        Launch new session
      </Link>
    </li>
    <li className="nav-item">
      <Link
        className="nav-link nav-menu-button"
        to="/configs"
      >
        My Configuration
      </Link>
    </li>
    <QuickLaunchButton/>
    </>
  );
}

export default NavItems;
