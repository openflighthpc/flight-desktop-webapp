import React from 'react';
import { render } from '@testing-library/react';
import UnauthenticatedDashboard from './UnauthenticatedDashboard';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import FetchProvider from './FetchProvider';

test('renders without crashing', () => {
  render(
    <CurrentUserProvider user={{ username: 'alces' }}>
      <FetchProvider>
        <UnauthenticatedDashboard />
      </FetchProvider>
    </CurrentUserProvider>
  );
});

