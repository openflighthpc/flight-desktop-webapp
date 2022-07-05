import React from 'react';

function RenameInput({
  autoFocus=false,
  current,
  handleChange,
  session,
}) {


  return (
    <p>
      <label for="session-name">
        Enter new name (leave blank to remove the name).
      </label>
      <input
        autoFocus={autoFocus}
        className="w-100"
        defaultValue={current}
        id="session-name"
        name="session-name"
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Session name"
        type="text"
      />
    </p>
  )
}

export default RenameInput;
