import React from 'react';
import { Link } from "react-router-dom";

import placeholderImage from './placeholder.jpg';
import { useFetchScreenshot } from './api';
import { useInterval } from './utils';

function Screenshot({ session }) {
  const { get: getScreenshot, image: screenshot } = useFetchScreenshot(session.id);
  useInterval(getScreenshot, 1 * 60 * 1000, { immediate: false });

  const img = (
    <img
      className="card-img"
      src={screenshot != null ? screenshot : placeholderImage}
      alt="Session screenshot"
    />
  );

  if (session.state === 'Active') {
    return <Link to={`/sessions/${session.id}`}>{img}</Link>;
  } else {
    return img;
  }
}

export default Screenshot;
