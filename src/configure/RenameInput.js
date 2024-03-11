import React from 'react';
import {FormGroup, Input, Label} from "reactstrap";

function RenameInput({
  autoFocus=false,
  current,
  handleChange,
  session,
}) {


  return (
    <FormGroup className="form-field mt-2">
      <Label className="text-center">
        Rename desktop (leave blank to remove the name).
      </Label>
      <Input
        autoFocus={autoFocus}
        className="w-100"
        defaultValue={current}
        id="session-name"
        name="session-name"
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Session name"
        type="text"
      />
    </FormGroup>
  )
}

export default RenameInput;
