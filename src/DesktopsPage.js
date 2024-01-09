import React, {useContext, useRef, useState} from 'react';
import {useHistory} from "react-router-dom";

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
import LaunchDesktopModal from "./LaunchDesktopModal";
import {useToast} from "./ToastContext";
import {prettyDesktopName} from "./utils";

function DesktopsPage() {
  const {data, error, loading} = useFetchDesktops();

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

  const desktopQuestions =
    <>
      <LaunchDesktopModal
        defaultGeometry={defaultGeometry}
        geometry={geometry}
        launch={launchSession}
        nameRef={nameRef}
        setGeometry={setGeometry}
        userConfig={userConfig}
      />
    </>;

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
          <div className="narrow-container">
            <Blurb/>
          </div>
          {
            loading && (
              <OverlayContainer>
                <Overlay>
                  <Spinner text="Loading desktops..."/>
                </Overlay>
              </OverlayContainer>
            )
          }
          {
            desktops != null && (
              <>
                <DesktopsList desktops={desktops} loading={request.loading} selectedDesktop={desktop}/>
                {desktopQuestions}
              </>
            )
          }
        </div>
      </>
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
                  className="aa"
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
}

export default DesktopsPage;
