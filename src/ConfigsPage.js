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
  const [originalStruct, setOriginalStruct] = useState({
    desktop: desktops.map(d => d.id).includes(configs.desktop) ? configs.desktop : desktops[0].id,
    geometry: configs.geometry
  })

  // Create the state references
  const [desktop, setDesktop] = useState(originalStruct.desktop);
  const [geometry, setGeometry] = useState(originalStruct.geometry);

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
                    value={desktop} onChange={e => setDesktop(e.target.value)}>
              <DesktopOptions desktops={desktops} selected={desktop} original={originalStruct.desktop}/>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Geometry</Label>
            <Input  type="select" name="geometry" id="geometry" required
                    value={geometry} onChange={e => { setGeometry(e.target.value) }}>
              <GeometryOptions geometries={configs.geometries} selected={geometry} original={originalStruct.geometry}/>
            </Input>
          </FormGroup>
          <FormGroup check>
            <UpdateButton
              desktop={desktop}
              geometry={geometry}
              originalStruct={originalStruct}
              setOriginalStruct={setOriginalStruct}
            />
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}

function DesktopOptions({desktops, selected, original}) {
  return desktops.map(desktop => {
    var element = null;
    const is_selected = (selected === desktop.id);
    const pretty  = prettyDesktopName[desktop.id];
    const label = original === desktop.id ? `${pretty} (default)` : pretty
    if (desktop.verified) {
      element = <option value={desktop.id} label={label} selected={is_selected}/>
    }
    return element;
  });
}

function GeometryOptions({geometries, selected, original}) {
  return geometries.map(geometry => {
    const is_selected = (selected === geometry);
    const label = original === geometry ? `${original} (default)` : geometry
    return <option value={geometry} label={label} selected={is_selected}/>
  });
}

function UpdateButton({desktop, geometry, originalStruct, setOriginalStruct}) {
  const { addToast } = useToast();
  const { request, patch } = useUpdateUserConfig();
  const submit = async() => {
    // Create the submitter
    const data = await patch(desktop, geometry);
    if (request.response.ok) {
      if ( desktop === data.desktop && geometry === data.geometry) {
        // Update successful
        setOriginalStruct({
          desktop: data.desktop,
          geometry: data.geometry
        });
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
  const is_original = (desktop === originalStruct.desktop) && (geometry === originalStruct.geometry);

  return <Button color="success" className="pull-right" disabled={request.loading || is_original} onClick={submit}>
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
