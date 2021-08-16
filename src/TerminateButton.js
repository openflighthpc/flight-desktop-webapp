import React from 'react';
import { Button } from "reactstrap";

import {
  ConfirmedActionButton,
  utils,
} from 'flight-webapp-components';

import { prettyDesktopName } from './utils';
import { useTerminateSession } from './api';
import { useToast } from './ToastContext';

function TerminateButton({ session, className, ...rest }) {
  if (session.state === 'Active') {
    return <ActiveTerminateButton session={session} className={className} {...rest}/>
  } else {
    return <DisabledTerminateButton session={session} className={className}/>
  }
}

function ActiveTerminateButton({
  className,
  onTerminate=()=>{},
  onTerminated=()=>{},
  session,
}) {
  const id = `terminate-session-${session.id}`;
  const { loading: terminating, del, response } = useTerminateSession(session.id);
  const { addToast } = useToast();
  const terminateSession = async () => {
    onTerminate();
    try {
      const responseBody = await del();
      if (response.ok) {
        onTerminated();
      } else {
        addToast(terminateFailedToast({
          session: session,
          errorCode: utils.errorCode(responseBody),
        }));
      }
    } catch (e) {
      addToast(terminateFailedToast({
        session: session,
        errorCode: undefined,
      }));
    }
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

function terminateFailedToast({ session, errorCode }) {
  const desktopName = prettyDesktopName[session.desktop];
  const sessionName = session.name || session.id.split('-')[0];

  let body = (
    <div>
      Unfortunately there has been a problem terminating your
      {' '}<strong>{desktopName}</strong> desktop session
      {' '}<strong>{sessionName}</strong>.  Please try again and, if problems
      persist, help us to more quickly rectify the problem by contacting us
      and letting us know.
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Failed to terminate session',
  };
}

function DisabledTerminateButton({ session, className}) {
  return (
    <Button
      className={`btn btn-danger disabled ${className}`}
      disabled={true}
      id={`terminate-session-${session.id}`}
      size="sm"
    >
      <i className="fa fa-trash mr-1"/>
      <span
        title="Support for terminating remote sessions is not yet available"
      >
        Terminate
      </span>
    </Button>
  );
}

export default TerminateButton;
