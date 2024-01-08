import {Button, Input} from "reactstrap";
import React from "react";
import {prettyDesktopName} from "./utils";
import {
  Spinner
} from 'flight-webapp-components';

function LaunchDesktopModal({
                              defaultGeometry,
                              desktop,
                              geometry,
                              launch,
                              modal,
                              nameRef,
                              setGeometry,
                              toggle,
                              userConfig,
                            }) {

  // Run launch method and close modal
  const handleSubmit = e => {
    launch();
    toggle();
  };

  // Submit modal on return
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // Modal bottom bar buttons
  const leftButton = (
    <Button
      className="btn-sm"
      color="secondary"
      onClick={toggle}
    >
      Cancel
    </Button>
  );
  const rightButton = (
    <Button
      data-testid="session-launch-button"
      className="btn-sm ml-2"
      onClick={handleSubmit}
    >
      <i className="fa fa-bolt mr-1"></i>
      Launch
    </Button>
  );

  // Config may not have fully loaded yet
  const modalContent =
    userConfig.loading ?
      <Spinner text="Loading config..." /> :
      <React.Fragment>
        <label for="session-name">
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

        <label for="session-geometry">
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
      {leftButton}
      {rightButton}
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