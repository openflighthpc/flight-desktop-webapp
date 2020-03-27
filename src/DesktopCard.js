import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { CardFooter } from './CardParts';
import { Context as ConfigContext } from './ConfigContext';
import { useToast } from './ToastContext';
import { errorCode, prettyDesktopName } from './utils';
import { useLaunchSession } from './api';

function DesktopCard({ desktop }) {
  const { loading, post, response } = useLaunchSession(desktop);
  const history = useHistory();
  const { addToast } = useToast();
  const clusterName = useContext(ConfigContext).clusterName;
  const launchSession = () => {
    post().then((responseBody) => {
      if (response.ok) {
        history.push(`/sessions/${responseBody.id}`);
      } else {
        addToast(launchErrorToast({
          clusterName: clusterName,
          desktop: desktop,
          launchError: errorCode(responseBody),
        }));
      }
    });
  };
  const desktopName = prettyDesktopName[desktop.id];

  return (
    <div className="card border-primary mb-2">
      <h5
        className="card-header bg-primary text-light text-truncate"
        title={desktopName}
      >
        {desktopName}
      </h5>
      <div className="card-body">
        <div className="row mb-2">
          <div className="col">
            {desktop.summary}
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

function launchErrorToast({ clusterName, desktop, launchError }) {
  const desktopName = prettyDesktopName[desktop.id];
  let body = (
    <div>
      Unfortunately there has been a problem launching your
      {' '}<strong>{desktopName}</strong> desktop session.  Please try
      again and, if problems persist, help us to more quickly rectify the
      problem by contacting us and letting us know.
    </div>
  );
  if (launchError === 'Desktop Not Prepared') {
    body = (
      <div>
        <strong>{desktopName}</strong> has not yet been fully configured.  If
        you would like to use this desktop please contact the system
        administrator for {' '}<em>{clusterName}</em> and ask them to prepare
        this desktop.
      </div>
    );
  }

  return {
    body,
    icon: 'danger',
    header: 'Failed to launch desktop',
  };
}

export default DesktopCard;
