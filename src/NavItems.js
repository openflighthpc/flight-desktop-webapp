import classNames from 'classnames';
import { useContext } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { CurrentUserContext } from 'flight-webapp-components';

import LaunchDropdown from './LaunchDropdown'

function NavItems({ includeHome=true }) {
  const { currentUser } = useContext(CurrentUserContext);

  if (currentUser == null) {
    return null;
  }

  return (
    <>
    { includeHome ? <NavLink path="/">Home</NavLink> : null }
    <NavLink path="/sessions">Sessions</NavLink>
    <li className="nav-item dropdown">
      <LaunchDropdown className="nav-link nav-menu-button" color="link"/>
    </li>
    <NavLink path="/configs">Configuration</NavLink>
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
