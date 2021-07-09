import React from 'react';

import {
  Overlay,
  OverlayContainer,
  Spinner,
  UnauthorizedError,
  DefaultErrorMessage,
  utils,
} from 'flight-webapp-components';

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
        <dl>
          <dt
            className="text-truncate"
            title="Desktop"
          >
            Desktop
          </dt>
          <dd
            className="text-truncate"
            title={configs.desktop}
          >
            {configs.desktop}
          </dd>
        </dl>
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
