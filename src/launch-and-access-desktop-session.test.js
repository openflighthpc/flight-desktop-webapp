import RFB from 'novnc-core';
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { within } from '@testing-library/dom';

import App from './App';
import testConfig from '../public/config.test.json';

// XXX Better mock this to emit connection events, etc..
jest.mock('novnc-core');

const desktop = {
  id: "terminal",
  verified: true,
  summary: "Preconfigured terminal for Flight HPC environments.",
};

const session = {
  "id": "1740a970-73e2-42bb-b740-baadb333175d",
  "type": "terminal",
  "ip": "172.17.0.3",
  "hostname": "b32d194c5ebb",
  "port": "5901",
  "password": "DA6khY3r",
  "image": null,
};

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponse((req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;
    // console.log('req:', req.method, pathname);  // eslint-disable-line no-console

    if (pathname === `${process.env.REACT_APP_LOGIN_API_BASE_URL}/session`) {
      return Promise.resolve({status: 403});

    } else if (pathname === `${process.env.REACT_APP_LOGIN_API_BASE_URL}/sign-in`) {
      return Promise.resolve(JSON.stringify({
        user: {
          username: 'test-user',
          name: 'Test user',
          authentication_token: 'test-token'
        }
      }));

    } else if (url.toString() === process.env.REACT_APP_CONFIG_FILE) {
      return Promise.resolve(JSON.stringify(testConfig));

    } else if (url.toString() === process.env.REACT_APP_BRANDING_FILE) {
      return Promise.resolve(JSON.stringify({}));

    } else if (url.toString() === process.env.REACT_APP_ENVIRONMENT_FILE) {
      return Promise.resolve(JSON.stringify({}));

    } else if (req.method === 'POST' && pathname.match(/sessions$/)) {
      return new Promise(resolve => setTimeout(
        () => resolve({ body: JSON.stringify(session), status: 200, }),
        0
      ));

    } else if (req.method === 'GET' && pathname.match(/sessions$/)) {
      return new Promise(resolve => setTimeout(
        () => resolve({ body: JSON.stringify([session]), status: 200, }),
        0
      ));

    } else if (req.method === 'GET' && pathname.match(new RegExp(`sessions/${session.id}$`))) {
      return new Promise(resolve => setTimeout(
        () => resolve({ body: JSON.stringify(session), status: 200, }),
        0
      ));

    } else if (req.method === 'GET' && pathname.match(new RegExp(`sessions/.*/screenshot.png$`))) {

      return new Promise(resolve => setTimeout(
        () => resolve({ status: 404 }),
        0
      ));

    } else if (req.method === 'GET' && pathname.match(/desktops$/)) {
      return new Promise(resolve => setTimeout(
        () => resolve({ body: JSON.stringify({ data: [desktop] }), status: 200, }),
        0
      ));

    } else {
      return Promise.resolve('all good');
    }
  });
});

afterEach(() => {
  fetch.resetMocks();
});


async function signIn({ getByLabelText, getByRole, getByText, queryByText }) {
  const loginButton = getByText(/Log in/);
  expect(loginButton).toBeInTheDocument();
  fireEvent.click(loginButton)

  const nameInput = getByLabelText('Enter your username');
  const passwordInput = getByLabelText('Enter your password');
  const button = getByRole('button', { name: 'Sign in' });
  fireEvent.change(nameInput, { target: { value: 'test-user' } });
  fireEvent.change(passwordInput, { target: { value: 'test-password' } });
  fireEvent.click(button);
  await waitFor(
    () => expect(queryByText(/Log in/)).toBeNull()
  )
  await waitFor(
    () => expect(queryByText('Enter your username')).toBeNull()
  )
}

async function navigateToLaunchPage({ getByText, queryByText }) {
  fireEvent.click(getByText('Launch new session'));
  await waitFor(() => expect(getByText('Loading desktops...')).toBeInTheDocument());
  await waitFor(() => expect(queryByText('Loading desktops...')).toBeNull());
}

async function launchDesktop(desktopType, { getByText, getByRole, queryByText }) {
  const heading = getByRole('heading', { name: desktopType });
  const card = heading.closest('.card');
  const launchButton = within(card).getByRole('button', { name: 'Launch' });
  fireEvent.click(launchButton);
}

async function renderApp() {
  const utils = render(<App />);
  expect(utils.getByText('Loading...')).toBeInTheDocument();
  await waitFor(
    () => expect(utils.queryByText('Loading...')).toBeNull()
  );
  expect(utils.queryByText('An error has occurred')).toBeNull();
  return utils;
}

test('launch a new desktop session', async () => {
  const queries = await renderApp();

  await signIn(queries);
  await navigateToLaunchPage(queries);
  launchDesktop('Terminal', queries);
  await waitFor(
    () => expect(queries.queryByText(/Initializing connection/)).toBeInTheDocument()
  )

  const vncConnection = `wss://my.cluster.com/ws/127.0.0.1/${session.port}`;
  expect(RFB).toHaveBeenCalledWith(
    expect.anything(),
    vncConnection,
    { credentials: { password: session.password }}
  );
});
