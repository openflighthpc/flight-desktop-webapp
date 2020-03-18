import React from 'react';
import { createMemoryHistory } from "history";
import {
  Route,
  Router,
  Switch,
} from "react-router-dom";
import { render } from '@testing-library/react';
import AuthenticatedRoute from './AuthenticatedRoute';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

function TestComponent({ path, user }) {
  return (
    <CurrentUserProvider user={user}>
      <Switch>
        <AuthenticatedRoute path="/auth">
          <div>Protected route</div>
        </AuthenticatedRoute>
        <Route path="/">
          <div>Default route</div>
        </Route>
      </Switch>
    </CurrentUserProvider>
  );
}

function renderTestComponent(path, user) {
  const history = createMemoryHistory();
  history.push(path);
  const renderResult = render(
    <Router history={history}>
      <TestComponent user={user} />
    </Router>
  );
  return { ...renderResult, history };
}

it('renders its children when there is a current user', () => {
  const user = {username: 'alces', authToken: 'fake:auth'};
  const { history, queryByText } = renderTestComponent('/auth', user);

  expect(queryByText('Protected route')).toBeInTheDocument();
  expect(queryByText('Default route')).not.toBeInTheDocument();
  expect(history.location.pathname).toEqual('/auth');
});

it('redirects to `/` when there is no current user', () => {
  const { history, queryByText } = renderTestComponent('/auth', null);

  expect(queryByText('Protected route')).not.toBeInTheDocument();
  expect(queryByText('Default route')).toBeInTheDocument();
  expect(history.location.pathname).toEqual('/');
});

it('can render the default route even with a user', () => {
  const user = {username: 'alces', authToken: 'fake:auth'};
  const { history, queryByText } = renderTestComponent('/', user);

  expect(queryByText('Protected route')).not.toBeInTheDocument();
  expect(queryByText('Default route')).toBeInTheDocument();
  expect(history.location.pathname).toEqual('/');
});

