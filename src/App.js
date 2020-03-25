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
import { Provider as ConfigProvider } from './ConfigContext';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import * as Toast from './ToastContext';

function App() {
  return (
    <div className="App">
      <ConfigProvider>
        <Router basename={process.env.REACT_APP_MOUNT_PATH}>
          <CurrentUserProvider>
            <Toast.Provider>
              <Toast.Container />
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
            </Toast.Provider>
          </CurrentUserProvider>
        </Router>
      </ConfigProvider>
    </div>
  );
}

export default App;
