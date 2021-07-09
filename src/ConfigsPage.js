import React, { useState } from 'react';
import classNames from 'classnames';

import { Button, Form, FormGroup, Col, Label, Input, FormText } from 'reactstrap';

import {
  Overlay,
  OverlayContainer,
  Spinner,
  UnauthorizedError,
  DefaultErrorMessage,
  utils,
} from 'flight-webapp-components';

import styles from './SessionsPage.module.css';
import { useFetchUserConfig } from './api';
import { useInterval } from './utils';

function ConfigsPage() {
  const { data, error, loading, get } = useFetchUserConfig();
  useInterval(get, 1 * 60 * 1000);

  if (error) {
    if (utils.errorCode(data) === 'Unauthorized') {
      return <UnauthorizedError />;
    } else {
      return <DefaultErrorMessage />;
    }
  } else {
    if (loading) {
      return <Loading />;
    } else {
      return <Layout configs={data} loading={loading} />
    }
  }
}

function Layout({ configs }) {
  const [x, y] = configs.geometry.split("x");
  const [xGeometry, setXGeometry] = useState(x);
  const [yGeometry, setYGeometry] = useState(y);

  if (configs == null) {
    console.log("The 'configs' where null")
    return <DefaultErrorMessage />;
  }

  return (
    <div
      className="card"
    >
      <h4
        className="card-header text-truncate justify-content-between d-flex align-items-end"
        title={"User Configuration"}
      >
        <span>
          User Configuration
        </span>
      </h4>
      <div className="card-body">
        <Form>
          <FormGroup row>
            <Label for="desktop" sm={2} size="lg">Desktop</Label>
            <Col>
              <Input  type="text" name="desktop" id="desktop"
                      placeholder={configs.desktop} value={configs.desktop} required
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} size="lg">Geometry</Label>
            <Col>
              <Input  type="number" name="geometry-x" id="geometry-x" required
                      placeholder="X Geometry" value={xGeometry} onChange={e => setXGeometry(e.target.value)}
              />
            </Col>
            <span sm="auto" size="lg" className="align-middle">X</span>
            <Col>
              <Input  type="number" name="geometry-y" id="geometry-y" required
                      placeholder="Y Geometry" value={yGeometry} onChange={e => setYGeometry(e.target.value)}
              />
            </Col>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <Overlay>
      <Spinner text="Loading config..." />
    </Overlay>
  );
}

export default ConfigsPage;
