import React from 'react';
import { render } from '@testing-library/react';
import SignInForm from './SignInForm';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import FetchProvider from './FetchProvider';

test('renders without crashing', () => {
  render(
    <CurrentUserProvider user={{ username: 'alces' }}>
      <FetchProvider>
        <SignInForm />
      </FetchProvider>
    </CurrentUserProvider>
  );
});
