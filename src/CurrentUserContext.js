import React, { useMemo } from 'react';

import useLocalStorage from './useLocalStorage';

const initialState = null;
const Context = React.createContext(initialState);

function Provider({ user, ...props }) {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', initialState);
  const actions = useMemo(
    () => ({
      setUser(username, password) {
        const basicAuthToken = btoa(`${username}:${password}`);
        setCurrentUser({ username, authToken: basicAuthToken });
      },

      unsetUser() { setCurrentUser(null) },
    }),
    [ setCurrentUser ],
  );

  return (
    <Context.Provider value={{ currentUser: user || currentUser, actions }}>
      {props.children}
    </Context.Provider>
  );
}

export {
  Context,
  Provider,
}
