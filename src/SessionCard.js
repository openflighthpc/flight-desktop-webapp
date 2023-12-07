import * as d3 from "d3-time-format";
import React from 'react';
import classNames from 'classnames';
import { Link } from "react-router-dom";

import CleanButton from './CleanSessionButton';
import WrappedScreenshot from './Screenshot';
import TerminateButton from './TerminateButton';
import { CardFooter } from './CardParts';
import { prettyDesktopName } from './utils';

const timeFormat = d3.timeFormat("%a %e %b %Y %H:%M");
const activeStates = ['Active', 'Remote'];

function timestampFormat(timestamp) {
  return timeFormat(new Date(timestamp));
}

function SessionCard({ reload, session }) {
  const sessionId = session.id.split('-')[0];
  const title = session.name == null ?
    sessionId :
    `${session.name} (${sessionId})`;
  let sessionState;
  if (session.state === 'Remote') {
    sessionState = 'Active';
  } else {
    sessionState = session.state;
  }
  const jobUrl = `${process.env.REACT_APP_JOBS_CLIENT_BASE_URL}/jobs/${session.job_id}`;
  const jobIdEntry = session.job_id ?
    <MetadataEntry
      name={<span><i class="fa fa-file-code-o mr-1" />Job</span>}
      title="This session was started by Flight Job.  Click to view the related job."
      value={session.job_id}
      valueTitle="This session was started by Flight Job.  Click to view the related job."
      format={id => <a href={jobUrl}>{id}</a> }
    /> :
    null;

  return (
      <div
        className={classNames('card text-left pb-2', {
          [`session--${session.state.toLowerCase()}`]: true,
        })}
        data-testid="session-card"
      >
        <div className="row col justify-content-between mb-2 mt-3">
          <h5
            className="card-text text-start"
          >
            {title}
          </h5>
          <DropdownMenu
            onCleaned={reload}
            onTerminated={reload}
            session={session}
          />
        </div>
        <div className={
          classNames("card-text", { 'text-muted': !activeStates.includes(session.state) })
        }>
          <div className="row mb-2">
            <div className="col">
              <Screenshot session={session} />
            </div>
          </div>
          <dl className="row">
            <MetadataEntry
              name="Desktop"
              value={
                prettyDesktopName[session.desktop] || session.desktop || <em>Unknown</em>
              }
              valueTitle={
                prettyDesktopName[session.desktop] || session.desktop || 'Unknown'
              }
            />
            <MetadataEntry
              name="Name"
              value={session.name || 'N/A'}
            />
            <MetadataEntry
              name="State"
              value={sessionState}
              valueTitle={
                activeStates.includes(session.state) ?
                  'This session is active.  You can connect to it to gain access.' :
                  'This session is no longer available.  To remove it from ' +
                  'this list, click the "Clean" button below.'
              }
            />
            <MetadataEntry
              name="Host"
              value={session.hostname}
              valueTitle="The machine this session is running on"
              format={host => <code className="card-text">{host}</code>}
            />
            <MetadataEntry
              name="Started"
              value={session.created_at}
              format={timestampFormat}
            />
            <MetadataEntry
              name="Accessed"
              value={session.last_accessed_at}
              format={timestampFormat}
            />
            { jobIdEntry }
          </dl>
        </div>
      </div>
  );
}

function DropdownMenu({ onCleaned, onTerminated, session }) {
  return (
    <div className="dropdown">
      <a className="card-text dropdown-toggle" id="dropdownMenuButton"
         data-toggle="dropdown"
         aria-haspopup="true" aria-expanded="false">
        <i className="fa-solid fa-ellipsis-vertical pl-2"></i>
      </a>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <DropdownItems
          onCleaned={onCleaned}
          onTerminated={onTerminated}
          session={session}
        />
      </div>
    </div>
  );
}

function DropdownItems({ onCleaned, onTerminated, session }) {
  if (activeStates.includes(session.state)) {
    return (
      <>
        <Link
          className="dropdown-item"
          to={`/sessions/${session.id}`}
        >
          Connect
        </Link>
        <TerminateButton
          className="dropdown-item"
          onTerminated={onTerminated}
          session={session}
        />
      </>
    );
  } else {
    return (
      <CleanButton
        className="dropdown-item"
        onCleaned={onCleaned}
        session={session}
      />
    );
  }
}

function MetadataEntry({ name, title, value, format, valueTitle }) {
  if (value == null) {
    return null;
  }
  const formatted = typeof format === "function" ? format(value) : value;
  return (
    <React.Fragment>
      <dt
        className="col-sm-4 text-truncate"
        title={title || name}
      >
        {name}
      </dt>
      <dd
        className="col-sm-8 text-truncate"
        title={valueTitle || formatted}
      >
        {formatted}
      </dd>
    </React.Fragment>
  );
}

function Screenshot({ session }) {
  const screenshot = <WrappedScreenshot className="card-img" session={session} />;
  if (activeStates.includes(session.state)) {
    return <Link to={`/sessions/${session.id}`}>{screenshot}</Link>;
  } else {
    return screenshot;
  }
}

export default SessionCard;
