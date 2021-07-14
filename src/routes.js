import Dashboard from './Dashboard';
import DesktopsPage from './DesktopsPage';
import SessionPage from './SessionPage';
import SessionsPage from './SessionsPage';
import UnconfiguredDashboard from './UnconfiguredDashboard';
import NotFoundDashboard from './NotFoundDashboard';

// We need this to prevent the route for `/sessions/:id` from matching the
// string `/sessions/new`.
const uuidRegExp = '\\b[0-9a-f]{8}\\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\\b[0-9a-f]{12}\\b'

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
    path: '/',
    name: 'Home',
    Component: Dashboard,
    sideNav: true,
  },
  {
    name: 'Not found',
    Component: NotFoundDashboard,
    sideNav: true
  },
]

const unconfiguredRoutes = [
  {
    path: '/',
    name: 'Home',
    Component: UnconfiguredDashboard,
    sideNav: true,
  },
  {
    name: 'Not found',
    Component: NotFoundDashboard,
    sideNav: true
  },
];

export {
  routes,
  unconfiguredRoutes,
};
