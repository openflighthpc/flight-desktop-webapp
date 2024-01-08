import React, { useState } from 'react';
import classNames from 'classnames';

function LaunchDesktopButton({
  className,
  children,
  loading,
}) {

  const [selected, setSelected] = useState(false);
  const toggle = () => setSelected(!selected);

  return (
    <div>
      <div
        data-testid="launch-modal-button"
        className={classNames(className, { 'disabled': loading }, 'card-text')}
        onClick={toggle}
      >
        {children}
        <div className="d-flex align-self-center mb-2">
          {loading && selected ?
            <span className="card-text">
              <i className="fa fa-spinner fa-spin mr-1"></i>
              Launching...
            </span> : null}
        </div>
      </div>
    </div>
  )
}

export default LaunchDesktopButton
