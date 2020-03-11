import React from 'react';
import { render } from '@testing-library/react';
import { SessionsProvider, internal } from './SessionsContext';

test('renders without crashing', () => {
  render(
    <SessionsProvider>
      <div>Some children</div>
    </SessionsProvider>
  );
});

describe('reducer', () => {
  describe('when uninitialised', () => {
    const initialState = { state: 'uninitialised', sessions: null, errors: null };

    it('can transition to loading', () => {
      const action = { type: "LOAD" };

      const newState = internal.reducer(initialState, action);

      expect(newState.state).toEqual('loading');
      expect(newState.sessions).toBeNull();
      expect(newState.errors).toBeNull();
    });

    it('does not transition to loaded', () => {
      const action = { type: "RESOLVED" };

      const newState = internal.reducer(initialState, action);

      expect(newState.state).toEqual('uninitialised');
    });

    it('does not transition to errored', () => {
      const action = { type: "REJECTED" };

      const newState = internal.reducer(initialState, action);

      expect(newState.state).toEqual('uninitialised');
    });
  });

  describe('when loading', () => {
    const initialState = { state: 'loading', sessions: null, errors: null };

    it('can transition to loaded', () => {
      const action = { type: "RESOLVED", payload: 'the payload'};

      const newState = internal.reducer(initialState, action);

      expect(newState.state).toEqual('loaded');
      expect(newState.sessions).toEqual('the payload');
      expect(newState.errors).toBeNull();
    });

    it('can transition to errored', () => {
      const action = { type: "REJECTED", errors: 'the error' };
      const existingSessions = 'previously loaded session data';

      const newState = internal.reducer(
        { ...initialState, sessions: existingSessions },
        action
      );

      expect(newState.state).toEqual('errored');
      expect(newState.sessions).toEqual(existingSessions);
      expect(newState.errors).toEqual('the error');
    });
  });
});
