import React, { useContext } from 'react';
import { Redirect, Route } from "react-router-dom";

import { Context as CurrentUserContext } from './CurrentUserContext';

function AuthenticatedRoute({ children, ...rest }) {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUser != null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


export default AuthenticatedRoute;
