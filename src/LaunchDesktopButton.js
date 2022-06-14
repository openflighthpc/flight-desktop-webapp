import React, { useState, useContext, useRef } from 'react';
import { Button } from 'reactstrap';
import { useToast } from './ToastContext';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import {
  ConfigContext,
  utils
} from 'flight-webapp-components';

import ModalContainer from "./ModalContainer";
import { useLaunchSession } from './api';
import { prettyDesktopName } from './utils';

function LaunchDesktopButton({
  className,
  desktop,
  errorToast,
  children,
  color,
  size
}) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const clusterName = useContext(ConfigContext).clusterName;
  const desktopName = prettyDesktopName[desktop.id];
  const modalTitle = <span>
    Prepare launch of <i>'{desktopName}'</i> {desktopName.toLowerCase().endsWith('desktop') ? "" : "desktop"}
  </span>;
  const nameRef = useRef(null);
  const { request, post } = useLaunchSession();
  const { addToast } = useToast();
  const history = useHistory();

  const launchSession = () => {
    post(desktop.id, nameRef.current?.value).then((responseBody) => {
      if (request.response.ok) {
        history.push(`/sessions/${responseBody.id}`);
      } else {
        addToast(errorToast({
          clusterName: clusterName,
          desktop: desktop,
          launchError: utils.errorCode(responseBody),
        }));
      }
    });
  };

  const leftButton = (
    <Button
      color="secondary"
      onClick={toggle}
    >
      <i className="fa fa-chevron-left mr-1" />
      Back
    </Button>
  );
  const rightButton = (
    <Button
      className="ml-2"
      onClick={() => { launchSession(); toggle(); }}
    >
      Start
    </Button>
  );

  return (
    <div>
      <Button
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
        Please input a sensible name for the desktop session (you may leave this blank).
        <input
          className="w-100"
          name="session-name"
          placeholder="Session name"
          type="text"
          ref={nameRef}
        />
      </ModalContainer>
    </div>
  );
}

export default LaunchDesktopButton
