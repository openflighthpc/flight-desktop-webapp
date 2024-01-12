import React, { useState } from 'react';
import {
  Button,
  ButtonToolbar,
  Modal,
  ModalBody,
  Popover,
  PopoverBody,
  PopoverHeader
} from 'reactstrap';

import { 
  utils
} from 'flight-webapp-components';

import RenameInput from './RenameInput';
import ResizeInput from './ResizeInput';

import { useConfigureSession } from '../api';

import { prettyDesktopName } from '../utils';
import { useToast } from '../ToastContext';
import classNames from "classnames";

function ConfigureButton({
  className,
  onConfigured,
  session,
}) {
  const id = `configure-session-${session.id}`;
  const [ showConfirmation, setShowConfirmation] = useState(false);
  const toggle = () => setShowConfirmation(!showConfirmation);
  const { addToast } = useToast();
  const [name, setName] = useState(session.name);
  const [geometry, setGeometry] = useState(session.geometry);
  const resizable = (session.capabilities || []).includes("resizable");

  const { loading: configuring, request, post } = useConfigureSession(session.id);
  const configureSession = async () => {
    try {
      const params = {name};
      if (resizable) {
        params["geometry"] = geometry;
      }
      post(params).then((responseBody) => {
        if (request.response.ok) {
          onConfigured(name, geometry);
        } else {
          addToast(configureFailedToast({
            session: session,
            errorCode: utils.errorCode(responseBody)
          }));
        }
      });
    } catch (e) {
      addToast(configureFailedToast({
        session:session,
        errorCode: undefined,
      }));
    }
  }


  const handleSubmit = e => {
    e.preventDefault();
    configureSession();
    toggle();
  };

  return (
    <React.Fragment>
      <a
        className={className}
        id={id}
        tabIndex={0}
        onClick={toggle}
      >
        { configuring ? 'Configuring...' : 'Settings' }
      </a>
      <Modal
        autoFocus={false}
        isOpen={showConfirmation}
        toggle={toggle}
        centered={true}
      >
        <ModalBody>
          <h3 className="mb-4">Configure session</h3>
          <form onSubmit={handleSubmit}>
            <RenameInput
              autoFocus={true}
              current={name}
              handleChange={setName}
              session={session}
            />
            {
              !resizable ? null : (
                <ResizeInput
                  current={geometry}
                  handleChange={setGeometry}
                  session={session}
                />
              )
            }
            <div className="d-flex justify-content-center mt-4">
              <Button
                className="button link white-text mr-3"
                type="submit"
              >
                Update
              </Button>
              <Button
                className="cancel-button button link blue-text"
                onClick={toggle}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

function configureFailedToast({session, errorCode}) {
  const desktopName = prettyDesktopName[session.desktop];
  const sessionName = session.name || session.id.split('-')[0];

  let body = (
    <div>
      Unfortunately there has been a problem configuring your
      {' '}<strong>{desktopName}</strong> desktop session
      {' '}<strong>{sessionName}</strong>.  Please try again and, if problems
      persist, help us to more quickly rectify the problem by contacting us
      and letting us know.
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Failed to configure session',
  };
}

export default ConfigureButton;
