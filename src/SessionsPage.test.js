import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act, render, waitFor, within } from '@testing-library/react';

import {
  ConfigContext,
  CurrentUserContext,
  FetchProvider,
} from 'flight-webapp-components';

import SessionsPage from './SessionsPage';

async function renderSessionsPage() {
  const currentUser = { username: 'test', authToken: 'testAuthToken' };

  const { getByText, queryByText, ...rest } = render(
    <ConfigContext.Provider value={{ apiRootUrl: ""}} >
      <Router>
        <CurrentUserContext.Provider value={{ currentUser, actions: {} }}>
          <FetchProvider cachePolicy="no-cache">
            <SessionsPage />
          </FetchProvider>
        </CurrentUserContext.Provider>
      </Router>
    </ConfigContext.Provider>
  );

  expect(getByText(/Loading sessions/)).toBeInTheDocument();
  await waitFor(() => expect(queryByText(/Loading sessions/)).not.toBeInTheDocument());

  return { getByText, queryByText, ...rest };
}

afterEach(() => {
  fetch.resetMocks();
});

test('renders without crashing', async () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify({ data: [] }));
  await renderSessionsPage();
});

describe('when there are no running sessions', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ data: [] }));
  });

  test('renders a no running sessions message', async () => {
    const { getByRole, getByText } = await renderSessionsPage();

    expect(getByText(/No sessions found./)).toBeInTheDocument();
    const startSessionLink = getByRole("link", { name: /start .* session/i });
    expect(startSessionLink).toHaveAttribute("href", "/new");
  });
});

describe('screenshots', () => {
  const sessions = [
    {
      "id": "410bc483-710c-4795-a859-baeae17f08ce",
      "desktop": "terminal",
      "state": "Active",
    },
  ];

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ data: sessions }));
    fetch.mockResponse((req) => {
      const pathname = new URL(req.url).pathname;
      // console.log('req:', req.method, pathname);  // eslint-disable-line no-console

      if (req.method === 'GET' && pathname.match(new RegExp(`sessions/.*/screenshot$`))) {
        return new Promise(resolve => setTimeout(
          () => resolve({ body: "totally a base64 encoded png", status: 200, }),
          0
        ));
      } else {
        return Promise.resolve('all good');
      }
    });
  });

  // XXX Fix this test and re-enable.  Need a way to base64 encode the image
  // that runs correctly under tests.
  xtest('session cards show the screenshot', async () => {
    const { getAllByTestId } = await renderSessionsPage();
    const cards = getAllByTestId('session-card');

    // This test is much easier to write if we only check the first card.
    const card = cards[0];
    const { getByRole } = within(card);
    expect(getByRole("img")).toHaveAttribute("src", "placeholder.jpg");
    await waitFor(() => {
      expect(getByRole("img")).toHaveAttribute(
        "src",
        "data:image/png;base64,totally a base64 encoded png"
      );
    })
  });
});

describe('when there are running sessions', () => {
  const sessions = [
    {
      "id": "410bc483-710c-4795-a859-baeae17f08ce",
      "desktop": "terminal",
      "state": "Active",
    },
    {
      "id": "1740a970-73e2-42bb-b740-baadb333175d",
      "desktop": "chrome",
      "state": "Exited",
    },
  ];

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ data: sessions }));
    fetch.mockReject(() => {
      return new Response(JSON.stringify("Not Found"), { status: 404 });
    })
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
    expect(sessions).toHaveLength(2)
    expect(sessions[0].state).toEqual('Active');
    expect(sessions[1].state).toEqual('Exited');

    const { getAllByTestId } = await renderSessionsPage();
    const cards = getAllByTestId('session-card');

    expect(cards).toHaveLength(2);
    cards.forEach((card, index) => {
      const session = sessions[index];
      const { queryByRole } = within(card);

      const connectLink = queryByRole("link", { name: "Connect" });
      const terminateBtn = queryByRole("button", { name: "Terminate" });
      const cleanButton = queryByRole("button", { name: "Clean" });

      if (session.state === "Active") {
        expect(connectLink).toBeInTheDocument("href", `/${session.id}`);
        expect(connectLink).toHaveAttribute("href", `/${session.id}`);
        expect(terminateBtn).toBeInTheDocument();
        expect(cleanButton).toBeNull();
      } else {
        expect(connectLink).toBeNull();
        expect(terminateBtn).toBeNull();
        expect(cleanButton).toBeInTheDocument();
      }
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
  const firstResponse = { data: [
    {
      "id": "410bc483-710c-4795-a859-baeae17f08ce",
      "desktop": "terminal",
      "image": "totally some PNG image data",
      "state": "Active",
    },
  ]};
  const secondResponse = { data: [
    {
      "id": "410bc483-710c-4795-a859-baeae17f08ce",
      "desktop": "terminal",
      "image": "totally some PNG image data",
      "state": "Active",
    },
    {
      "id": "1740a970-73e2-42bb-b740-baadb333175d",
      "desktop": "chrome",
      "image": null,
      "state": "Active",
    },
  ]};

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
      const session = firstResponse.data[index];
      const name = session.id.split('-')[0];
      expect(card).toHaveTextContent(name);
    });

    await act(async () => { await jest.runOnlyPendingTimers(); });
    cards = getAllByTestId('session-card');

    expect(cards).toHaveLength(2)
    cards.forEach((card, index) => {
      const session = secondResponse.data[index];
      const name = session.id.split('-')[0];
      expect(card).toHaveTextContent(name);
    });
  });
});
