import React from 'react';
import { render } from '@testing-library/react';
import SignInForm from './SignInForm';
import { Context as CurrentUserContext } from './CurrentUserContext';
import FetchProvider from './FetchProvider';
import { Context as ConfigContext } from './ConfigContext';

test('renders without crashing', () => {
  const currentUser = { username: 'alces' };
  render(
    <ConfigContext.Provider value={{ apiRootUrl: ""}} >
      <CurrentUserContext.Provider value={{ currentUser, actions: {} }}>
        <FetchProvider>
          <SignInForm />
        </FetchProvider>
      </CurrentUserContext.Provider>
    </ConfigContext.Provider>
  );
});
