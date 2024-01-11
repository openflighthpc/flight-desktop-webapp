import React, { useContext } from 'react';
import { Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import classNames from "classnames";

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
        history.push(`/${responseBody.id}`);
      } else {
        addToast(failedToast(clusterName));
      }
      setOpen(false);
    });
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle className={classNames(className, "button link white-text")}>
        NEW DESKTOP
        <i className="fa-solid fa-caret-down ml-2"></i>
      </DropdownToggle>
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
        <DropdownItem
          disabled={loading}
          onClick={() => history.push("/new")}
          >
          Custom desktop
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
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
