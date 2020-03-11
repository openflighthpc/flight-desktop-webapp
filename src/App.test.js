import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
});


test('can sign in', () => {
  const { getByText, getByRole, getByPlaceholderText, queryByText } = render(<App />);

  expect(queryByText(/You are signed in as my-username/)).toBeNull();
  expect(getByText(/Sign in to your OpenFlightHPC environment/)).toBeInTheDocument();

  const nameInput = getByPlaceholderText('Enter username');
  const passwordInput = getByPlaceholderText('Enter password');
  const button = getByRole('button', { name: 'Go!' });
  fireEvent.change(nameInput, { target: { value: 'my-username' } });
  fireEvent.change(passwordInput, { target: { value: 'my-password' } });
  fireEvent.click(button);

  expect(getByText(/You are signed in as my-username/)).toBeInTheDocument();
});
