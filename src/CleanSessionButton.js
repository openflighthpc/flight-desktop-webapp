import React from 'react';

import ConfirmedActionButton from './ConfirmedActionButton';
import { errorCode, prettyDesktopName } from './utils';
import { useCleanSession } from './api';
import { useToast } from './ToastContext';

function CleanSessionButton({
  className,
  onClean=()=>{},
  onCleaned=()=>{},
  session,
}) {
  const id = `clean-session-${session.id}`;
  const { loading: cleaning, del, response } = useCleanSession(session.id);
  const { addToast } = useToast();
  const cleanSession = async () => {
    onClean();
    try {
      const responseBody = await del();
      if (response.ok) {
        onCleaned();
      } else {
        addToast(cleanFailedToast({
          session: session,
          errorCode: errorCode(responseBody),
        }));
      }
    } catch (e) {
      addToast(cleanFailedToast({
        session: session,
        errorCode: undefined,
      }));
    }
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

function cleanFailedToast({ session, errorCode }) {
  const desktopName = prettyDesktopName[session.desktop];
  const sessionName = session.name || session.id.split('-')[0];

  let body = (
    <div>
      Unfortunately there has been a problem cleaning your
      {' '}<strong>{desktopName}</strong> desktop session
      {' '}<strong>{sessionName}</strong>.  Please try again and, if problems
      persist, help us to more quickly rectify the problem by contacting us
      and letting us know.
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Failed to clean session',
  };
}

export default CleanSessionButton;
