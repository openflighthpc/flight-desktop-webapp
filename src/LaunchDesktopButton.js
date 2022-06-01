import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { useToast } from './ToastContext';

import ModalContainer from "./ModalContainer";

function LaunchDesktopButton({ className, desktop, children }) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const modalTitle = <span>Prepare launch of <i>{desktop.id}</i></span>;

  return (
    <div>
      <Button
        className={className}
        onClick={toggle}
      >
        <i className={`fa fa-rocket mr-1`}></i>
        <span>Launch</span>
      </Button>
      <ModalContainer
        isOpen={modal}
        desktop={desktop}
        toggle={toggle}
      />
    </div>
  );
}

export default LaunchDesktopButton
