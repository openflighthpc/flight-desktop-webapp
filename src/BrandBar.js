import React from 'react';
import styled from 'styled-components'
import { Link } from "react-router-dom";

import Logo from './png_trans_logo-navbar.png';

function BrandBar({ className }) {
  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white border-bottom ${className}`}>
      <Link
        className="navbar-brand"
        to="/"
      >
        <img
          src={Logo}
          alt="openflightHPC Logo"
          height="75">
        </img>
      </Link>

      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav mr-auto">
        </ul>
        <div className="my-2 my-lg-0">
          <a href="https://github.com/openflighthpc">
            <span className="fa fa-3x fa-github"></span>
          </a>
        </div>
      </div>

    </nav>
  );
}

export default styled(BrandBar)`
  a:first-child {
    padding-left: 4rem;
  }
  a:last-child {
    padding-right: 4rem;
  }
`;
