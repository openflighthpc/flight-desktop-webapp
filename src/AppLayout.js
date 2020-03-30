import React from 'react';
import { Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import AuthenticatedRoute from './AuthenticatedRoute';
import BrandBar from './BrandBar';
import ErrorBoundary from './ErrorBoundary';
import Footer from './Footer';
import routes from './routes';

function AppLayout({ children }) {
  return (
    <>
    <BrandBar />
    <div
      className="container-fluid"
      id="main"
    >
      <div id="toast-portal"></div>
      <div className="content">
        {routes.map(({ path, Component, authenticated, sideNav }) => {
          const MyRoute = authenticated ? AuthenticatedRoute : Route;
          return (
            <MyRoute key={path} exact path={path}>
              {({ match }) => { 
                return (
                  <CSSTransition
                    in={match != null}
                    timeout={300}
                    classNames="page"
                    unmountOnExit
                  >
                    <div className="page row">
                      <ErrorBoundary>
                        { sideNav ? <SideNav /> : null }
                        <div className="col centernav mt-4">
                          <Component />
                        </div>
                        { sideNav ? <SideNav /> : null }
                      </ErrorBoundary>
                    </div>
                  </CSSTransition>
                );
              }}
            </MyRoute>
          );
        })}
      </div>
    </div>
    <Footer />
    </>
  );
}

function SideNav() {
  return (
    <div className="col-sm-2 sidenav"></div>
  );
}

export default AppLayout;
