import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { render } from '@testing-library/react';
import Dashboard from './Dashboard';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

test('renders without crashing', () => {
  render(
    <Router>
      <CurrentUserProvider>
        <Dashboard />
      </CurrentUserProvider>
    </Router>
  );
});

test('renders anonymous dashboard without a user', () => {
  const { getByText } = render(
    <Router>
      <CurrentUserProvider>
        <Dashboard />
      </CurrentUserProvider>
    </Router>
  );
  expect(getByText(/Sign in to your OpenFlightHPC environment/)).toBeInTheDocument();
});

test('renders authenticated dashboard with a user', () => {
  const { getByText } = render(
    <Router>
      <CurrentUserProvider user={{ username: 'alces' }}>
        <Dashboard />
      </CurrentUserProvider>
    </Router>
  );
  expect(getByText(/You are signed in as alces/)).toBeInTheDocument();
});
