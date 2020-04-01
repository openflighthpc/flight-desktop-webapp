import React from 'react';

import placeholderImage from './placeholder.jpg';
import { useFetchScreenshot } from './api';
import { useInterval } from './utils';

function Screenshot({ className, session }) {
  const { get: getScreenshot, image: screenshot } = useFetchScreenshot(session.id);
  useInterval(getScreenshot, 1 * 60 * 1000, { immediate: false });

  return (
    <img
      className={className}
      src={screenshot != null ? screenshot : placeholderImage}
      alt="Session screenshot"
    />
  );
}

export default Screenshot;
