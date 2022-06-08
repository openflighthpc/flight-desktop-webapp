import React, { useState, useRef } from 'react';
import {
  Button,
  ButtonToolbar,
  Popover,
  PopoverBody,
  PopoverHeader
} from 'reactstrap';

import {
  utils,
} from 'flight-webapp-components';

import { useRenameSession } from './api';

import { prettyDesktopName } from './utils';
import { useToast } from './ToastContext';

function RenameButton({
  className,
  session,
  onRenamed=()=>{},
}) {
  const nameRef = useRef(null);
  const id = `rename-session-${session.id}`;
  const { addToast } = useToast();
  const { loading: renaming, request, post } = useRenameSession(session.id);
  const renameSession = async () => {
    try {
      post(session.id, nameRef.current?.value).then((responseBody) => {
        if (request.response.ok) {
          onRenamed();
        } else {
          addToast(renameFailedToast({
            session: session,
            errorCode: utils.errorCode(responseBody)
          }));
        }
      });
    } catch (e) {
      addToast(renameFailedToast({
        session: session,
        errorCode: undefined,
      }));
    }
  }
  const [ showConfirmation, setShowConfirmation] = useState(false);
  const toggle= () => setShowConfirmation(!showConfirmation);

  return (
    <React.Fragment>
      <Button
      className={`${className} ${renaming ? 'disabled ' : null}` }
      disabled={renaming}
      id={id}
      >
        {
          renaming ?
            <i className="fa fa-spinner fa-spin mr-1"></i> :
            <i className="fa fa-pencil-square mr-1"></i>
        }
        <span>{ renaming ? 'Renaming...' : 'Rename' }</span>
      </Button>
      <Popover
        isOpen={showConfirmation}
        target={id}
        toggle={toggle}
      >
        <PopoverHeader>
          Rename session
        </PopoverHeader>
        <PopoverBody>
          <p>
            Please enter a suitable name for your session (you may leave this blank).
            <input
              className="w-100"
              name="session-name"
              placeholder="Session name"
              type="text"
              ref={nameRef}
            />
          </p>
          <ButtonToolbar className="justify-content-center">
            <Button
              className="mr-2"
              onClick={toggle}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className="mr-2"
              onClick={() => {renameSession(); toggle(); }}
              size="sm"
            >
              <i className="fa fa-pencil-square mr-1"></i>
              Rename
            </Button>
          </ButtonToolbar>
        </PopoverBody>
      </Popover>
    </React.Fragment>
  );
}

function renameFailedToast({session, errorCode}) {
  const desktopName = prettyDesktopName[session.desktop];
  const sessionName = session.name || session.id.split('-')[0];

  let body = (
    <div>
      Unfortunately there has been a problem renaming your
      {' '}<strong>{desktopName}</strong> desktop session
      {' '}<strong>{sessionName}</strong>.  Please try again and, if problems
      persist, help us to more quickly rectify the problem by contacting us
      and letting us know.
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Failed to rename session',
  };
}

export default RenameButton;
