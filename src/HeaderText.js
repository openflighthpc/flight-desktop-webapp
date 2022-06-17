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

  if (session == null) {
    // Session hasn't been loaded yet
    return (<span>{sessionId}</span>);
  }

  const linkedSessionName = <JobLink session={session}>{session?.name}</JobLink>;
  const linkedId = <JobLink session={session}>{sessionId}</JobLink>;

  const hostname = session == null ?
    null :
    <span> running on <code className="text-reset">{session.hostname}</code></span>;

  if (session.name && session.job_id) {
    // Session has name and job ID
    return (<span>{linkedSessionName} ({sessionId}) {hostname}</span>);

  } else if (session.name && !session.job_id) {
    // Session has name but no job ID
    return (<span>{session.name} ({sessionId}) {hostname}</span>);

  } else if (!session.name && session.job_id) {
    // Session has no name, but a job ID
    return (<span>{linkedId} {hostname}</span>);

  } else if (!session.name && !session.job_id) {
    // Session has neither a name nor a job ID
    return (<span>{sessionId} {hostname}</span>);
  }
}

export default HeaderText;
