import React from 'react';

import { useFetchUserConfig } from './api';
import {
  DefaultErrorMessage,
  UnauthorizedError,
  utils
} from 'flight-webapp-components';

const initialState = null;
const Context = React.createContext(initialState);

function Provider({ children }) {
  const { get, data, loading, error } = useFetchUserConfig();

  if (error) {
    if (utils.errorCode(error.data) === 'Unauthorized') {
      return <UnauthorizedError />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    if (loading) {
      return null;
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
