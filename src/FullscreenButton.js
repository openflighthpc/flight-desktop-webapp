import React, { useEffect, useState } from 'react';

import useEventListener from './useEventListener';

function FullscreenButton() {
  const [isFullscreen, setFullscreen] = useState(false);

  useEventListener(window, 'keydown', function handleKeypress(e) {
    if (!(e.ctrlKey || e.shiftKey || e.altKey) && e.code === "F11") {
      document.documentElement.requestFullscreen();
      e.preventDefault();
    }
  });

  useEffect(() => {
    document.onfullscreenchange = function ( event ) { 
      if (document.fullscreenElement == null) {
        setFullscreen(false);
      } else {
        setFullscreen(true);
      }
    }; 

    return () => { document.onfullscreenchange = null; };
  }, [setFullscreen]);

  return (
    <button
      className="btn btn-light btn-sm mr-1"
      onClick={() => {
        isFullscreen ?
          document.exitFullscreen() :
          document.documentElement.requestFullscreen() ;
      }}
    >
      <i className={`fa ${isFullscreen ? 'fa-compress' : 'fa-expand'} mr-1`}></i>
      <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
    </button>
  );
}

export default FullscreenButton;
