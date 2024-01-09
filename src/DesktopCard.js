import React, {useState} from 'react';
import classNames from 'classnames';
import {prettyDesktopName} from './utils';

function DesktopCard({desktop, loading, selected, onClick}) {
  const desktopName = prettyDesktopName[desktop.id];
  return (
    <div>
      <div
        data-testid="launch-modal-button"
        className={
        classNames("card link card-text", {
          "selected": selected,
          'disabled': loading,
        })}
        onClick={onClick}
      >
        <div className="card-body" tabIndex={0}>
          <h3 className="card-text mb-4 mt-2">
            {desktopName}
          </h3>
          <p className="card-text">
            {desktop.summary}
          </p>
        </div>
        <div className="d-flex align-self-center mb-2">
          {loading && selected ?
            <span className="card-text">
              <i className="fa fa-spinner fa-spin mr-1"></i>
              Launching...
            </span> : null}
        </div>
      </div>
    </div>
  );
}

export default DesktopCard;
