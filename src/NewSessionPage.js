import React from 'react';

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

function NewSessionPage() {
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
    <div>
      <div className="jumbotron bg-white py-4">
        <h1>
          Launch a new desktop session
        </h1>
        <p>
          To launch a new desktop session
        </p>
        <ul>
          <li>Select the desktop session type from the list below.</li>
          <li>Click "Launch".</li>
          <li>When your session is ready you will be automatically connected to it.</li>
          <li>Start working!</li>
        </ul>
      </div>
      {decks}
    </div>
  );
}

export default NewSessionPage;
