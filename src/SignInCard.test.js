import React from 'react';
import { render } from '@testing-library/react';
import SignInCard from './SignInCard';

test('renders without crashing', () => {
  render(<SignInCard />);
});

