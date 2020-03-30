import React, { useState } from 'react';
import {
  Button,
  ButtonToolbar,
  Popover,
  PopoverBody,
  PopoverHeader,
} from 'reactstrap';

import { prettyDesktopName } from './utils';

function TerminateButton({ className, terminating, terminateSession, session }) {
  const [showConfirmation, setShowConfirmation]  = useState(false);
  const toggle = () => setShowConfirmation(!showConfirmation);
  const id = `terminate-session-${session.id}`;

  return (
    <>
    <Button
      className={`btn btn-danger ${terminating ? 'disabled' : null} ${className}`}
      disabled={terminating}
      id={id}
    >
      {
        terminating ?
          <i className="fa fa-spinner fa-spin mr-1"></i> :
          <i className="fa fa-trash mr-1"></i>
      }
      <span>{ terminating ? 'Terminating...' : 'Terminate' }</span>
    </Button>
    <Popover
      isOpen={showConfirmation}
      target={id}
      toggle={toggle}
    >
      <PopoverHeader>
        Confirm termination
      </PopoverHeader>
      <PopoverBody>
        <p>
          Are you sure you want to terminate this
          {' '}<strong>{prettyDesktopName[session.desktop]}</strong> session?
        </p>
        <p>
          All trace of this session will be removed and any unsaved work will
          be lost.
        </p>
        <ButtonToolbar className="justify-content-center">
          <Button
            className="mr-2"
            onClick={toggle}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={() => { toggle(); terminateSession(); }}
          >
            <i className="fa fa-trash mr-1"></i>
            <span>Terminate</span>
          </Button>
        </ButtonToolbar>
      </PopoverBody>
    </Popover>
    </>
  );
}

export default TerminateButton;
