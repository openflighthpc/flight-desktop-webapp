import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { render } from '@testing-library/react';

import {
  ConfigContext,
  CurrentUserContext,
  FetchProvider,
} from 'flight-webapp-components';

import Dashboard from './Dashboard';

test('renders anonymous dashboard without a user', () => {
  const { getByText } = render(
    <ConfigContext.Provider value={{ apiRootUrl: ""}} >
      <Router>
        <CurrentUserContext.Provider value={{ currentUser: null, actions: {} }}>
          <FetchProvider>
            <Dashboard />
          </FetchProvider>
        </CurrentUserContext.Provider>
      </Router>
    </ConfigContext.Provider>
  );
  expect(getByText(/sign in above/)).toBeInTheDocument();
});

test('renders authenticated dashboard with a user', () => {
  const currentUser = { username: 'alces' };

  const { getByText } = render(
    <ConfigContext.Provider value={{ apiRootUrl: ""}} >
      <Router>
        <CurrentUserContext.Provider value={{ currentUser, actions: {} }}>
          <FetchProvider>
            <Dashboard />
          </FetchProvider>
        </CurrentUserContext.Provider>
      </Router>
    </ConfigContext.Provider>
  );
  expect(getByText(/View your running .*sessions/)).toBeInTheDocument();
});
