import React from 'react';
import { within } from '@testing-library/dom';
import { act, fireEvent, render, wait } from '@testing-library/react';
import RFB from 'novnc-core';

import App from './App';

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
    const pathname = new URL(req.url).pathname;
    // console.log('req:', req.method, pathname);  // eslint-disable-line no-console
    if (req.method === 'POST' && pathname === '/sessions') {
      return new Promise(resolve => setTimeout(
        () => resolve({ body: JSON.stringify(session), status: 200, }),
        0
      ));
    } else if (req.method === 'GET' && pathname === '/sessions') {
      return new Promise(resolve => setTimeout(
        () => resolve({ body: JSON.stringify([session]), status: 200, }),
        0
      ));
    } else if (req.method === 'GET' && pathname === `/sessions/${session.id}`) {
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


function signIn({ getByPlaceholderText, getByRole, getByText }) {
  const nameInput = getByPlaceholderText('Enter username');
  const passwordInput = getByPlaceholderText('Enter password');
  const button = getByRole('button', { name: 'Go!' });
  fireEvent.change(nameInput, { target: { value: 'alces' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  fireEvent.click(button);
  expect(getByText(/You are signed in as alces/)).toBeInTheDocument();
}

function navigateToLaunchPage({ getByText }) {
  fireEvent.click(getByText('Launch new session'));
}

async function navigateToSessionListing({ getByText, queryByText }) {
  fireEvent.click(getByText('My sessions'));
  expect(getByText(/Loading sessions/)).toBeInTheDocument();
  await wait(() => expect(queryByText(/Loading sessions/)).not.toBeInTheDocument());
  expect(getByText(/1 currently running .* sessions/)).toBeInTheDocument();
}

async function navigateToSession(session, { getByText, getByRole, findByRole, queryByText }) {
  fireEvent.click(getByText('My sessions'));
  const sessionName = session.id.split('-')[0];

  const heading = await findByRole('heading', { name: sessionName })
  const card = heading.closest('.card');
  const connectLink = within(card).getByRole('link', { name: 'Connect' });
  fireEvent.click(connectLink);
  await wait(
    () => expect(
      queryByText(/Initializing connection/)
    ).toBeInTheDocument()
  );
}

async function launchDesktop(desktopType, { getByRole }) {
  const heading = getByRole('heading', { name: desktopType });
  const card = heading.closest('.card');
  const launchButton = within(card).getByRole('button', { name: 'Launch' });
  // XXX Wait for something better here.
  await act(() => {
    fireEvent.click(launchButton);
    return sleep(1000);
  });
}

async function sleep(ms) {
  const promise = new Promise(resolve => { setTimeout(resolve, ms); });
  await promise;
}

test('launch a new desktop session', async () => {
  const queries = render(<App />);

  signIn(queries);
  navigateToLaunchPage(queries);
  await launchDesktop('Terminal', queries);
  await navigateToSessionListing(queries);
  await navigateToSession(session, queries);

  const vncConnection = `ws://localhost:9090/ws/172.17.0.3/${session.port}`;
  expect(RFB).toHaveBeenCalledWith(
    expect.anything(),
    vncConnection,
    { credentials: { password: session.password }}
  );
});
