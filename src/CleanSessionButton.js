import React from 'react';

import ConfirmedActionButton from './ConfirmedActionButton';
import { prettyDesktopName } from './utils';
import { useCleanSession } from './api';

function CleanSessionButton({
  className,
  onClean=()=>{},
  onCleaned=()=>{},
  session,
}) {
  const id = `clean-session-${session.id}`;
  const { loading: cleaning, del } = useCleanSession(session.id);
  const cleanSession = () => {
    onClean();
    del().then(onCleaned);
  };

  return (
    <ConfirmedActionButton
      act={cleanSession}
      acting={cleaning}
      actingButtonText="Cleaning..."
      buttonText="Clean"
      className={className}
      confirmationHeaderText="Confirm session cleanup"
      confirmationText={<p>
        Are you sure you want to clean this
        {' '}<strong>{prettyDesktopName[session.desktop]}</strong> session?
      </p>}
      icon="fa-times"
      id={id}
    />
  );
}

export default CleanSessionButton;
