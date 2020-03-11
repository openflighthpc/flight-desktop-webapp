import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { render } from '@testing-library/react';
import AuthenticatedDashboard from './AuthenticatedDashboard';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

test('renders without crashing', () => {
  render(
    <Router>
      <CurrentUserProvider user={{ username: 'alces' }}>
        <AuthenticatedDashboard />
      </CurrentUserProvider>
    </Router>
  );
});
