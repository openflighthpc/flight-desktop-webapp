import { useContext } from 'react';
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";

import {
  AnimatedRouter,
  AuthenticatedRoute,
  BrandBar,
  ConfigContext,
  Footer,
} from 'flight-webapp-components';

import NavItems from './NavItems';
import styles from './AppLayout.module.css';
import { routes, unconfiguredRoutes } from './routes';

function AppLayout() {
  const { unconfigured } = useContext(ConfigContext);
  const accountMenuItems = {
    signedIn: [
      <Link to="/configs" className="nav nav-link dropdown-item">
        Configuration
      </Link>
    ]
  }


  return (
    <>
    <BrandBar
      className="brandbar"
      navItems={<NavItems includeHome={false} />}
      accountMenuItems={accountMenuItems}
    />
    <div
      className="container-fluid"
      id="main"
    >
      <div id="toast-portal" className={styles.ToastPortal}></div>
      <div className="content">
        <AnimatedRouter
          AuthenticatedRoute={AuthenticatedRoute}
          Redirect={Redirect}
          Route={Route}
          Switch={Switch}
          exact={!unconfigured}
          routes={unconfigured ? unconfiguredRoutes : routes}
          sideNav={SideNav}
          useLocation={useLocation}
        />
      </div>
    </div>
    <Footer />
    </>
  );
}

function SideNav() {
  return (
    <div className="sidenav col-sm-2"></div>
  );
}

export default AppLayout;
