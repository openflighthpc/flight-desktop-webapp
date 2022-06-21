import React from 'react';

import { useFetchUserConfig } from './api';
import {
  DefaultErrorMessage,
  utils
} from 'flight-webapp-components';

const initialState = null;
const Context = React.createContext(initialState);

function Provider({ children }) {
  const { get, data, loading, error } = useFetchUserConfig();

  if (error) {
    if (utils.errorCode(data) === 'Unauthorized') {
      return (
        <Context.Provider value={{unauthorized: "true"}}>
          {children}
        </Context.Provider>
      )
    } else {
      return (
        <Context.Provider value={{error: error}}>
          {children}
        </Context.Provider>
      )
    }
  } else {
    if (loading) {
      return (
        <Context.Provider value={{loading: "true"}}>
          {children}
        </Context.Provider>
      )
    } else {
      return (
        <Context.Provider value={data}>
          {children}
        </Context.Provider>
      )
    }
  }
}

export { Context, Provider }
