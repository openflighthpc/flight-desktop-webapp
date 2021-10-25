import classNames from 'classnames';
import { useContext } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { CurrentUserContext } from 'flight-webapp-components';

import QuickLaunchButton from './QuickLaunchButton'

function NavItems() {
  const { currentUser } = useContext(CurrentUserContext);

  if (currentUser == null) {
    return null;
  }

  return (
    <>
    <NavLink path="/">Home</NavLink>
    <NavLink path="/sessions">My sessions</NavLink>
    <li className="nav-item">
      <QuickLaunchButton className="nav-link nav-menu-button" color="link"/>
    </li>
    <NavLink path="/sessions/new">Launch new session</NavLink>
    <NavLink path="/configs">My configuration</NavLink>
    </>
  );
}

function NavLink({ path, children }) {
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <li className={classNames("nav-item", { active: active})}>
      <Link
        className={classNames("nav-link nav-menu-button", { active: active })}
        to={path}
      >
        {children}
      </Link>
    </li>
  );
}

export default NavItems;
