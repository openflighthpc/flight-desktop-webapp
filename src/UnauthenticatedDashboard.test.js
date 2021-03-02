import React from 'react';
import { render } from '@testing-library/react';

import {
  ConfigContext,
  CurrentUserContext,
  FetchProvider,
} from 'flight-webapp-components';

import UnauthenticatedDashboard from './UnauthenticatedDashboard';

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
