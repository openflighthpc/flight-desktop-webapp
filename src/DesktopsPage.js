import React, {useContext, useRef, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import {Button} from "reactstrap";

import {
  ConfigContext,
  DefaultErrorMessage,
  Overlay,
  OverlayContainer,
  Spinner,
  UnauthorizedError,
  useMediaGrouping,
  utils,
} from 'flight-webapp-components';

import DesktopCard from './DesktopCard';
import {useFetchDesktops, useLaunchSession} from './api';
import Blurb from "./Blurb";
import {Context as UserConfigContext} from "./UserConfigContext";
import ConfigQuestions from "./ConfigQuestions";
import {useToast} from "./ToastContext";
import {prettyDesktopName} from "./utils";

function DesktopsPage() {
  const {data, error, typesLoading} = useFetchDesktops();

  const userConfig = useContext(UserConfigContext);
  const defaultGeometry = userConfig.geometry;

  const nameRef = useRef(null);
  const [geometry, setGeometry] = useState(defaultGeometry);
  const desktops = utils.getResourcesFromResponse(data);
  const [desktop, setDesktop] = useState(null);

  const history = useHistory();
  const {addToast} = useToast();
  const clusterName = useContext(ConfigContext).clusterName;

  function launchErrorToast({ clusterName, desktop, launchError }) {
    const desktopName = prettyDesktopName[desktop.id];
    let body = (
      <div>
        Unfortunately there has been a problem launching your
        {' '}<strong>{desktopName}</strong> desktop session.  Please try
        again and, if problems persist, help us to more quickly rectify the
        problem by contacting us and letting us know.
      </div>
    );
    if (launchError === 'Desktop Not Prepared') {
      body = (
        <div>
          <strong>{desktopName}</strong> has not yet been fully configured.  If
          you would like to use this desktop please contact the system
          administrator for {' '}<em>{clusterName}</em> and ask them to prepare
          this desktop.
        </div>
      );
    }

    return {
      body,
      icon: 'danger',
      header: 'Failed to launch desktop',
    };
  }

  // Launch session API call
  const {request, post} = useLaunchSession();
  const launchSession = () => {
    post(desktop.id, nameRef.current?.value, geometry).then((responseBody) => {
      if (request.response.ok) {
        history.push(`/sessions/${responseBody.id}`);
      } else {
        addToast(launchErrorToast({
          clusterName: clusterName,
          desktop: desktop,
          launchError: utils.errorCode(responseBody),
        }));
      }
    });
  };

  const handleSubmit = e => {
    launchSession();
  };

  if (error) {
    if (utils.errorCode(data) === 'Unauthorized') {
      return <UnauthorizedError/>;
    } else {
      return <DefaultErrorMessage/>;
    }
  } else {
    return (
      <>
        <div className="centernav col-8">
          <BackLink/>
          <div className="narrow-container">
            <Blurb/>
          </div>
          {
            typesLoading && (
              <OverlayContainer>
                <Overlay>
                  <Spinner text="Loading desktops..."/>
                </Overlay>
              </OverlayContainer>
            )
          }
          {
            desktops != null ? (
              <>
                <DesktopsList
                  desktops={desktops}
                  loading={request.loading}
                  selectedDesktop={desktop}
                />
                <ConfigQuestions
                  defaultGeometry={defaultGeometry}
                  geometry={geometry}
                  launch={handleSubmit}
                  nameRef={nameRef}
                  setGeometry={setGeometry}
                  userConfig={userConfig}
                />
                <LaunchButton/>
              </>
            ) : (
              <p className="tagline">
                No desktop types available.
              </p>
            )
          }
        </div>
      </>
    );
  }

  function LaunchButton() {
    return (
      <Button
        data-testid="session-launch-button"
        className="button link launch-button"
        onClick={handleSubmit}
        disabled={desktop === null || request.loading}
        title={ desktop === null ? "Select a desktop type to continue" : "" }
      >
        {
          request.loading ?
            <span className="d-flex">
                        <span className="mr-2">LAUNCHING</span>
                        <Spinner/>
                      </span>
            :
            'LAUNCH'
        }
      </Button>
    );
  }

  function DesktopsList({desktops, loading, selectedDesktop}) {
    const filteredDesktops = desktops.filter(desktop => desktop.verified);
    const {groupedItems: groupedDesktops, perGroup} = useMediaGrouping(
      ['(min-width: 1200px)', '(min-width: 992px)', '(min-width: 768px)', '(min-width: 576px)'],
      [3, 2, 2, 1],
      1,
      filteredDesktops,
    );
    const decks = groupedDesktops.map(
      (group, index) => {
        if (group.length < perGroup) {
          const a = new Array(perGroup - group.length);
          a.fill(0);
        }
        return (
          <div key={index} className="desktop-types-card-deck">
            {
              group.map((desktop) => (
                <DesktopCard
                  key={desktop.id}
                  desktop={desktop}
                  loading={loading}
                  selected={selectedDesktop === desktop}
                  onClick={() => setDesktop(desktop)}
                />
              ))
            }
          </div>
        );
      }
    );

    return (
      <>
        <p className="tagline">
          Select your desktop type from the options below.
        </p>
        {decks}
      </>
    );
  }

  function BackLink() {
    return (
      <Link
        to=".."
        relative="path"
        className="back-link blue-text"
      >
        Back to desktops
      </Link>
    );
  }
}

export default DesktopsPage;
