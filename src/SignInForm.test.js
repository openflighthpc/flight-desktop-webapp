import React from 'react';
import { render } from '@testing-library/react';
import SignInForm from './SignInForm';

test('renders without crashing', () => {
  render(<SignInForm />);
});
