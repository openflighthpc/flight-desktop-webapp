import React from 'react';
import { Link } from "react-router-dom";
import * as d3 from "d3-time-format";

import CleanButton from './CleanSessionButton';
import TerminateButton from './TerminateButton';
import placeholderImage from './placeholder.jpg';
import { CardFooter } from './CardParts';
import { prettyDesktopName, useInterval } from './utils';
import { useFetchScreenshot } from './api';

const timeFormat = d3.timeFormat("%a %e %b %Y %H:%M");

function timestampFormat(timestamp) {
  return timeFormat(new Date(timestamp));
}

function SessionCard({ reload, session }) {
  const { get: getScreenshot, image: screenshot } = useFetchScreenshot(session.id);
  useInterval(getScreenshot, 1 * 60 * 1000, { immediate: false });
  const session_name = session.name || session.id.split('-')[0];

  return (
      <div
        className="card border-primary mb-2"
        data-testid="session-card"
      >
        <h5 className="card-header bg-primary text-light">
          {session_name}
        </h5>
        <div className="card-body">
          <div className="row mb-2">
            <div className="col">
              <Link to={`/sessions/${session.id}`}>
                <img
                  className="card-img"
                  src={screenshot != null ? screenshot : placeholderImage}
                  alt="Session screenshot"
                />
              </Link>
            </div>
          </div>
          <dl className="row">
            <MetadataEntry
              name="Desktop"
              value={prettyDesktopName[session.desktop] || session.desktop}
            />
            <MetadataEntry
              name="State"
              value={session.state}
            />
            <MetadataEntry
              name="Started"
              value={session.created_at}
              format={timestampFormat}
            />
            <MetadataEntry
              name="Last accessed"
              value={session.last_accessed_at}
              format={timestampFormat}
            />
          </dl>
        </div>
        <CardFooter>
          <Buttons
            onCleaned={reload}
            onTerminated={reload}
            session={session} 
          />
        </CardFooter>
      </div>
  );
}

function MetadataEntry({ name, value, format }) {
  if (value == null) {
    return null;
  }
  const formatted = typeof format === "function" ? format(value) : value;
  return (
    <React.Fragment>
      <dt
        className="col-sm-4 text-truncate"
        title={name}
      >
        {name}
      </dt>
      <dd
        className="col-sm-8 text-truncate"
        title={formatted}
      >
        {formatted}
      </dd>
    </React.Fragment>
  );
}

function Buttons({ onCleaned, onTerminated, session }) {
  if (session.state === 'Active') {
    return (
      <div className="btn-toolbar justify-content-center">
        <Link
          className="btn btn-sm btn-primary mr-2"
          to={`/sessions/${session.id}`}
        >
          <i className="fa fa-bolt mr-1"></i>
          <span>Connect</span>
        </Link>
        <TerminateButton
          className="btn-sm"
          onTerminated={onTerminated}
          session={session}
        />
      </div>
    );
  } else {
    return (
      <div className="btn-toolbar justify-content-center">
        <CleanButton
          className="btn-sm"
          onCleaned={onCleaned}
          session={session}
        />
      </div>
    );
  }
}

export default SessionCard;
