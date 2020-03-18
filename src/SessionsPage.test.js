import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act, render, wait, within } from '@testing-library/react';

import FetchProvider from './FetchProvider';
import SessionsPage from './SessionsPage';
import { Provider as CurrentUserProvider } from './CurrentUserContext';

async function renderSessionsPage() {
  const { getByText, queryByText, ...rest } = render(
    <Router>
      <CurrentUserProvider user={{ username: 'test', authToken: 'testAuthToken' }}>
        <FetchProvider cachePolicy="no-cache">
          <SessionsPage />
        </FetchProvider>
      </CurrentUserProvider>
    </Router>
  );

  expect(getByText(/Loading sessions/)).toBeInTheDocument();
  await wait(() => expect(queryByText(/Loading sessions/)).not.toBeInTheDocument());

  return { getByText, queryByText, ...rest };
}

afterEach(() => {
  fetch.resetMocks();
});

test('renders without crashing', async () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify([]));
  await renderSessionsPage();
});

describe('when there are no running sessions', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify([]));
  });

  test('renders a no running sessions message', async () => {
    const { getByRole, getByText } = await renderSessionsPage();

    expect(getByText(/No sessions found./)).toBeInTheDocument();
    const startSessionLink = getByRole("link", { name: /start .* session/i });
    expect(startSessionLink).toHaveAttribute("href", "/sessions/new");
  });
});

describe('when there are running sessions', () => {
  const sessions = [
    {
      "id": "410bc483-710c-4795-a859-baeae17f08ce",
      "desktop": "terminal",
      "image": "totally some PNG image data",
    },
    {
      "id": "1740a970-73e2-42bb-b740-baadb333175d",
      "desktop": "chrome",
      "image": null,
    },
  ];

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify(sessions));
  });

  test('renders a count of the sessions', async () => {
    const { getByText } = await renderSessionsPage();

    expect(getByText(/2 currently running .* sessions/)).toBeInTheDocument();
  });

  test('renders a card for each of the sessions', async () => {
    const { getAllByTestId } = await renderSessionsPage();
    const cards = getAllByTestId('session-card');

    expect(cards).toHaveLength(2)
    cards.forEach((card, index) => {
      const session = sessions[index];
      const name = session.id.split('-')[0];
      expect(card).toHaveTextContent(name);
    });
  });

  test('session cards have correct buttons', async () => {
    const { getAllByTestId } = await renderSessionsPage();
    const cards = getAllByTestId('session-card');

    cards.forEach((card, index) => {
      const session = sessions[index];
      const { getByRole } = within(card);

      const connectLink = getByRole("link", { name: "Connect" });
      expect(connectLink).toHaveAttribute("href", `/sessions/${session.id}`);

      const terminateBtn = getByRole("button", { name: "Terminate" });
      expect(terminateBtn).toBeInTheDocument();
    });
  });

  test('session cards show the screenshot', async () => {
    const { getAllByTestId } = await renderSessionsPage();
    const cards = getAllByTestId('session-card');

    cards.forEach((card, index) => {
      const session = sessions[index];
      const { getByRole } = within(card);

      const screenshot = getByRole("img");
      const expectedImageSrc = session.image == null ?
        "placeholder.jpg" :
        `data:image/png;base64,${session.image}`;
      expect(screenshot).toHaveAttribute("src", expectedImageSrc);
    });
  });
});

describe('when session retrieval fails', () => {
  let errors = { errors: [{ status: "500", code: "Internal Server Error" }]};
  let status = 500;

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockReject(() => {
      return new Response(JSON.stringify(errors), { status: status });
    })
  });

  describe('with a 500 error', () => {
    it('shows a generic error message', async () => {
      const { getByText } = await renderSessionsPage();
      expect(getByText('An error has occurred')).toBeInTheDocument();
      expect(
        getByText(/Unfortunately there has been a problem handling your request/)
      ).toBeInTheDocument();
    });
  });

  describe('with a 401 Unauthorized error', () => {
    beforeAll(() => {
      errors = { errors: [{ status: "401", code: "Unauthorized" }]};
      status = 401;
    });

    it('shows an unauthorized error message', async () => {
      const { getByText } = await renderSessionsPage();
      expect(getByText('Unauthorized')).toBeInTheDocument();
      expect(
        getByText(/There was a problem authorizing your username and password/)
      ).toBeInTheDocument();
    });
  });
});

describe('periodic reloading of the sessions data', () => {
  const firstResponse = [
    {
      "id": "410bc483-710c-4795-a859-baeae17f08ce",
      "desktop": "terminal",
      "image": "totally some PNG image data",
    },
  ];
  const secondResponse = [
    {
      "id": "410bc483-710c-4795-a859-baeae17f08ce",
      "desktop": "terminal",
      "image": "totally some PNG image data",
    },
    {
      "id": "1740a970-73e2-42bb-b740-baadb333175d",
      "desktop": "chrome",
      "image": null,
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.advanceTimersByTime(1);
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify(firstResponse));
    fetch.mockResponse(JSON.stringify(secondResponse));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders a count of the sessions', async () => {
    const { getByText } = await renderSessionsPage();

    expect(getByText(/1 currently running .* session/)).toBeInTheDocument();
    await act(async () => { await jest.runOnlyPendingTimers(); });
    expect(getByText(/2 currently running .* sessions/)).toBeInTheDocument();
  });

  test('renders a card for each of the sessions', async () => {
    const { getAllByTestId } = await renderSessionsPage();
    let cards = getAllByTestId('session-card');

    expect(cards).toHaveLength(1)
    cards.forEach((card, index) => {
      const session = firstResponse[index];
      const name = session.id.split('-')[0];
      expect(card).toHaveTextContent(name);
    });

    await act(async () => { await jest.runOnlyPendingTimers(); });
    cards = getAllByTestId('session-card');

    expect(cards).toHaveLength(2)
    cards.forEach((card, index) => {
      const session = secondResponse[index];
      const name = session.id.split('-')[0];
      expect(card).toHaveTextContent(name);
    });
  });
});
