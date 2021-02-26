import { useContext } from 'react';
import { Link } from "react-router-dom";

import { CurrentUserContext } from 'flight-webapp-components';

function NavItems() {
  const { currentUser } = useContext(CurrentUserContext);
  if (currentUser == null) { return null; }

  return (
    <>
    <li className="nav-item">
      <Link
        className="nav-link nav-menu-button"
        to="/"
      >
        Home
      </Link>
    </li>
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
    </>
  );
}

export default NavItems;
