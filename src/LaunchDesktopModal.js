import {Button, Input} from "reactstrap";
import React from "react";
import {
  Spinner
} from 'flight-webapp-components';

function LaunchDesktopModal({
                              defaultGeometry,
                              geometry,
                              launch,
                              nameRef,
                              setGeometry,
                              userConfig,
                            }) {

  // Run launch method
  const handleSubmit = e => {
    launch();
  };

  // Submit modal on return
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // Launch button
  const launchButton = (
    <a
      href={'#'}
      data-testid="session-launch-button"
      className="button link"
      onClick={handleSubmit}
    >
      LAUNCH
    </a>
  );

  // Config may not have fully loaded yet
  const modalContent =
    userConfig.loading ?
      <Spinner text="Loading config..." /> :
      <React.Fragment>
        <label>
          Give your session a name to more easily identify it (optional).
        </label>
        <input
          id="session-name"
          className="w-100 mb-2"
          name="session-name"
          placeholder="Session name"
          type="text"
          ref={nameRef}
          onKeyDown={handleKeyDown}
          autoFocus={true}
        />

        <label>
          Specify the geometry for the desktop session (optional).
        </label>
        <Input
          id="session-geometry"
          name="session-geometry"
          onChange={(e) => setGeometry(e.target.value)}
          type="select"
          className="w-100"
          value={geometry}
          defaultValue={defaultGeometry}
        >
          <GeometryOptions geometries={userConfig.geometries} defaultGeometry={defaultGeometry} />
        </Input>
      </React.Fragment>;

  return (
    <>
      {modalContent}
      {launchButton}
    </>
  );
}

function GeometryOptions({geometries, defaultGeometry}) {
  if (!geometries) { return null }
  return geometries.map(geometry => {
    const isDefault = defaultGeometry === geometry;
    return (
      <option
        key={geometry.key}
        label={`${geometry}${isDefault ? ' (default)'  : ''}`}
        value={geometry}
      />
    );
  });
}

export default LaunchDesktopModal