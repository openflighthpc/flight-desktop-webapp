import React from 'react';

import ConfirmedActionButton from './ConfirmedActionButton';
import { prettyDesktopName } from './utils';
import { useTerminateSession } from './api';

function TerminateButton({
  className,
  onTerminate=()=>{},
  onTerminated=()=>{},
  session,
}) {
  const id = `terminate-session-${session.id}`;
  const { loading: terminating, del } = useTerminateSession(session.id);
  const terminateSession = () => {
    onTerminate();
    del().then(onTerminated);
  };

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
