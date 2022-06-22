import React, { useState } from 'react';
import {
  Button,
  ButtonToolbar,
  Popover,
  PopoverBody,
  PopoverHeader,
  Input
} from 'reactstrap';

import {
  utils,
} from 'flight-webapp-components';

import { useResizeSession } from './api';

import { prettyDesktopName } from './utils';
import { useToast } from './ToastContext';

function ResizeButton({
  className,
  session,
  onResized=()=>{},
}) {
  const [geometry, setGeometry] = useState(session.geometry);
  const id = `resize-session-${session.id}`;
  const { addToast } = useToast();

  const geometries = session.available_geometries;

  const { loading: resizing, request, post } = useResizeSession(session.id);
  const resizeSession = async () => {
    try {
      const newGeometry = geometry;
      post(newGeometry).then((responseBody) => {
        if (request.response.ok) {
          onResized(newGeometry);
        } else {
          addToast(resizeFailedToast({
            session: session,
            errorCode: utils.errorCode(responseBody)
          }));
        }
      });
    } catch (e) {
      addToast(resizeFailedToast({
        session: session,
        errorCode: undefined,
      }));
    }
  }
  const [ showConfirmation, setShowConfirmation] = useState(false);
  const toggle= () => setShowConfirmation(!showConfirmation);

  const handleSubmit = e => {
    resizeSession();
    toggle();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <React.Fragment>
      <Button
      className={`${className} ${resizing ? 'disabled ' : null}` }
      disabled={resizing}
      id={id}
      >
        {
          resizing ?
            <i className="fa fa-spinner fa-spin mr-1"></i> :
            <i className="fa fa-crop mr-1"></i>
        }
        <span>{ resizing ? 'Resizing...' : 'Resize' }</span>
      </Button>
      <Popover
        isOpen={showConfirmation}
        target={id}
        toggle={toggle}
      >
        <PopoverHeader>
          Resize session
        </PopoverHeader>
        <PopoverBody>
          <p>
            <label for="session-size">
              Enter new size:
            </label>
            <Input
              id="session-geometry"
              name="session-geometry"
              className="w-100"
              type="select"
              onChange={(e) => setGeometry(e.target.value)}
              value={geometry}
            >
              <GeometryOptions geometries={geometries} current={session.geometry} />
            </Input>
          </p>
          <ButtonToolbar className="justify-content-center">
            <Button
              className="mr-2"
              onClick={toggle}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className="mr-2"
              onClick={handleSubmit}
              size="sm"
              disabled={geometry === session.geometry}
            >
              <i className="fa fa-crop mr-1"></i>
              Resize
            </Button>
          </ButtonToolbar>
        </PopoverBody>
      </Popover>
    </React.Fragment>
  );
}

function GeometryOptions({geometries, current}) {
  return geometries.map(geometry => {
    return (
      <option
        key={geometry.key}
        label={`${geometry}${current === geometry ? ' (current)' : ''}`}
        value={geometry}
      />
    );
  });
}

function resizeFailedToast({session, errorCode}) {
  const desktopName = prettyDesktopName[session.desktop];
  const sessionName = session.name || session.id.split('-')[0];

  let body = (
    <div>
      Unfortunately there has been a problem resizing your
      {' '}<strong>{desktopName}</strong> desktop session
      {' '}<strong>{sessionName}</strong>.  Please try again and, if problems
      persist, help us to more quickly rectify the problem by contacting us
      and letting us know.
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Failed to resize session',
  };
}

export default ResizeButton;
