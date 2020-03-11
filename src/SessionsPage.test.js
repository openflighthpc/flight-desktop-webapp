import React from 'react';
import { render } from '@testing-library/react';
import SessionsPage from './SessionsPage';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import { SessionsProvider } from './SessionsContext';

test('renders without crashing', () => {
  render(
    <CurrentUserProvider>
      <SessionsProvider>
        <SessionsPage />
      </SessionsProvider>
    </CurrentUserProvider>
  );
});
