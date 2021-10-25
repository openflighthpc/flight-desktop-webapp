import { Link } from 'react-router-dom';
import { NotFound } from 'flight-webapp-components';

import Dashboard from './Dashboard';
import DesktopsPage from './DesktopsPage';
import SessionPage from './SessionPage';
import SessionsPage from './SessionsPage';
import ConfigsPage from './ConfigsPage';
import UnconfiguredDashboard from './UnconfiguredDashboard';

// We need this to prevent the route for `/sessions/:id` from matching the
// string `/sessions/new`.
const uuidRegExp = '\\b[0-9a-f]{8}\\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\\b[0-9a-f]{12}\\b'

const notFoundRoute = {
  name: 'Not found',
  Component: () => (
    <NotFound
      homeLink={
        <Link
          className="btn btn-link"
          to="/"
        >
          <span>Move Along...</span>
        </Link>
      }
    />
  ),
  sideNav: true,
  key: 'notfound',
};

const routes = [
  {
    path: '/sessions/new',
    name: 'Launch new session',
    Component: DesktopsPage,
    authenticated: true,
    sideNav: true,
  },
  {
    path: `/sessions/:id(${uuidRegExp})`,
    name: 'Session',
    Component: SessionPage,
    authenticated: true,
    sideNav: false,
  },
  {
    path: '/sessions',
    name: 'Sessions',
    Component: SessionsPage,
    authenticated: true,
    sideNav: true,
  },
  {
    path: '/configs',
    name: 'Configs',
    Component: ConfigsPage,
    authenticated: true,
    sideNav: true,
  },
  {
    path: '/',
    name: 'Home',
    Component: Dashboard,
    sideNav: true,
  },
  notFoundRoute,
]

const unconfiguredRoutes = [
  {
    path: '/',
    name: 'Home',
    Component: UnconfiguredDashboard,
    sideNav: true,
  },
  notFoundRoute,
];

export {
  routes,
  unconfiguredRoutes,
};
