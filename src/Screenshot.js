import React from 'react';

import placeholderImage from './placeholder.jpg';
import { useFetchScreenshot } from './api';
import { useInterval } from './utils';

function Screenshot({ className, session }) {
  const { get: getScreenshot, image: latestScreenshot } = useFetchScreenshot(session.id);
  useInterval(getScreenshot, 1 * 60 * 1000, { immediate: false });

  let currentScreenshot;
  if (latestScreenshot != null) {
    currentScreenshot = latestScreenshot;
  } else if (session.screenshot != null) {
    currentScreenshot = `data:image/png;base64,${session.screenshot}`;
  } else {
    currentScreenshot = placeholderImage;
  }

  return (
    <img
      className={className}
      src={currentScreenshot}
      alt="Session screenshot"
    />
  );
}

export default Screenshot;
