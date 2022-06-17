import React from 'react';
import { useParams } from 'react-router-dom';

function JobLink({session, children}) {
  const jobUrl = `${process.env.REACT_APP_JOBS_CLIENT_BASE_URL}/jobs/${session?.job_id}`;
  return (
    <a
      class="text-light"
      href={jobUrl}
      title="Visit Flight Job overview for this session"
    >
      {children}
      <i class="fa fa-external-link mx-1"/>
    </a>
  )
}

function HeaderText({session}) {
  const { id } = useParams();
  const sessionId = id.split('-')[0];
  const idText = (session == null || session.name) ?
    sessionId :
    <JobLink session={session}>{sessionId}</JobLink>;
  const sessionName = (session?.job_id) ?
    <JobLink session={session}>{session?.name}</JobLink> :
    session?.name;
  
  const hostname = session == null ?
    null :
    <span> running on <code className="text-reset">{session.hostname}</code></span>;
  const title = ( session == null || session.name == null || session.name === "") ?
    <span>{idText} {hostname}</span> :
    <span>{sessionName} ({idText}) {hostname}</span>;

  return (title)
}

export default HeaderText;
