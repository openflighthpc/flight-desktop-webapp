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
import Blurb from "./Blurb";
import SessionsPage from "./SessionsPage";

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
  const { groupedItems: groupedDesktops, perGroup } = useMediaGrouping(
    ['(min-width: 1200px)', '(min-width: 992px)', '(min-width: 768px)', '(min-width: 576px)'],
    [3, 2, 2, 1],
    1,
    filteredDesktops,
  );
  const decks = groupedDesktops.map(
    (group, index) => {
      let blanks = null;
      if ( group.length < perGroup) {
        const a = new Array(perGroup - group.length);
        a.fill(0);
      }
      return (
        <div key={index} className="desktop-types-card-deck">
          {
            group.map((desktop) => (
              <DesktopCard key={desktop.id} desktop={desktop} />
            ))
          }
        </div>
      );
    }
  );

  return (
    <React.Fragment>
      <div
        className="centernav col-8"
      >
        <div className="narrow-container">
          <Blurb />
        </div>
        <p className="tagline">
          Select your desktop type from the options below.
        </p>
        { decks }
      </div>
    </React.Fragment>
  );
}

export default DesktopsPage;
