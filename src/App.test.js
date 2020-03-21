import React from 'react';
import { act, render, fireEvent, wait } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
});


test('can sign in', async () => {
  const { getByText, getByRole, getByPlaceholderText, queryByText } = render(<App />);

  expect(queryByText(/You are signed in as my-username/)).toBeNull();
  expect(getByText(/Sign in to your OpenFlightHPC environment/)).toBeInTheDocument();

  const nameInput = getByPlaceholderText('Enter username');
  const passwordInput = getByPlaceholderText('Enter password');
  const button = getByRole('button', { name: 'Go!' });
  fireEvent.change(nameInput, { target: { value: 'my-username' } });
  fireEvent.change(passwordInput, { target: { value: 'my-password' } });
  await act(() => {
    fireEvent.click(button);
    return wait(
      () => expect(getByText(/Signed in as my-username/)).toBeInTheDocument()
    )
  });
});
