import React from 'react';
import { Route, Switch, } from "react-router-dom";

import BrandBar from './BrandBar';
import ErrorBoundary from './ErrorBoundary';
import Footer from './Footer';

function AppLayout({ children }) {
  return (
    <>
    <BrandBar />
    <div
      className="container-fluid"
      id="main"
    >
      <div id="toast-portal"></div>
      <div className="row content">
        <SideNav />
        <div className="col centernav mt-4">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
        <SideNav />
      </div>
    </div>
    <Footer />
    </>
  );
}

function SideNav() {
  const routes = [
    { path: "/sessions/new", show: true },
    { path: "/sessions/:id", show: false },
    { path: "/",             show: true },
  ];

  return (
    <Switch>
      { routes.map((route, index) =>
        <Route
          key={index}
          path={route.path}
        >
          {
            route.show ?
            <div className="col-sm-2 sidenav"></div> :
            null
          }
        </Route>
      )}
    </Switch>
  );
}

export default AppLayout;
