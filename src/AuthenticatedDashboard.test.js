import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { render } from '@testing-library/react';
import AuthenticatedDashboard from './AuthenticatedDashboard';
import { Context as CurrentUserContext } from './CurrentUserContext';

test('renders without crashing', () => {
  const currentUser = { username: 'alces' };

  render(
    <Router>
      <CurrentUserContext.Provider value={{ currentUser, actions: {} }}>
        <AuthenticatedDashboard />
      </CurrentUserContext.Provider>
    </Router>
  );
});
