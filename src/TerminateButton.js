import React from 'react';

import ConfirmedActionButton from './ConfirmedActionButton';
import { prettyDesktopName } from './utils';

function TerminateButton({
  className,
  session,
  terminating,
  terminateSession,
}) {
  const id = `terminate-session-${session.id}`;

  return (
    <ConfirmedActionButton
      act={terminateSession}
      acting={terminating}
      actingButtonText="Terminating..."
      buttonText="Terminate"
      className={className}
      confirmationHeaderText="Confirm termination"
      confirmationText={
        <React.Fragment>
          <p>
            Are you sure you want to terminate this
            {' '}<strong>{prettyDesktopName[session.desktop]}</strong> session?
          </p>
          <p>
            All trace of this session will be removed and any unsaved work will
            be lost.
          </p>
        </React.Fragment>
      }
      icon="fa-trash"
      id={id}
    />
  );
}

export default TerminateButton;
