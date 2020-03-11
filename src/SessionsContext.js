import React, { useMemo, useReducer } from 'react';

import { reduceReducers } from './utils';

const initialState = {
  state: 'uninitialised',  // uninitialised | loading | loaded | errored
  sessions: null,
  errors: null,
};

const reducer = reduceReducers(uninitialisedReducer, loadingReducer);

function uninitialisedReducer(state, action) {
  if (state.state !== 'uninitialised') { return state; }
  switch (action.type) {
    case "LOAD":
      return { state: 'loading', sessions: null, errors: null }

    default:
      return state;
  }
}

function loadingReducer(state, action) {
  if (state.state !== 'loading') { return state; }
  switch (action.type) {
    case "RESOLVED":
      return { state: 'loaded', sessions: action.payload, errors: null }

    case "REJECTED":
      return { state: 'errored', sessions: state.sessions, errors: action.errors }

    default:
      return state;
  }
}

const SessionsContext = React.createContext({ state: initialState });

function SessionsProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useMemo(
    () => ({
      pending() { dispatch({ type: 'LOAD' }); },

      resolved(sessions) {
        dispatch({
          type: 'RESOLVED',
          payload: sessions,
        });
      },

      rejected(errors) {
        dispatch({
          type: 'REJECTED',
          errors: errors
        });
      },
    }),
    [ dispatch ],
  );


  // XXX Rename state.
  return (
    <SessionsContext.Provider value={{ state, actions }}>
      {props.children}
    </SessionsContext.Provider>
  );
}

const internal = {
  reducer,
}

export {
  SessionsContext,
  SessionsProvider,
  internal,
}
