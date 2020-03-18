import React from 'react';
import { useHistory } from 'react-router-dom';

import { CardFooter } from './CardParts';
import { useLaunchSession } from './api';
import { errorCode } from './utils';

function DesktopCard({ desktop }) {
  const { loading, post, response } = useLaunchSession(desktop);
  const history = useHistory();
  const redirectToSession = ({ id, errors }) => {
    if (response.ok) {
      history.push(`/sessions/${id}`);
    } else {
      console.log(errorCode({ errors }));
    }
  }

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
              className={`btn btn-primary mr-2 ${loading ? 'disabled' : null}`}
              onClick={() => { post().then(redirectToSession); }}
              disabled={loading}
            >
              {
                loading ?
                  <i className="fa fa-spinner fa-spin mr-1"></i> :
                  <i className="fa fa-bolt mr-1"></i>
              }
              <span>{ loading ? 'Launching...' : 'Launch' }</span>
            </button>
          </div>
        </CardFooter>
      </div>
    </div>
  );
}

export default DesktopCard;
