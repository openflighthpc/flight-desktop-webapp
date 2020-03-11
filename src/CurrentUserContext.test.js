import React, { useContext } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Context, Provider, internal } from './CurrentUserContext';

test('Provider renders without crashing', () => {
  render(
    <Provider>
      <div>Some children</div>
    </Provider>
  );
});

test('reducer supports setting user', () => {
  const initialState = null;
  const username = 'alces';
  const password = 'password';
  const action = { type: "SET_USER", payload: { username, password } };

  const newState = internal.currentUserReducer(initialState, action);

  expect(newState.username).toEqual(username);
  expect(newState.authToken).toEqual(btoa(`${username}:${password}`));
  expect(newState.authToken).toEqual("YWxjZXM6cGFzc3dvcmQ=");
});

test('reducer supports unsetting user', () => {
  const initialState = { username: 'alces', authToken: 'YWxjZXM6cGFzc3dvcmQ=' };
  const action = { type: "UNSET_USER" };

  const newState = internal.currentUserReducer(initialState, action);

  expect(newState).toBeNull();
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
