import React from 'react';
import { within } from '@testing-library/dom';
import { act, fireEvent, render, wait } from '@testing-library/react';
import RFB from 'novnc-core';

import App from './App';
import testConfig from '../public/config.test.json';

jest.mock('novnc-core');

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

    if (pathname === "/desktop/ping") {
      return Promise.resolve("OK");

    } else if (url.toString() === process.env.REACT_APP_CONFIG_FILE) {
      return Promise.resolve(JSON.stringify(testConfig));

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

    } else {
      return Promise.resolve('all good');
    }
  });
});

afterEach(() => {
  fetch.resetMocks();
});


async function signIn({ getByPlaceholderText, getByRole, getByText }) {
  const nameInput = getByPlaceholderText('Enter username');
  const passwordInput = getByPlaceholderText('Enter password');
  const button = getByRole('button', { name: 'Go!' });
  fireEvent.change(nameInput, { target: { value: 'alces' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  await act(() => {
    fireEvent.click(button);
    return wait(
      () => expect(getByText(/Signed in as alces/)).toBeInTheDocument()
    )
  });
}

function navigateToLaunchPage({ getByText }) {
  fireEvent.click(getByText('Launch new session'));
}

async function launchDesktop(desktopType, { getByRole }) {
  const heading = getByRole('heading', { name: desktopType });
  const card = heading.closest('.card');
  const launchButton = within(card).getByRole('button', { name: 'Launch' });
  fireEvent.click(launchButton);
}

async function renderApp() {
  const utils = render(<App />);
  expect(utils.getByText('Loading...')).toBeInTheDocument();
  await wait(
    () => expect(utils.queryByText('Loading...')).toBeNull()
  );
  return utils;
}

test('launch a new desktop session', async () => {
  const queries = await renderApp();

  await signIn(queries);
  navigateToLaunchPage(queries);
  await act(() => {
    launchDesktop('Terminal', queries);
    return wait(
      () => expect(queries.queryByText(/Initializing connection/)).toBeInTheDocument()
    )
  });

  const vncConnection = `wss://my.cluster.com/ws/127.0.0.1/${session.port}`;
  expect(RFB).toHaveBeenCalledWith(
    expect.anything(),
    vncConnection,
    { credentials: { password: session.password }}
  );
});
