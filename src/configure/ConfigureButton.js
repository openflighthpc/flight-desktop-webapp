import React, { useState, useRef } from 'react';
import {
  Button,
  ButtonToolbar,
  Popover,
  PopoverBody,
  PopoverHeader
} from 'reactstrap';

import { 
  utils
} from 'flight-webapp-components';

import { RenameInput } from './RenameInput';
import { ResizeInput } from './ResizeInput';

function ConfigureButton({
  className,
  session,
}) {
  const id = `configure-session-${session.id}`;
  const [ showConfirmation, setShowConfirmation] = useState(false);
  const toggle = () => setShowConfirmation(!showConfirmation);

  const handleSubmit = e => {
    e.preventDefault();
    toggle();
  };

  return (
    <React.Fragment>
      <Button
        className={className}
        id={id}
      >
        <i class="fa fa-cog mr-1"></i>
        Configure
      </Button>
      <Popover
        isOpen={showConfirmation}
        target={id}
        toggle={toggle}
      >
        <PopoverHeader>
          Configure session
        </PopoverHeader>
        <PopoverBody>
          <form onSubmit={handleSubmit}>
            <ButtonToolbar className="justify-content-center">
              <Button
                className="mr-2"
                onClick={toggle}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                className="mr-2"
                color="primary"
                size="sm"
                type="submit"
              >
                <i className="fa fa-pencil-square mr-1"></i>
                Submit
              </Button>
            </ButtonToolbar>
          </form>
        </PopoverBody>
      </Popover>
    </React.Fragment>
  )
}

export default ConfigureButton;
