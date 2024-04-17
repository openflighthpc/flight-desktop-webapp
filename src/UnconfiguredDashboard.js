import React from 'react';

import Blurb from "./Blurb";
import {Footer} from "flight-webapp-components";

function UnconfiguredDashboard() {
  return (
    <>
      <div
        className="centernav col-8"
      >
        <div className='narrow-container'>
          <Blurb />
          <p>
            To gain access to your HPC environment, Flight Desktop needs to be
            configured by your system administrator.  It can be configured by running:
          </p>
          <p>
            <code>
              flight service configure desktop-webapp
            </code>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}


export default UnconfiguredDashboard;
