import BrandBar from './BrandBar';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

test('renders without crashing', () => {
  render(
    <Router>
      <CurrentUserProvider>
        <BrandBar />
      </CurrentUserProvider>
    </Router>
  );
});

