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
      <div className="row content">
        <Switch>
          <Route path="/sessions/:id">
            {/* Don't render the sidenavs on the session page. */}
          </Route>
          <Route path="/">
            <div className="col-sm-2 sidenav"></div>
          </Route>
        </Switch>
        <div className="col centernav mt-4">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
        <Switch>
          <Route path="/sessions/:id">
            {/* Don't render the sidenavs on the session page. */}
          </Route>
          <Route path="/">
            <div className="col-sm-2 sidenav"></div>
          </Route>
        </Switch>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default AppLayout;
