import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import AuthenticatedRoute from './AuthenticatedRoute';
import BrandBar from './BrandBar';
import Footer from './Footer';
import Dashboard from './Dashboard';
import SessionsPage from './SessionsPage';
import SessionPage from './SessionPage';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import { SessionsProvider } from './SessionsContext';

function App() {
  return (
    <div className="App">
      <Router>
        <CurrentUserProvider>
          <SessionsProvider>
            <BrandBar />
            <div
              className="container-fluid"
              id="main"
            >
              <div className="row content">
                <div className="col-sm-2 sidenav"></div>
                <div className="col centernav mt-4">

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

                </div>
                <div className="col-sm-2 sidenav"></div>
              </div>
            </div>
            <Footer />
          </SessionsProvider>
        </CurrentUserProvider>
      </Router>
    </div>
  );
}

export default App;
