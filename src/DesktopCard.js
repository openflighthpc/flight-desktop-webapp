import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';

import { CardFooter } from './CardParts';
import { useLaunchSession } from './api';
import { errorCode } from './utils';
import Portal from './Portal';

function DesktopCard({ desktop }) {
  const [ showToast, setShowToast ] = useState(false);
  const { loading, post, response } = useLaunchSession(desktop);
  const history = useHistory();
  const launchSession = () => {
    setShowToast(false);
    post().then(redirectToSession);
  };
  const redirectToSession = (responseBody) => {
    if (response.ok) {
      history.push(`/sessions/${responseBody.id}`);
    } else {
      console.log('Error launch session', errorCode(responseBody));
      setShowToast(true);
    }
  }

  return (
    <div className="card border-primary mb-2">
      <h5 className="card-header bg-primary text-light">
        {desktop.name}
      </h5>
      <div className="card-body">
        <div className="row mb-2">
          <div className="col">
            {desktop.description}
          </div>
        </div>
      </div>
      <CardFooter>
        <div className="btn-toolbar justify-content-center">
          <button
            className={`btn btn-primary mr-2 ${loading ? 'disabled' : null}`}
            onClick={launchSession}
            disabled={loading}
          >
            {
              loading ?
                <i className="fa fa-spinner fa-spin mr-1"></i> :
                <i className="fa fa-bolt mr-1"></i>
            }
            <span>{ loading ? 'Launching...' : 'Launch' }</span>
          </button>
        </div>
      </CardFooter>
      {
        showToast ? (
          <LaunchErrorToast
            desktop={desktop}
            showToast={showToast}
            toggle={() => setShowToast(s => !s)}
          />
        ) : null
      }
    </div>
  );
}

function LaunchErrorToast({ desktop, showToast, toggle }) {
  return (
    <Portal id="toast-portal">
      <Toast isOpen={showToast}>
        <ToastHeader
          icon="danger"
          toggle={toggle}
        >
          Failed to launch desktop
        </ToastHeader>
        <ToastBody>
          Unfortunately there has been a problem launching your
          {' '}<strong>{desktop.name}</strong> desktop session.  Please try
          again and, if problems persist, help us to more quickly rectify the
          problem by contacting us and letting us know.
        </ToastBody>
      </Toast>
    </Portal>
  );
}

export default DesktopCard;
