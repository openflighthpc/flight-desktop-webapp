import React from 'react';
import { render } from '@testing-library/react';
import SignInForm from './SignInForm';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

test('renders without crashing', () => {
  render(
    <CurrentUserProvider user={{ username: 'alces' }}>
      <SignInForm />
    </CurrentUserProvider>
  );
});
