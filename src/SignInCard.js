import React from 'react';
import styled from 'styled-components';

import SignInForm from './SignInForm';

const ClusterName = styled.span`
  font-weight: bold;
  font-style: italic;
`;

function SignInCard({ clusterName }) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5 className="card-title text-center">
          Sign in to <ClusterName>{clusterName}</ClusterName>
        </h5>
        <div className="row">
          <div className="col">
            <p>
              Sign in to your OpenFlightHPC environment account on
              {' '}<ClusterName>{clusterName}</ClusterName>.
              You'll need your account username and password. Enter
              them below and click <i>Go!</i>.
            </p>
            <p>
              Contact your HPC administrator if you don't have these
              details or need a reminder.
            </p>
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInCard;
