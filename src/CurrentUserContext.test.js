import React, { useContext } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Context, Provider } from './CurrentUserContext';

test('Provider renders without crashing', () => {
  render(
    <Provider>
      <div>Some children</div>
    </Provider>
  );
});

test('Context provides functions to set and unset user', () => {
  function TestComponent(props) {
    const { actions, currentUser } = useContext(Context);

    if (currentUser == null) {
      return (
        <div>
          You are not logged in
          <button onClick={() => actions.setUser(props.username, props.password)}>
            Log in
          </button>
        </div>
      );
    } else {
      return (
        <div>
          You are logged in as {currentUser.username}
          <button onClick={() => actions.unsetUser()}>
            Log out
          </button>
        </div>
      );
    }
  }

  const { getByRole, queryByText } = render(
    <Provider>
      <TestComponent username="alces" />
    </Provider>
  );

  expect(queryByText(/You are logged in as alces/)).toBeNull();
  expect(queryByText(/You are not logged in/)).toBeInTheDocument();

  let button = getByRole('button', { name: 'Log in' });
  fireEvent.click(button);
  expect(queryByText(/You are logged in as alces/)).toBeInTheDocument();
  expect(queryByText(/You are not logged in/)).toBeNull();

  button = getByRole('button', { name: 'Log out' });
  fireEvent.click(button);
  expect(queryByText(/You are logged in as alces/)).toBeNull();
  expect(queryByText(/You are not logged in/)).toBeInTheDocument();
});
