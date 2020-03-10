import React from 'react';

import Logo from './png_trans_logo.png';

function UnauthenticatedDashboard() {
  return (
    <div>
        <img
          src={Logo}
          alt="OpenflightHPC Logo"
          className="center"
          width="100%"
        >
        </img>
        <p>
          XXX Add an explanation of what Flight Console and Flight Console
          Client are.
        </p>
        <p>
          XXX Which cluster is this connected to?
        </p>
        <p>
          XXX Sign in box required here.
        </p>
    </div>
  );
}


export default UnauthenticatedDashboard;
