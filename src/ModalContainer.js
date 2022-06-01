import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  DefaultErrorMessage,
  NotFound,
  Overlay,
  Spinner,
  utils,
} from 'flight-webapp-components';

function ModalContainer({
  className,
  isOpen,
  desktop,
  size="lg",
  modalTitle,
  toggle,
}) {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className={className}
      size={size}
    >
    </Modal>
  );
}

export default ModalContainer;
