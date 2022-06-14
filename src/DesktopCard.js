import React from 'react';
import classNames from 'classnames';

import {
} from 'flight-webapp-components';

import { CardFooter } from './CardParts';
import LaunchDesktopButton from './LaunchDesktopButton';
import { prettyDesktopName } from './utils';

function DesktopCard({ desktop }) {
  const desktopName = prettyDesktopName[desktop.id];

  return (
    <div
      className={
        classNames('card border-primary mb-2')
      }
    >
      <h5
        className="card-header bg-primary text-light text-truncate"
        title={desktopName}
      >
        {desktopName}
      </h5>
      <div className="card-body">
        <p>
          {desktop.summary}
        </p>
        {
          desktop.homepage == null ? null : (
            <a
              href={desktop.homepage}
              target="_blank"
              rel="noopener noreferrer"
            >
              {desktop.homepage}
            </a>
          )
        }
      </div>
      <CardFooter>
        <div className="btn-toolbar justify-content-center">
          <LaunchDesktopButton
            color="primary"
            size="sm"
            className="mr-2"
            desktop={desktop}
            errorToast={launchErrorToast}
          />
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
