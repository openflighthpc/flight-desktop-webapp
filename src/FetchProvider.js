import React, { useContext } from 'react';
import { Provider } from 'use-http';

import { Context as CurrentUserContext } from './CurrentUserContext';

function FetchProvider({ children }) {
  const { currentUser } = useContext(CurrentUserContext);
  const options = {
    interceptors: {
      // Options can be modified and must be returned.
      request: async (options, url, path, route) => {
        if (currentUser) {
          if (options.headers == null) { options.headers = {}; }
          options.headers.Authorization = `Basic ${currentUser.authToken}`
        }
        return options
      },
    },
  };

  return (
    <Provider options={options}>
      {children}
    </Provider>
  );
}


export default FetchProvider;
