import { useState, useEffect } from 'react';

//
// Return a new reducer which calls each provided reducer in turn.
//
export function reduceReducers(...reducers) {
  return (state, action) => (
    reducers.reduceRight(
      (newState, nextReducer) => nextReducer(newState, action),
      state,
    )
  );
}

// Return the first error code from a parsed response body.
export function errorCode(responseBody) {
  if (!isObject(responseBody)) { return null; }
  if (!Array.isArray(responseBody.errors)) { return null; }
  if (!isObject(responseBody.errors[0])) { return null; }
  return responseBody.errors[0].code;
}


function isObject(object) {
  return (typeof object === 'function' || typeof object === 'object') && !!object;
};

export function usePeriodicRerender({ interval }) {
  // eslint-disable-next-line no-unused-vars
  const [_, setCounter ] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setCounter(c => c + 1), interval);
    return () => { clearTimeout(timer); };
  });
}
