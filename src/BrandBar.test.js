import BrandBar from './BrandBar';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Context as CurrentUserContext } from './CurrentUserContext';

test('renders without crashing', () => {
  render(
    <Router>
      <CurrentUserContext.Provider value={{ currentUser: null, actions: {} }}>
        <BrandBar />
      </CurrentUserContext.Provider>
    </Router>
  );
});
