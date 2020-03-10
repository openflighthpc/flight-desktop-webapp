import React, { useReducer } from 'react';

const currentUserReducer = (state, { type, payload }) => {
  switch (type) {

    case "SIGN_IN":
      const basicAuthToken = btoa(`${payload.username}:${payload.password}`);
      return {
        username: payload.username,
        authToken: basicAuthToken,
      };

    case "SIGN_OUT":
      return null;

    default:
      return;
  }
};

const initialState = null;
const Context = React.createContext(initialState);

function Provider({ user, ...props }) {
  const [currentUser, dispatch] = useReducer(currentUserReducer, initialState);

  return (
    <Context.Provider value={{ currentUser: user || currentUser, dispatch }}>
      {props.children}
    </Context.Provider>
  );
}

export {
  Context,
  Provider,
}
