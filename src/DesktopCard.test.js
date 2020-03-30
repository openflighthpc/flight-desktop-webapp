import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DesktopCard from './DesktopCard';
import FetchProvider from './FetchProvider';
import { Context as ConfigContext } from './ConfigContext';
import { Context as CurrentUserContext } from './CurrentUserContext';
import { prettyDesktopName } from './utils';

const exampleDesktop = {
  id: "gnome",
  summary: "Placeholder summary",
};

function WrappedDesktopCard({ desktop }) {
  const currentUser = { username: 'alces' };

  return(
    <ConfigContext.Provider value={{ apiRootUrl: ""}} >
      <Router>
        <CurrentUserContext.Provider value={{ currentUser, actions: {} }}>
          <FetchProvider>
            <DesktopCard desktop={desktop} />
          </FetchProvider>
        </CurrentUserContext.Provider>
      </Router>
    </ConfigContext.Provider>
  );
}

test('includes details of the desktop', () => {
  const { getByRole, getByText } = render(<WrappedDesktopCard desktop={exampleDesktop} />);

  expect(getByRole('heading')).toHaveTextContent(prettyDesktopName[exampleDesktop.id]);
  expect(getByText(exampleDesktop.summary)).toBeInTheDocument();
});

test('includes a button to launch the desktop', () => {
  const { getByRole } = render(<WrappedDesktopCard desktop={exampleDesktop} />);

  expect(getByRole('button')).toHaveTextContent('Launch');
});
