import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';

import { CardFooter } from './CardParts';
import { Context as ConfigContext } from './ConfigContext';
import { useToast } from './ToastContext';
import { errorCode } from './utils';
import { useLaunchSession } from './api';

function DesktopCard({ desktop }) {
  const { loading, post, response } = useLaunchSession(desktop);
  const history = useHistory();
  const { addToast } = useToast();
  const launchSession = () => {
    post().then((responseBody) => {
      if (response.ok) {
        history.push(`/sessions/${responseBody.id}`);
      } else {
        const { removeToast } = addToast(
          <LaunchErrorToast
            desktop={desktop}
            launchError={errorCode(responseBody)}
            toggle={() => removeToast()}
          />
        );
      }
    });
  };

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
    </div>
  );
}

function LaunchErrorToast({ desktop, launchError, toggle }) {
  const clusterName = useContext(ConfigContext).clusterName;
  let body = (
    <div>
      Unfortunately there has been a problem launching your
      {' '}<strong>{desktop.name}</strong> desktop session.  Please try
      again and, if problems persist, help us to more quickly rectify the
      problem by contacting us and letting us know.
    </div>
  );
  if (launchError === 'Desktop Not Prepared') {
    body = (
      <div>
        <strong>{desktop.name}</strong> has not yet been fully configured.  If
        you would like to use this desktop please contact the system
        administrator for {' '}<em>{clusterName}</em> and ask them to prepare
        this desktop.
      </div>
    );
  }

  return (
    <Toast isOpen={true}>
      <ToastHeader
        icon="danger"
        toggle={toggle}
      >
        Failed to launch desktop
      </ToastHeader>
      <ToastBody>
        {body}
      </ToastBody>
    </Toast>
  );
}

export default DesktopCard;
