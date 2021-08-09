import React, { useState } from 'react';

import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import {
  Overlay,
  Spinner,
  UnauthorizedError,
  DefaultErrorMessage,
  utils,
} from 'flight-webapp-components';

import { prettyDesktopName } from './utils';

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
  const d = desktops.map(d => d.id).includes(configs.desktop) ? configs.desktop : desktops[0].id;

  // Create the state references
  const [desktop, setDesktop] = useState(d);
  const [geometry, setGeometry] = useState(configs.geometry);
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
          <FormGroup>
            <Label for="desktop">Desktop</Label>
            <Input  type="select" name="desktop" id="desktop" required
                    value={desktop} onChange={e => updater(setDesktop, e)}>
              <DesktopOptions desktops={desktops} selected={desktop} />
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Geometry</Label>
            <Input  type="select" name="geometry" id="geometry" required
                    value={geometry} onChange={e => updater(setGeometry, e)}>
              <GeometryOptions geometries={configs.geometries} selected={geometry} />
            </Input>
          </FormGroup>
          <FormGroup check>
            <UpdateButton
              desktop={desktop}
              geometry={geometry}
              modified={modified}
              setModified={setModified}
            />
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}

function DesktopOptions({desktops, selected}) {
  return desktops.map(desktop => {
    var element = null;
    if (desktop.verified) {
      element = <option value={desktop.id} label={prettyDesktopName[desktop.id]} selected={selected === desktop.id}/>
    }
    return element;
  });
}

function GeometryOptions({geometries, selected}) {
  return geometries.map(geometry => {
    return <option value={geometry} label={geometry} selected={selected === geometry}/>
  });
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

  return <Button color="success" className="pull-right" disabled={request.loading || !modified} onClick={submit}>
    { request.loading ? <i className="fa fa-spinner fa-spin mr-1"/> : null }
    <span>{request.loading ? "Updating Configuration..." : "Update Configuration"}</span>
  </Button>
}

function updateSuccessfulToast() {
  let body = (
    <div>
      Your configuration has been updated.
    </div>
  );

  return {
    body,
    icon: 'success',
    header: 'Updated your configuration',
  };
}

function updateFailedToast({ errorCode }) {
  let body = (
    <div>
      Unfortunately there has been a problem updating your configuration.
      Please try again and, if problems persist, help us to more quickly
      rectify the problem by contacting us and letting us know.
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Failed to update configuration',
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
