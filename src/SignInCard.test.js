import React from 'react';
import { render } from '@testing-library/react';
import SignInCard from './SignInCard';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

test('renders without crashing', () => {
  render(
    <CurrentUserProvider user={{ username: 'alces' }}>
      <SignInCard />
    </CurrentUserProvider>
  );
});

