import React from 'react';
import { render } from '@testing-library/react';
import BrandBar from './BrandBar';

test('renders without crashing', () => {
  render(<BrandBar />);
});

