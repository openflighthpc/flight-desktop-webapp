import React, { useContext } from 'react';
import { DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { ConfigContext } from 'flight-webapp-components';
import { useLaunchDefaultSession } from './api';
import { useToast } from './ToastContext';

function LaunchDropdown({ className }) {
  const [dropdownOpen, setOpen] = React.useState(false);
  const toggle = () => setOpen(prevState => !prevState);
  const clusterName = useContext(ConfigContext).clusterName;
  const history = useHistory();
  const { addToast } = useToast();
  const { response, loading, post } = useLaunchDefaultSession();

  const quickLaunch = (ev) => {
    post().then((responseBody) => {
      if (response.ok) {
        history.push(`/sessions/${responseBody.id}`);
      } else {
        addToast(failedToast(clusterName));
      }
      setOpen(false);
    });
  };

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <Link
        className={className}
        to="/sessions/new"
      >
          Launch session
      </Link>

      <DropdownToggle tag={"a"} type="button" split />

      <DropdownMenu right >
        <DropdownItem
          disabled={loading}
          onClick={quickLaunch}
          // We don't close the dropdown by default as we use the changing
          // menu item text for feedback.
          toggle={false}
        >
          { loading ? <i className="fa fa-spinner fa-spin mr-1"/> : null }
          <span>{ loading ? "Launching..." : "Quick launch" }</span>
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
}

function failedToast(clusterName) {
  const body = (
    <div>
      Your default desktop has not yet been fully configured.  If
      you would like to use this desktop please contact the system
      administrator for {' '}<em>{clusterName}</em> and ask them to prepare
      this desktop.
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Failed to launch desktop',
  };
}

export default LaunchDropdown;
