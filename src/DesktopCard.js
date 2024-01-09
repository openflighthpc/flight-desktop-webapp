import React from 'react';
import classNames from 'classnames';

import LaunchDesktopButton from './LaunchDesktopButton';
import { prettyDesktopName } from './utils';

function DesktopCard({ desktop, loading, selected, onClick }) {
  const desktopName = prettyDesktopName[desktop.id];

  return (
    <LaunchDesktopButton
      className={classNames("card link", { "selected": selected })}
      desktop={desktop}
      loading={loading}
    >
      <div className="card-body" onClick={onClick} tabIndex={0}>
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
