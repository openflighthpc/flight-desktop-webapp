import React, { useReducer } from 'react';

const currentUserReducer = (state, { type, payload }) => {
  switch (type) {

    case "SET_USER":
      const basicAuthToken = btoa(`${payload.username}:${payload.password}`);
      return {
        username: payload.username,
        authToken: basicAuthToken,
      };

    case "UNSET_USER":
      return null;

    default:
      return;
  }
};

const initialState = null;
const Context = React.createContext(initialState);

function Provider({ user, ...props }) {
  const [currentUser, dispatch] = useReducer(currentUserReducer, initialState);
  const actions = {
    setUser(username, password) {
      dispatch({
        type: 'SET_USER',
        payload: { username, password }
      })
    },

    unsetUser() { dispatch({ type: 'UNSET_USER' }) },
  };

  return (
    <Context.Provider value={{ currentUser: user || currentUser, actions }}>
      {props.children}
    </Context.Provider>
  );
}

// Exported to allow testing.
const internal = {
  currentUserReducer,
};

export {
  Context,
  Provider,
  internal,
}
