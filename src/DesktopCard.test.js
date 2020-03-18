import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DesktopCard from './DesktopCard';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import FetchProvider from './FetchProvider';

const exampleDesktop = {
  type: "example",
  name: "Example name",
  description: "Example description",
};

function WrappedDesktopCard({ desktop }) {
  return(
    <Router>
      <CurrentUserProvider>
        <FetchProvider>
          <DesktopCard desktop={desktop} />
        </FetchProvider>
      </CurrentUserProvider>
    </Router>
  );
}

test('includes details of the desktop', () => {
  const { getByRole, getByText } = render(<WrappedDesktopCard desktop={exampleDesktop} />);

  expect(getByRole('heading')).toHaveTextContent(exampleDesktop.name);
  expect(getByText(exampleDesktop.description)).toBeInTheDocument();
});

test('includes a button to launch the desktop', () => {
  const { getByRole } = render(<WrappedDesktopCard desktop={exampleDesktop} />);

  expect(getByRole('button')).toHaveTextContent('Launch');
});
