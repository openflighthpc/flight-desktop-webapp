import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import QuickLaunchButton from './QuickLaunchButton';

function LaunchDropdown({ className }) {
  const [dropdownOpen, setOpen] = React.useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  return <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
    <Link
      className={className}
      to="/sessions/new"
    >
      Launch session
    </Link>

    <DropdownToggle tag={"a"} type="button" split />

    <DropdownMenu right>
      <QuickLaunchButton />
    </DropdownMenu>
  </ButtonDropdown>
}

export default LaunchDropdown;
