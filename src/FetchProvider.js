import React, { useContext } from 'react';
import { Provider } from 'use-http';

import { Context as CurrentUserContext } from './CurrentUserContext';

function FetchProvider({ children, cachePolicy }) {
  const { currentUser } = useContext(CurrentUserContext);
  const options = {
    cachePolicy: cachePolicy,
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
    <Provider
      options={options}
      url={process.env.REACT_APP_API_ROOT_URL}
    >
      {children}
    </Provider>
  );
}


export default FetchProvider;
