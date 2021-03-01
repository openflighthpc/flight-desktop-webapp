import { useContext, useRef, useState } from 'react';
import useFetch from 'use-http';

import { CurrentUserContext } from 'flight-webapp-components';

import { useInterval } from './utils';

export function useFetchDesktops() {
  const { currentUser } = useContext(CurrentUserContext);
  return useFetch(
    "/desktops",
    { headers: { Accept: 'application/json' } },
    [ currentUser.authToken ]);
}

export function useFetchSessions() {
  const { currentUser } = useContext(CurrentUserContext);
  return useFetch(
    "/sessions",
    { headers: { Accept: 'application/json' } },
    [ currentUser.authToken ]);
}

export function useFetchSession(id) {
  const { currentUser } = useContext(CurrentUserContext);
  return useFetch(`/sessions/${id}`, [ id, currentUser.authToken ]);
}

export function useLaunchSession(desktop) {
  const request = useFetch(
    "/sessions",
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        desktop: desktop.id,
      },
      cachePolicy: 'no-cache',
    });
  return request;
}

export function useCleanSession(id) {
  const request = useFetch(
    `/sessions/${id}`,
    {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        strategy: 'clean',
      },
      cachePolicy: 'no-cache',
    });
  return request;
}

export function useTerminateSession(id) {
  const request = useFetch(
    `/sessions/${id}`,
    {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        strategy: 'kill',
      },
      cachePolicy: 'no-cache',
    });
  return request;
}

export function useFetchScreenshot(id, { reloadInterval=1*60*1000 }={}) {
  const lastLoadedAt = useRef(null);
  const [ image, setImage ] = useState(null);

  const now = new Date();
  const reloadDue = lastLoadedAt.current == null ||
    now - lastLoadedAt.current < reloadInterval;
  if (reloadDue) {
    lastLoadedAt.current = now;
  }

  const { get, response } = useFetch(
    `/sessions/${id}/screenshot.png`,
    {
      headers: { Accept: 'image/*' },
      cachePolicy: 'cache-first',
      cacheLife: reloadInterval,
      // cachePolicy: 'no-cache',
    }, [lastLoadedAt])

  useInterval(get, reloadInterval, { immediate: false });

  if (response.ok) {
    response.blob()
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      })
      .then((base64Image) => {
        if (image !== base64Image) {
          setImage(base64Image);
        }
      })
      .catch((e) => {
        console.log('Error base64 encoding screenshot:', e);  // eslint-disable-line no-console
      });
  }

  return { get, image };
}
