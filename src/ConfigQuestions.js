import {Input} from "reactstrap";
import React from "react";
import {
  Spinner
} from 'flight-webapp-components';

function ConfigQuestions({
                           defaultGeometry,
                           geometry,
                           launch,
                           nameRef,
                           setGeometry,
                           userConfig,
                         }) {

  // Launch desktop by pressing return
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      launch();
    }
  };

  // Config may not have fully loaded yet
  const configQuestions =
    userConfig.loading ?
      <div className="mt-5">
        <Spinner text="Loading configuration questions..."/>
      </div>
      :
      <div className='d-flex flex-column align-items-center'>
        <div className='form-field'>
          <label className='tagline'>
            Name your desktop session (optional).
          </label>
          <input
            id="session-name"
            className="w-100"
            name="session-name"
            placeholder="Session name"
            type="text"
            ref={nameRef}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className='form-field'>
          <label className='tagline'>
            Select your desktop resolution (optional).
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
            <GeometryOptions geometries={userConfig.geometries} defaultGeometry={defaultGeometry}/>
          </Input>
        </div>
      </div>;

  return (
    <>
      {configQuestions}
    </>
  );
}

function GeometryOptions({geometries, defaultGeometry}) {
  if (!geometries) {
    return null
  }
  return geometries.map(geometry => {
    const isDefault = defaultGeometry === geometry;
    return (
      <option
        key={geometry.key}
        label={`${geometry}${isDefault ? ' (default)' : ''}`}
        value={geometry}
      />
    );
  });
}

export default ConfigQuestions
