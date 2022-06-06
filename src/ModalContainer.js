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
  leftButton,
  rightButton,
  children
}) {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className={className}
      size={size}
    >
      <ModalContent
        leftButton={leftButton}
        rightButton={rightButton}
        toggle={toggle}
        modalTitle={modalTitle}
      >
        {children}
      </ModalContent>
    </Modal>
  );
}

function ModalContent({
  children,
  leftButton,
  modalTitle,
  rightButton,
  title,
  toggle
}) {
  return (
    <React.Fragment>
      <ModalHeader toggle={toggle} title={modalTitle}>
        {modalTitle}
      </ModalHeader>
      <ModalBody>
        <h4 className="text-truncate" title={title} >
          {title}
        </h4>
        {children}
      </ModalBody>
      <ModalFooter>
        {leftButton}
        {rightButton}
      </ModalFooter>
    </React.Fragment>
  );
}

export default ModalContainer;
