import React, { useState, useContext } from 'react';
import { Button } from 'reactstrap';
import { useToast } from './ToastContext';

import {
  ConfigContext
} from 'flight-webapp-components';

import ModalContainer from "./ModalContainer";
import { useLaunchSession } from './api';
import { prettyDesktopName } from './utils';

function LaunchDesktopButton({ className, desktop, errorToast, launch, children }) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const desktopName = prettyDesktopName[desktop.id];
  const modalTitle = <span>Prepare launch of '{desktopName}' desktop</span>;
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
      classname="ml-2"
      onClick={() => { launch(); toggle(); }}
    >
      Launch
    </Button>
  );


  return (
    <div>
      <Button
        className={className}
        onClick={toggle}
      >
        {children}
      </Button>
      <ModalContainer
        isOpen={modal}
        modalTitle={modalTitle}
        desktop={desktop}
        toggle={toggle}
        leftButton={leftButton}
        rightButton={rightButton}
      />
    </div>
  );
}

export default LaunchDesktopButton
