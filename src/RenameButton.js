import React from 'react';
import { Button } from 'reactstrap';

import { 
  utils,
} from 'flight-webapp-components';

import { useRenameSession } from './api';

import { prettyDesktopName } from './utils';
import { useToast } from './ToastContext';

function RenameButton({ className, session }) {
  const { request, post } = useRenameSession(session.id);
  const renameSession = () => {
    post(session.id, "new-name")
  };


  return (
    <Button
      className={className}
      session={session}
      onClick={renameSession}
    >
      <i className="fa fa-pencil-square-o mr-1"></i>
      <span>Rename</span>
    </Button>
  )
}

export default RenameButton;
