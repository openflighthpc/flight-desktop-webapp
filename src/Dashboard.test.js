import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from './Dashboard';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

test('renders without crashing', () => {
  render(
    <CurrentUserProvider>
      <Dashboard />
    </CurrentUserProvider>
  );
});

test('renders anonymous dashboard without a user', () => {
  const { getByText } = render(
    <CurrentUserProvider>
      <Dashboard />
    </CurrentUserProvider>
  );
  expect(getByText(/Sign in to your OpenFlightHPC environment/)).toBeInTheDocument();
});

test('renders authenticated dashboard with a user', () => {
  const { getByText } = render(
    <CurrentUserProvider user={{ username: 'alces' }}>
      <Dashboard />
    </CurrentUserProvider>
  );
  expect(getByText(/You are signed in as alces/)).toBeInTheDocument();
});
