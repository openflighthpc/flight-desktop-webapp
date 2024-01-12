import React, {useState} from 'react';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';

import {
  DefaultErrorMessage,
  Overlay,
  Spinner,
  UnauthorizedError,
  utils,
} from 'flight-webapp-components';

import {prettyDesktopName} from './utils';
import {useFetchUserConfig, useFetchDesktops, useUpdateUserConfig} from './api';
import {useToast} from './ToastContext';
import Blurb from "./Blurb";
import BackLink from "./BackLink";

function ConfigsPage() {
  const config_req = useFetchUserConfig();
  const desktop_req = useFetchDesktops();

  if (config_req.error || desktop_req.error) {
    const req = (config_req.error ? config_req : desktop_req)
    if (utils.errorCode(req.data) === 'Unauthorized') {
      return <UnauthorizedError/>;
    } else {
      return <DefaultErrorMessage/>;
    }
  } else {
    if (config_req.loading || desktop_req.loading) {
      return <Loading/>;
    } else {
      return <Layout configs={config_req.data} desktops={desktop_req.data.data}/>
    }
  }
}

function Layout({configs, desktops}) {
  // Determine the current settings
  const [originalStruct, setOriginalStruct] = useState({
    desktop: desktops.map(d => d.id).includes(configs.desktop) ? configs.desktop : desktops[0].id,
    geometry: configs.geometry
  })

  // Create the state references
  const [desktop, setDesktop] = useState(originalStruct.desktop);
  const [geometry, setGeometry] = useState(originalStruct.geometry);

  if (configs == null) {
    return <DefaultErrorMessage/>;
  }

  return (
    <>
      <div
        className="centernav col-8"
      >
        <BackLink/>
        <div className="narrow-container">
          <Blurb/>
        </div>

        <p className="tagline mt-4">Set your default desktop configuration.</p>

        <div className='d-flex flex-column align-items-center'>
          <Form>
            <FormGroup className="form-field mt-4">
              <Label
                className="tagline mb-2"
                for="desktop"
              >
                Desktop type</Label>
              <Input
                id="desktop"
                name="desktop"
                onChange={e => setDesktop(e.target.value)}
                required
                type="select"
                value={desktop}
              >
                <DesktopOptions desktops={desktops} original={originalStruct.desktop}/>
              </Input>
            </FormGroup>
            <FormGroup className="form-field">
              <Label className="tagline mb-2">Resolution</Label>
              <Input
                id="geometry"
                name="geometry"
                onChange={e => {
                  setGeometry(e.target.value)
                }}
                required
                type="select"
                value={geometry}
              >
                <GeometryOptions geometries={configs.geometries} original={originalStruct.geometry}/>
              </Input>
            </FormGroup>
            <FormGroup check>
              <UpdateButton
                className="button link white-text"
                desktop={desktop}
                geometry={geometry}
                originalStruct={originalStruct}
                setOriginalStruct={setOriginalStruct}
              />
            </FormGroup>
          </Form>
        </div>
      </div>
    </>
  );
}

function DesktopOptions({desktops, original}) {
  return desktops.map(desktop => {
    let label = prettyDesktopName[desktop.id];
    if (original === desktop.id) {
      label = `${label} (default)`
    }
    if (!desktop.verified) {
      label = `${label} - (Unverified)`
    }
    return (
      <option
        disabled={!desktop.verified}
        key={desktop.id}
        label={label}
        value={desktop.id}
      />
    );
  });
}

function GeometryOptions({geometries, original}) {
  return geometries.map(geometry => {
    const label = original === geometry ? `${original} (default)` : geometry
    return (
      <option
        key={geometry}
        label={label}
        value={geometry}
      />
    );
  });
}

function UpdateButton({desktop, geometry, originalStruct, setOriginalStruct}) {
  const {addToast} = useToast();
  const {request, patch} = useUpdateUserConfig();
  const submit = async () => {
    // Create the submitter
    const data = await patch(desktop, geometry);
    if (request.response.ok) {
      if (desktop === data.desktop && geometry === data.geometry) {
        // Update successful
        setOriginalStruct({
          desktop: data.desktop,
          geometry: data.geometry
        });
        addToast(updateSuccessfulToast());
      } else {
        // The API response does not match the expected values
        addToast(updateFailedToast({errorCode: "did-not-update"}));
      }
    } else {
      console.log("Failed to update your configuration");
      addToast(updateFailedToast({errorCode: utils.errorCode(data)}));
    }
  }
  const isOriginal = (desktop === originalStruct.desktop) && (geometry === originalStruct.geometry);

  return (
    <Button
      className="button link white-text mt-5 pull-right submit-button"
      disabled={request.loading || isOriginal}
      onClick={submit}
    >
      {request.loading ? <i className="fa fa-spinner fa-spin mr-1"/> : null}
      <span>{request.loading ? "UPDATING..." : "UPDATE"}</span>
    </Button>
  );
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

function updateFailedToast({errorCode}) {
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
    header: 'Failed to update your configuration',
  };
}

function Loading() {
  return (
    <Overlay>
      <Spinner text="Loading config..."/>
    </Overlay>
  );
}

export default ConfigsPage;
