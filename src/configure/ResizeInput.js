import React from 'react';
import {
  utils,
} from 'flight-webapp-components';

import { Input } from 'reactstrap';

function ResizeInput({
  current,
  handleChange,
  session,
}) {
  const geometries = session.available_geometries;

  return (
    <p>
      <label for="session-geometry">
        Enter new size:
      </label>
      <Input
        className="w-100"
        id="session-geometry"
        name="session-geometry"
        onChange={(e) => handleChange(e.target.value)}
        type="select"
        value={current}
      >
        <GeometryOptions geometries={geometries} current={session.geometry} />
      </Input>
    </p>
  )
}

function GeometryOptions({geometries, current}) {
  return geometries.map((geometry) => {
    const label = `${geometry}${current === geometry ? ' (current)' : ''}`;
    return (
      <option
        key={geometry}
        label={label}
        value={geometry}
      />
    );
  });
}

export default ResizeInput;
