import React from 'react';

import { CardFooter } from './CardParts';
import { useLaunchSession } from './api';

function DesktopCard({ desktop }) {
  const launchSession = useLaunchSession(desktop);

  return (
    <div className="col-sm-6 col-lg-4">
      <div className="card border-primary mb-2">
        <h5 className="card-header bg-primary text-light">
          {desktop.name}
        </h5>
        <div className="card-body">
          <div className="row mb-2">
            <div className="col">
              {desktop.description}
            </div>
          </div>
        </div>
        <CardFooter>
          <div className="btn-toolbar justify-content-center">
            <button
              className="btn btn-primary mr-2"
              onClick={() => {
                launchSession.post();
              }}
            >
              <i className="fa fa-bolt mr-1"></i>
              <span>Launch</span>
            </button>
          </div>
        </CardFooter>
      </div>
    </div>
  );
}

export default DesktopCard;
