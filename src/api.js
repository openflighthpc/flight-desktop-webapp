import { useContext } from 'react';
import useFetch from 'use-http';

import { Context as CurrentUserContext } from './CurrentUserContext';

export const signIn = (userActions) => async (inputs) => {
  userActions.setUser(inputs.username, inputs.password);
}

export function useFetchSessions() {
  const { currentUser } = useContext(CurrentUserContext);
  return useFetch({ path: "/sessions" }, [ currentUser.authToken ]);
}

export function useFetchSession(id) {
  const { currentUser } = useContext(CurrentUserContext);
  let urlOrOptions;
  if ( process.env.NODE_ENV === 'development' && process.env.REACT_APP_FAKE_DATA ) {
    const port = 41363;
    const password = 'rZjgqb0L';
    urlOrOptions = `http://localhost:8000?id=${id}&port=${port}&password=${password}`;
  } else {
    urlOrOptions = { path: `/sessions/${id}` };
  }
  return useFetch(urlOrOptions, [ id, currentUser.authToken ]);
}

export function useLaunchSession(desktop) {
  const request = useFetch({
    method: 'post',
    path: "/sessions",
    body: {
      desktop: desktop.type,
    },
    cachePolicy: 'no-cache',
  });
  return request;
}

export function useTerminateSession(id) {
  const request = useFetch({
    method: 'delete',
    path: `/sessions/${id}`,
    cachePolicy: 'no-cache',
  });
  return request;
}
