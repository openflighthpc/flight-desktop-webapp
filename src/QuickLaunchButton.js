import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useToast } from './ToastContext';
import { useLaunchDefaultSession } from './api';

import { ConfigContext } from 'flight-webapp-components';
import { DropdownItem } from 'reactstrap';

function QuickLaunchButton({ className, color }) {
  const clusterName = useContext(ConfigContext).clusterName;
  const history = useHistory();
  const { addToast } = useToast();
  const { response, loading, post } = useLaunchDefaultSession();

  const submit = () => {
    post().then((responseBody) => {
      if (response.ok) {
        history.push(`/sessions/${responseBody.id}`);
      } else {
        addToast(failedToast(clusterName));
      }
    });
  };

  return <DropdownItem color={color} disabled={loading} onClick={submit} href="#">
    { loading ? <i className="fa fa-spinner fa-spin mr-1"/> : null }
    <span>{ loading ? "Quick launching session..." : "Quick launch" }</span>
  </DropdownItem>
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

export default QuickLaunchButton;
