import React, { useState } from 'react';

import { Button, Form, FormGroup, Col, Label, Input } from 'reactstrap';

import {
  Overlay,
  Spinner,
  UnauthorizedError,
  DefaultErrorMessage,
  utils,
} from 'flight-webapp-components';

import { useFetchUserConfig, useFetchDesktops, useUpdateUserConfig } from './api';
import { useToast } from './ToastContext';

function ConfigsPage() {
  const config_req = useFetchUserConfig();
  const desktop_req = useFetchDesktops();

  if (config_req.error || desktop_req.error) {
    const req = (config_req.error ? config_req : desktop_req)
    if (utils.errorCode(req.data) === 'Unauthorized') {
      return <UnauthorizedError />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    if (config_req.loading || desktop_req.loading) {
      return <Loading />;
    } else {
      return <Layout configs={config_req.data} desktops={desktop_req.data.data} />
    }
  }
}

function Layout({ configs, desktops }) {
  // Determine the current settings
  const [x, y] = configs.geometry.split("x");
  const d = desktops.map(d => { return d.id }).includes(configs.desktop) ? configs.desktop : null;

  // Create the state references
  const [desktop, setDesktop] = useState(d);
  const [xGeometry, setXGeometry] = useState(x);
  const [yGeometry, setYGeometry] = useState(y);
  const [modified, setModified] = useState(false);

  // Create the updater
  const updater = function(setter, field) {
    if (! modified) { setModified(true) }
    setter(field.target.value);
  }

  if (configs == null) {
    console.log("The 'configs' where null")
    return <DefaultErrorMessage />;
  }

  return (
    <div className="card" >
      <h4
        className="card-header text-truncate justify-content-between d-flex align-items-end"
        title={"User Configuration"}
      >
        <span>
          User Configuration
        </span>
      </h4>
      <div className="card-body container">
        <Form>
          <FormGroup row>
            <Label for="desktop" sm={2} size="lg">Desktop</Label>
            <Col>
              <Input  type="select" name="desktop" id="desktop" required
                      value={desktop} onChange={e => updater(setDesktop, e)}>
                {desktops.map(desktop => {
                  var element = null;
                  if (desktop.verified) {
                    element = <option key={desktop.id}>{desktop.id}</option>
                  }
                  return element;
                })}
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} size="lg">Geometry</Label>
            <Col>
              <Input  type="number" name="geometry-x" id="geometry-x" required
                      placeholder="X Geometry" value={xGeometry} onChange={e => updater(setXGeometry, e)}
              />
            </Col>
            <span sm="auto" size="lg" className="align-middle">X</span>
            <Col>
              <Input  type="number" name="geometry-y" id="geometry-y" required
                      placeholder="Y Geometry" value={yGeometry} onChange={e => updater(setYGeometry, e)}
              />
            </Col>
          </FormGroup>
          <FormGroup check>
            <UpdateButton
              desktop={desktop}
              geometry={`${xGeometry}x${yGeometry}`}
              modified={modified}
              setModified={setModified}
            />
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}

function UpdateButton({desktop, geometry, modified, setModified}) {
  const { addToast } = useToast();
  const { request, patch } = useUpdateUserConfig();
  const submit = async() => {
    // Create the submitter
    const data = await patch(desktop, geometry);
    if (request.response.ok) {
      if ( desktop === data.desktop && geometry === data.geometry) {
        // Update successful
        setModified(false);
        addToast(updateSuccessfulToast());
      } else {
        // The API response does not match the expected values
        addToast(updateFailedToast({ errorCode: "did-not-update" }));
      }
    } else {
      console.log("Failed to update configuration");
      addToast(updateFailedToast({ errorCode: utils.errorCode(data) }));
    }
  }

  return <Button color="success" className="pull-right" disabled={!modified} onClick={submit}>
    Update Configuration
  </Button>
}

function updateSuccessfulToast() {
  let body = (
    <div>
      Your configurations have been updated!
    </div>
  );

  return {
    body,
    icon: 'success',
    header: 'Updated your configurations',
  };
}

function updateFailedToast({ errorCode }) {
  let body = (
    <div>
      Unfortunately there has been a problem updating your configurations.
      Please try again and, if problems persist, help us to more quickly
      rectify the problem by contacting us and letting us know.
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Failed to update configurations',
  };
}

function Loading() {
  return (
    <Overlay>
      <Spinner text="Loading config..." />
    </Overlay>
  );
}

export default ConfigsPage;
