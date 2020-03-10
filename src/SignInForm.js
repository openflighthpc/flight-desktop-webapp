import React from 'react';

function SignInForm() {
  return (
    <form id="signinForm">
      <div className="input-group mb-3">
        <input
          type="text"
          name="username"
          className="form-control"
          id="username"
          placeholder="Enter username"
        />
        <input
          type="text"
          name="password"
          className="form-control"
          id="password"
          placeholder="Enter password"
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
