import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import AppLayout from './AppLayout';
import AuthenticatedRoute from './AuthenticatedRoute';
import Dashboard from './Dashboard';
import FetchProvider from './FetchProvider';
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
              <AppLayout>
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
              </AppLayout>
            </SessionsProvider>
          </FetchProvider>
        </CurrentUserProvider>
      </Router>
    </div>
  );
}

export default App;
