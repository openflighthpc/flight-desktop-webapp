import React, { useState, useContext, useRef } from 'react';
import { Button, Input } from 'reactstrap';
import { useToast } from './ToastContext';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import {
  ConfigContext,
  utils,
  Spinner
} from 'flight-webapp-components';

import { Context as UserConfigContext } from './UserConfigContext';

import ModalContainer from "./ModalContainer";
import { useLaunchSession } from './api';
import { prettyDesktopName } from './utils';

function LaunchDesktopButton({
  className,
  desktop,
  children,
}) {
  const history = useHistory();
  const { addToast } = useToast();

  // Context consumers
  const userConfig = useContext(UserConfigContext);
  const defaultGeometry = userConfig.geometry;
  const clusterName = useContext(ConfigContext).clusterName;

  // Modal controls
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // Input refs/states
  const nameRef = useRef(null);
  const [geometry, setGeometry] = useState(defaultGeometry);

  // Launch session API call
  const { request, post } = useLaunchSession();
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

  return (
    <div>
      <div
        data-testid="launch-modal-button"
        className={classNames(className, { 'disabled': request.loading}, 'card-text')}
        onClick={toggle}
      >
        {children}
        <div className="d-flex align-self-center mb-2">
          {request.loading ?
            <span className="card-text">
              <i className="fa fa-spinner fa-spin mr-1"></i>
              Launching...
            </span> : null}
        </div>
      </div>
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
    </div>
  )
}

function LaunchDesktopModal({
  defaultGeometry,
  desktop,
  geometry,
  launch,
  modal,
  nameRef,
  setGeometry,
  toggle,
  userConfig,
}) {
  const modalTitle = <span>Configure this session</span>;

  // Run launch method and close modal
  const handleSubmit = e => {
    launch();
    toggle();
  };

  // Submit modal on return
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // Modal bottom bar buttons
  const leftButton = (
    <Button
      className="btn-sm"
      color="secondary"
      onClick={toggle}
    >
      Cancel
    </Button>
  );
  const rightButton = (
    <Button
      data-testid="session-launch-button"
      className="btn-sm ml-2"
      onClick={handleSubmit}
    >
      <i className="fa fa-bolt mr-1"></i>
      Launch
    </Button>
  );

  // Config may not have fully loaded yet
  const modalContent =
    userConfig.loading ? 
    <Spinner text="Loading config..." /> :
    <React.Fragment>
      <label for="session-name">
        Give your session a name to more easily identify it (optional).
      </label>
      <input
        id="session-name"
        className="w-100 mb-2"
        name="session-name"
        placeholder="Session name"
        type="text"
        ref={nameRef}
        onKeyDown={handleKeyDown}
        autoFocus={true}
      />

      <label for="session-geometry">
        Specify the geometry for the desktop session (optional).
      </label>
      <Input
        id="session-geometry"
        name="session-geometry"
        onChange={(e) => setGeometry(e.target.value)}
        type="select"
        className="w-100"
        value={geometry}
      >
        <GeometryOptions geometries={userConfig.geometries} defaultGeometry={defaultGeometry} />
      </Input>
    </React.Fragment>;

  return (
    <ModalContainer
      isOpen={modal}
      modalTitle={modalTitle}
      desktop={desktop}
      toggle={toggle}
      leftButton={leftButton}
      rightButton={rightButton}
    >
      {modalContent}
    </ModalContainer>
  );
}

function GeometryOptions({geometries, defaultGeometry}) {
  if (!geometries) { return null }
  return geometries.map(geometry => {
    const isDefault = defaultGeometry === geometry;
    return (
      <option
        key={geometry.key}
        label={`${geometry}${isDefault ? ' (default)'  : ''}`}
        value={geometry}
        selected={isDefault}
      />
    );
  });
}

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

export default LaunchDesktopButton
