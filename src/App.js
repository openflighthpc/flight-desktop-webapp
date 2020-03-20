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
import NewSessionPage from './NewSessionPage';
import SessionPage from './SessionPage';
import SessionsPage from './SessionsPage';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

function App() {
  return (
    <div className="App">
      <Router basename="/desktop">
        <CurrentUserProvider>
          <FetchProvider>
            <AppLayout>
              <Switch>
                <AuthenticatedRoute path="/sessions/new">
                  <NewSessionPage />
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
          </FetchProvider>
        </CurrentUserProvider>
      </Router>
    </div>
  );
}

export default App;
