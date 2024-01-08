import React, {useContext, useRef, useState} from 'react';

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
import {useHistory} from "react-router-dom";
import {useToast} from "./ToastContext";

function DesktopsPage() {
  const {data, error, loading} = useFetchDesktops();

  // Context consumers
  const userConfig = useContext(UserConfigContext);
  const defaultGeometry = userConfig.geometry;

  // Modal controls
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // Input refs/states
  const nameRef = useRef(null);
  const [geometry, setGeometry] = useState(defaultGeometry);

  const history = useHistory();
  const {addToast} = useToast();
  const clusterName = useContext(ConfigContext).clusterName;

  const desktops = utils.getResourcesFromResponse(data);
  let desktop = desktops !== null ? desktops[0] : null;

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
        desktop={desktop}
        geometry={geometry}
        launch={launchSession}
        modal={modal}
        nameRef={nameRef}
        setGeometry={setGeometry}
        toggle={toggle}
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
      <React.Fragment>
        <div
          className="centernav col-8"
        >
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
          <p className="tagline">
            Select your desktop type from the options below.
          </p>
          {desktops != null && <DesktopsList desktops={desktops} loading={request.loading}/>}
          {desktops != null && desktopQuestions}
        </div>
      </React.Fragment>
    );
  }
}

function DesktopsList({desktops, loading}) {
  const filteredDesktops = desktops.filter(desktop => desktop.verified);
  const {groupedItems: groupedDesktops, perGroup} = useMediaGrouping(
    ['(min-width: 1200px)', '(min-width: 992px)', '(min-width: 768px)', '(min-width: 576px)'],
    [3, 2, 2, 1],
    1,
    filteredDesktops,
  );

  return groupedDesktops.map(
    (group, index) => {
      if (group.length < perGroup) {
        const a = new Array(perGroup - group.length);
        a.fill(0);
      }
      return (
        <div key={index} className="desktop-types-card-deck">
          {
            group.map((desktop) => (
              <DesktopCard key={desktop.id} desktop={desktop} loading={loading}/>
            ))
          }
        </div>
      );
    }
  );
}

export default DesktopsPage;
