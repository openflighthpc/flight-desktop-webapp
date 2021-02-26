import React from 'react';

import { DashboardLogo } from 'flight-webapp-components';

import ClusterOverview from './ClusterOverview';

function UnauthenticatedDashboard() {
  return (
    <div>
      <DashboardLogo />
      <p>
        The Flight Desktop Access Service allows you to access interactive
        GUI (graphical user interface) desktop sessions running on your
        cluster from the comfort of your browser.
        Powered by the Flight Desktop tool, part of the OpenFlightHPC user
        suite, this app allows you to launch, manage and connect to GUI
        desktop sessions that operate within your OpenFlightHPC environment.
      </p>

      <p>
        To start interacting with desktop sessions and gain access to your
        HPC environment sign in above.
      </p>

      <div className="card-deck">
        <ClusterOverview />
      </div>
    </div>
  );
}


export default UnauthenticatedDashboard;
