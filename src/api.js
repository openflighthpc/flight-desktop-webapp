import { useContext } from 'react';
import useFetch from 'use-http';

import { Context as CurrentUserContext } from './CurrentUserContext';

export const signIn = (userActions) => async (inputs) => {
  userActions.setUser(inputs.username, inputs.password);
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

export async function retrievSessions(sessionActions, currentUser) {
  if (currentUser == null) { return }
  sessionActions.pending();
  try {
    const sessions = await retrieveFakeSessions(currentUser);
    sessionActions.resolved(sessions);
  } catch(e) {
    sessionActions.rejected(e);
  }
}

function retrieveFakeSessions(currentUser) {
  return fetch(
    "http://localhost:9095/sessions",
    { headers: { 'Authorization': `Basic ${currentUser.authToken}` } }
  )
    .then(res => res.json())
    .catch(err => {
      if ( process.env.NODE_ENV === 'development' && process.env.REACT_APP_FAKE_DATA ) {
        return fakeSessionsPromise();
      } else {
        return Promise.reject(err);
      }
    });
}

function fakeSessionsPromise() {
  const promise = new Promise((resolve, reject) => {
    const fakeData = [
      {
        "id": "410bc483-710c-4795-a859-baeae17f08ce",
        "desktop": "terminal",
        "image": null,
      },
      {
        "id": "1740a970-73e2-42bb-b740-baadb333175d",
        "desktop": "chrome",
        "image": null,
      },
      {
        "id": "ee4331d4-d075-4024-a8b6-c263e7101217",
        "desktop": "gnome",
        "image": null,
      },
      {
        "id": "a2815d05-866a-4c8a-a064-58c0e4d8329b",
        "desktop": "kde",
        "image": null,
      },
      {
        "id": "04335c7d-3004-491e-bd44-be17eab838de",
        "desktop": "xfce",
        "image": null,
      },
      {
        "id": "6ce64f4e-f18d-48bc-9ebc-5f23ee0a7943",
        "desktop": "xterm",
        "image": null,
      },
      {
        "id": "80a344bf-852f-4e4c-a9b2-a5215a773924",
        "desktop": "terminal",
        "image": null,
      }
    ];
    setTimeout(() => resolve(fakeData), 1000);
  });
  return promise;
}
