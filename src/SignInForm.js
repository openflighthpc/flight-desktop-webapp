import React, { useMemo, useState } from 'react';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';

import Portal from './Portal';
import { useSignIn } from './api';

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
  const { error, loading, startSignIn } = useSignIn();
  const [ showToast, setShowToast ] = useState(false);
  const { handleSubmit, handleInputChange, inputs } = useForm(startSignIn);

  useMemo(() => {
    setShowToast(!loading && !!error);
  }, [ error, loading ]);

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
            disabled={loading}
            id="go"
            style={{ minWidth: '52px' }}
            type="submit"
          >
            {
              loading ?
                <i className="fa fa-spinner fa-spin mr-1"></i> :
                'Go!'
            }
          </button>
        </div>
      </div>
      {
        showToast ? (
          <LoginErrorToast
            showToast={showToast}
            toggle={() => setShowToast(s => !s)}
          />
        ) : null
      }
    </form>
  );
}

function LoginErrorToast({ showToast, toggle }) {
  return (
    <Portal id="toast-portal">
      <Toast isOpen={showToast}>
        <ToastHeader
          icon="danger"
          toggle={toggle}
        >
          Unable to sign in to your account
        </ToastHeader>
        <ToastBody>
          There was a problem authorizing your username and password.  Please
          check that they are entered correctly and try again.
        </ToastBody>
      </Toast>
    </Portal>
  );
}

export default SignInForm;
