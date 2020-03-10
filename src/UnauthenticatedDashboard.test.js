import React from 'react';
import { render } from '@testing-library/react';
import UnauthenticatedDashboard from './UnauthenticatedDashboard';

test('renders without crashing', () => {
  render(<UnauthenticatedDashboard />);
});

