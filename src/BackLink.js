import React from "react";
import {Link} from "react-router-dom";

function BackLink() {
  return (
    <Link
      to="/"
      relative="path"
      className="link back-link blue-text"
    >
      Back to desktops
    </Link>
  );
}

export default BackLink;
