import BrandBar from './BrandBar';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

test('renders without crashing', () => {
  render(
    <Router>
      <BrandBar />
    </Router>
  );
});

