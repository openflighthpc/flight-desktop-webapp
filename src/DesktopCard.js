import React from 'react';

import LaunchDesktopButton from './LaunchDesktopButton';
import { prettyDesktopName } from './utils';

function DesktopCard({ desktop }) {
  const desktopName = prettyDesktopName[desktop.id];

  return (
    <LaunchDesktopButton
      className="card link"
      desktop={desktop}
    >
      <div className="card-body">
        <h3 className="card-text mb-4 mt-2">
          {desktopName}
        </h3>
        <p className="card-text tagline">
          {desktop.summary}
        </p>
      </div>
    </LaunchDesktopButton>
  );
}

export default DesktopCard;
