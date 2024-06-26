import React from 'react';
import Logo from './assets/desktop.png';

function Blurb() {
  return (
    <>
      <div
        className="app-card blurb"
      >
        <img
          className="app-icon mr-3"
          alt=""
          src={Logo}
        />
        <h2 className="card-title card-text">
          flight<strong>Desktop</strong>
        </h2>
        <p className="tagline card-subtitle card-text">
          Access interactive desktop sessions.
        </p>
      </div>
    </>
  );
}

export default Blurb;
