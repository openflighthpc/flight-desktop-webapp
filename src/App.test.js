import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import App from './App';

async function renderApp() {
  const utils = render(<App />);
  expect(utils.getByText('Loading...')).toBeInTheDocument();
  await wait(
    () => expect(utils.queryByText('Loading...')).toBeNull()
  );
  return utils;
}

test('renders without crashing', async () => {
  await renderApp();
});


test('can sign in', async () => {
  const {
    getByText, getByRole, getByPlaceholderText, queryByText,
  } = await renderApp();

  expect(queryByText(/You are signed in as my-username/)).toBeNull();
  expect(getByText(/Sign in to your OpenFlightHPC environment/)).toBeInTheDocument();

  const nameInput = getByPlaceholderText('Enter username');
  const passwordInput = getByPlaceholderText('Enter password');
  const button = getByRole('button', { name: 'Go!' });
  fireEvent.change(nameInput, { target: { value: 'my-username' } });
  fireEvent.change(passwordInput, { target: { value: 'my-password' } });
  fireEvent.click(button);
  await wait(
    () => expect(getByText(/my-username \(bens-test-cluster\)/)).toBeInTheDocument()
  )
});
