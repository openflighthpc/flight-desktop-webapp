import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { render } from '@testing-library/react';
import Dashboard from './Dashboard';
import { Context as CurrentUserContext } from './CurrentUserContext';
import FetchProvider from './FetchProvider';
import { Context as ConfigContext } from './ConfigContext';

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
  expect(getByText(/Sign in to your OpenFlightHPC environment/)).toBeInTheDocument();
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
