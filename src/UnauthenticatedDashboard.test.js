import React from 'react';
import { render } from '@testing-library/react';
import UnauthenticatedDashboard from './UnauthenticatedDashboard';
import FetchProvider from './FetchProvider';
import { Context as CurrentUserContext } from './CurrentUserContext';
import { Context as ConfigContext } from './ConfigContext';

test('renders without crashing', () => {
  const currentUser = { username: 'alces' };

  render(
    <ConfigContext.Provider value={{ apiRootUrl: ""}} >
      <CurrentUserContext.Provider value={{ currentUser, actions: {} }}>
        <FetchProvider>
          <UnauthenticatedDashboard />
        </FetchProvider>
      </CurrentUserContext.Provider>
    </ConfigContext.Provider>
  );
});
