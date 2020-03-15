import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import AuthenticatedRoute from './AuthenticatedRoute';
import BrandBar from './BrandBar';
import Dashboard from './Dashboard';
import ErrorBoundary from './ErrorBoundary';
import FetchProvider from './FetchProvider';
import Footer from './Footer';
import SessionPage from './SessionPage';
import SessionsPage from './SessionsPage';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import { SessionsProvider } from './SessionsContext';

function App() {
  return (
    <div className="App">
      <Router>
        <CurrentUserProvider>
          <FetchProvider>
            <SessionsProvider>
              <BrandBar />
              <div
                className="container-fluid"
                id="main"
              >
                <div className="row content">
                  <div className="col-sm-2 sidenav"></div>
                  <div className="col centernav mt-4">
                    <ErrorBoundary>
                      <Switch>
                        <AuthenticatedRoute path="/sessions/new">
                          <div className="text-center">
                            XXX TBD
                          </div>
                        </AuthenticatedRoute>
                        <AuthenticatedRoute path="/sessions/:id">
                          <SessionPage />
                        </AuthenticatedRoute>
                        <AuthenticatedRoute path="/sessions">
                          <SessionsPage />
                        </AuthenticatedRoute>
                        <Route path="/">
                          <Dashboard />
                        </Route>
                      </Switch>
                    </ErrorBoundary>
                  </div>
                  <div className="col-sm-2 sidenav"></div>
                </div>
              </div>
              <Footer />
            </SessionsProvider>
          </FetchProvider>
        </CurrentUserProvider>
      </Router>
    </div>
  );
}

export default App;
