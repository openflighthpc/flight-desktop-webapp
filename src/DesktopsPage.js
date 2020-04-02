import React from 'react';
import { Jumbotron } from 'reactstrap';
import styled from 'styled-components'

import DesktopCard from './DesktopCard';
import Overlay, { OverlayContainer } from './Overlay';
import Spinner from './Spinner';
import UnauthorizedError from './UnauthorizedError';
import { DefaultErrorMessage } from './ErrorBoundary';
import { errorCode, isObject } from './utils';
import { useFetchDesktops } from './api';
import { useMediaGrouping } from './useMedia';

function getDesktopsFromResponse(data) {
  if (!isObject(data)) { return null; }
  if (!Array.isArray(data.data)) { return null; }
  return data.data;
}

function DesktopsPage() {
  const { data, error, loading } = useFetchDesktops();

  if (error) {
    if (errorCode(data) === 'Unauthorized') {
      return <UnauthorizedError />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    const desktops = getDesktopsFromResponse(data);
    return (
      <React.Fragment>
        {
          loading && (
            <OverlayContainer>
              <Overlay>
                <Spinner text="Loading desktops..."/>
              </Overlay>
            </OverlayContainer>
          )
        }
        { desktops != null && <DesktopsList desktops={desktops} /> }
      </React.Fragment>
    );
  }
}

function DesktopsList({ desktops }) {
  const { groupedItems: groupedDesktops } = useMediaGrouping(
    ['(min-width: 1200px)', '(min-width: 992px)', '(min-width: 768px)', '(min-width: 576px)'],
    [3, 2, 2, 1],
    1,
    desktops,
  );
  const decks = groupedDesktops.map(
    (group, index) => (
      <div key={index} className="card-deck">
        {group.map((desktop) => <DesktopCard key={desktop.id} desktop={desktop} />)}
      </div>
    )
  );

  return (
    <React.Fragment>
      <StyledJumbotron className="bg-white py-4">
        <h1>
          Launch a new desktop session
        </h1>
        <ul>
          <li>Select the desktop session type from the list below.</li>
          <li>Click "Launch".</li>
          <li>When your session is ready you will be automatically connected to it.</li>
          <li>Start working!</li>
        </ul>
      </StyledJumbotron>
      {decks}
    </React.Fragment>
  );
}

const StyledJumbotron = styled(Jumbotron)`
  position:relative;

  :before {
    color: var(--success);
    content: "\f135";
    font-family: FontAwesome;
    font-size: 12em;
    opacity: 0.2;
    position: absolute;

    @media (max-width: 1199.98px) {
      top: 50%;
      left: 50%;
      bottom: unset;
      right: unset;
      transform: translate(-50%, -50%);
    }
    @media (min-width: 1200px) {
      top: 50%;
      left: unset;
      bottom: unset;
      right: 32px;
      transform: translateY(-50%);
    }
  }
`;

export default DesktopsPage;