import React, { useState, useContext } from 'react';

import { signIn } from './api';
import { Context as CurrentUserContext } from './CurrentUserContext';
import { SessionsContext } from './SessionsContext';

const useForm = (callback) => {
  const [inputs, setInputs] = useState({});
  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    callback(inputs);
  }
  function handleInputChange(event) {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }
  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
}


function SignInForm() {
  const { actions: userActions } = useContext(CurrentUserContext);
  const { actions: sessionActions } = useContext(SessionsContext);
  const { handleSubmit, handleInputChange, inputs } = useForm(
    signIn(userActions, sessionActions)
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <input
          className="form-control"
          id="username"
          name="username"
          onChange={handleInputChange}
          placeholder="Enter username"
          required
          type="text"
          value={inputs.username == null ? "" : inputs.username}
        />
        <input
          className="form-control"
          id="password"
          name="password"
          onChange={handleInputChange}
          placeholder="Enter password"
          required
          type="password"
          value={inputs.password == null ? "" : inputs.password}
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            type="submit"
            id="go">
            Go!
          </button>
        </div>
      </div>
    </form>
  );
}

export default SignInForm;
