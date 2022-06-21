import React, { useState, useContext, useRef } from 'react';
import { Button, Input } from 'reactstrap';
import { useToast } from './ToastContext';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import {
  ConfigContext,
  utils,
  DefaultErrorMessage,
  UnauthorizedError
} from 'flight-webapp-components';

import { Context as UserConfigContext } from './UserConfigContext';

import ModalContainer from "./ModalContainer";
import { useLaunchSession } from './api';
import { prettyDesktopName } from './utils';

function LaunchDesktopButton({
  className,
  desktop,
  children,
  color,
  size
}) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const clusterName = useContext(ConfigContext).clusterName;
  const modalTitle = <span>Configure this session</span>;
  const nameRef = useRef(null);
  const [geometry, setGeometry] = useState();
  const { request, post } = useLaunchSession();
  const { addToast } = useToast();
  const history = useHistory();

  const { geometries } = useContext(UserConfigContext);

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
    toggle();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

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

  return (
    <div>
      <Button
        data-testid="launch-modal-button"
        color={color}
        size={size}
        className={classNames(className, { 'disabled': request.loading})}
        onClick={toggle}
      >
        {
          request.loading ?
            <i className="fa fa-spinner fa-spin mr-1"></i> :
            <i className="fa fa-bolt mr-1"></i>
        }
        <span>{ request.loading ? 'Launching...' : 'Launch' }</span>
      </Button>
      <ModalContainer
        isOpen={modal}
        modalTitle={modalTitle}
        desktop={desktop}
        toggle={toggle}
        leftButton={leftButton}
        rightButton={rightButton}
      >
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
          <GeometryOptions geometries={geometries} />
        </Input>

      </ModalContainer>
    </div>
  );
}

function GeometryOptions({geometries}) {
  return geometries.map(geometry => {
    return (
      <option
        key={geometry.key}
        label={geometry}
        value={geometry}
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
