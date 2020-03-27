import React from 'react';

function Overlay({ children }) {
  return (
    <div
      className="position-absolute"
      style={{
        fontSize: 'x-large',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="text-light px-3 rounded"
        style={{ background: 'rgba(108, 117, 125, 0.75)' }}
      >
        {children}
      </div>
    </div>
  );
}

export default Overlay;
