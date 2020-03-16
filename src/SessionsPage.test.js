import React from 'react';
import SessionsPage from './SessionsPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import { SessionsProvider } from './SessionsContext';
import { render, wait, within } from '@testing-library/react';

async function renderSessionsPage() {
  const { getByText, queryByText, ...rest } = render(
    <Router>
      <CurrentUserProvider user={{ username: 'test', authToken: 'test:test' }}>
        <SessionsProvider>
          <SessionsPage />
        </SessionsProvider>
      </CurrentUserProvider>
    </Router>
  );

  expect(getByText(/Loading sessions/)).toBeInTheDocument();
  await wait(() => expect(queryByText(/Loading sessions/)).not.toBeInTheDocument());

  return { getByText, queryByText, ...rest };
}

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

      const terminateLink = getByRole("link", { name: "Terminate" });
      expect(terminateLink).toHaveAttribute("href", `/sessions/${session.id}/terminate`);
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
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockReject(new Error('fake error message'))
  });

  it('shows an error message', async () => {
    const { getByText } = await renderSessionsPage();
    expect(getByText('An error has occurred')).toBeInTheDocument();
    expect(
      getByText(/Unfortunately there has been a problem handling your request/)
    ).toBeInTheDocument();
  });
});
