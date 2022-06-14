import React from 'react';
import classNames from 'classnames';

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
          />
        </div>
      </CardFooter>
    </div>
  );
}

export default DesktopCard;
