import React, { useState } from 'react';
import {
  Button,
  ButtonToolbar,
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

  const { loading: configuring, request, post } = useConfigureSession(session.id);
  const configureSession = async () => {
    try {
      const params = {name, geometry};
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
      <Button
        className={className}
        disabled={configuring}
        id={id}
      >
        {
          configuring ?
          <i className="fa fa-spinner fa-spin mr-1"></i> :
          <i className="fa fa-cog mr-1"></i>
        }
        <span>{ configuring ? 'Configuring...' : 'Configure' }</span>
      </Button>
      <Popover
        isOpen={showConfirmation}
        target={id}
        toggle={toggle}
      >
        <PopoverHeader>
          Configure session
        </PopoverHeader>
        <PopoverBody>
          <form onSubmit={handleSubmit}>
            <RenameInput
              autoFocus={true}
              current={name}
              handleChange={setName}
              session={session}
            />
            <ResizeInput
              current={geometry}
              handleChange={setGeometry}
              session={session}
            />

            <ButtonToolbar className="justify-content-center">
              <Button
                className="mr-2"
                onClick={toggle}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                className="mr-2"
                color="primary"
                size="sm"
                type="submit"
              >
                <i className="fa fa-cog mr-1"></i>
                Configure
              </Button>
            </ButtonToolbar>
          </form>
        </PopoverBody>
      </Popover>
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
