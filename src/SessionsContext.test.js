import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { SessionsContext, SessionsProvider, internal } from './SessionsContext';

test('renders without crashing', () => {
  render(
    <SessionsProvider>
      <div>Some children</div>
    </SessionsProvider>
  );
});

describe('SessionsProvider', () => {
  it('provides function to resolve sessions', () => {
    const fakeSessions = [ "fake session data" ];
    const tree = (
      <SessionsProvider>
        <SessionsContext.Consumer>
          {
            ({actions, sessions}) => (
              <div>
                <span>
                  Sessions: {sessions.data == null ? 0 : sessions.data.length}
                </span>
                <button
                  onClick={
                    () => {actions.pending(); actions.resolved(fakeSessions);}
                  }
                >
                  Resolve
                </button>
              </div>
            )
          }
        </SessionsContext.Consumer>
      </SessionsProvider>
    )
    const { getByText } = render(tree)
    expect(getByText(/^Sessions:/).textContent).toBe('Sessions: 0')
    fireEvent.click(getByText('Resolve'));
    expect(getByText(/^Sessions:/).textContent).toBe('Sessions: 1')
  });

  it('provides function to reject sessions', () => {
    const fakeError = new Error('Ooops');
    const tree = (
      <SessionsProvider>
        <SessionsContext.Consumer>
          {
            ({actions, sessions}) => (
              <div>
                <span>
                  Error: {sessions.errors == null ? 'No error' : sessions.errors.message }
                </span>
                <button
                  onClick={
                    () => {actions.pending(); actions.rejected(fakeError);}
                  }
                >
                  Resolve
                </button>
              </div>
            )
          }
        </SessionsContext.Consumer>
      </SessionsProvider>
    )
    const { getByText } = render(tree)
    expect(getByText(/^Error:/).textContent).toBe('Error: No error')
    fireEvent.click(getByText('Resolve'));
    expect(getByText(/^Error:/).textContent).toBe('Error: Ooops')
  });
});

describe('reducer', () => {
  describe('when uninitialised', () => {
    const initialState = { state: 'uninitialised', data: null, errors: null };

    it('can transition to loading', () => {
      const action = { type: "LOAD" };

      const newState = internal.reducer(initialState, action);

      expect(newState.state).toEqual('loading');
      expect(newState.data).toBeNull();
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
    const initialState = { state: 'loading', data: null, errors: null };

    it('can transition to loaded', () => {
      const action = { type: "RESOLVED", payload: 'the payload'};

      const newState = internal.reducer(initialState, action);

      expect(newState.state).toEqual('loaded');
      expect(newState.data).toEqual('the payload');
      expect(newState.errors).toBeNull();
    });

    it('can transition to errored', () => {
      const action = { type: "REJECTED", errors: 'the error' };
      const existingSessions = 'previously loaded session data';

      const newState = internal.reducer(
        { ...initialState, data: existingSessions },
        action
      );

      expect(newState.state).toEqual('errored');
      expect(newState.data).toEqual(existingSessions);
      expect(newState.errors).toEqual('the error');
    });
  });
});
