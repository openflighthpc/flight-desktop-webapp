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
