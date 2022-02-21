import React from 'react';
import { Jumbotron } from 'reactstrap';

import {
  DefaultErrorMessage,
  Overlay,
  OverlayContainer,
  Spinner,
  UnauthorizedError,
  useMediaGrouping,
  utils,
} from 'flight-webapp-components';

import DesktopCard from './DesktopCard';
import styles from './DesktopsPage.module.css';
import { useFetchDesktops } from './api';

function DesktopsPage() {
  const { data, error, loading } = useFetchDesktops();

  if (error) {
    if (utils.errorCode(data) === 'Unauthorized') {
      return <UnauthorizedError />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    const desktops = utils.getResourcesFromResponse(data);
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
  const filteredDesktops = desktops.filter(desktop => desktop.verified);
  const { groupedItems: groupedDesktops } = useMediaGrouping(
    ['(min-width: 1200px)', '(min-width: 992px)', '(min-width: 768px)', '(min-width: 576px)'],
    [3, 2, 2, 1],
    1,
    filteredDesktops,
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
      <Jumbotron className={`${styles.Jumbotron} bg-white py-4`}>
        <h1>
          Launch a new desktop session
        </h1>
        <ul>
          <li>Select the desktop session type from the list below.</li>
          <li>Click "Launch".</li>
          <li>When your session is ready you will be automatically connected to it.</li>
          <li>Start working!</li>
        </ul>
      </Jumbotron>
      {decks}
    </React.Fragment>
  );
}

export default DesktopsPage;
