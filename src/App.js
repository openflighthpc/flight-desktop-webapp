import { BrowserRouter as Router } from "react-router-dom";

import {
  FetchProvider,
  BrandingProvider,
  DataProvider,
  EnvironmentProvider,
  ConfigProvider,
  CurrentUserProvider,
} from 'flight-webapp-components';

import * as Toast from './ToastContext';
import * as UserConfig from './UserConfigContext';
import AppLayout from './AppLayout';

function App() {
  return (
    <div className="App">
      <DataProvider>
        <BrandingProvider>
          <EnvironmentProvider>
            <ConfigProvider>
              <Router basename={process.env.REACT_APP_MOUNT_PATH}>
                <CurrentUserProvider>
                  <Toast.Provider>
                    <Toast.Container />
                    <FetchProvider>
                      <UserConfig.Provider>
                        <AppLayout />
                      </UserConfig.Provider>
                    </FetchProvider>
                  </Toast.Provider>
                </CurrentUserProvider>
              </Router>
            </ConfigProvider>
          </EnvironmentProvider>
        </BrandingProvider>
      </DataProvider>
    </div>
  );
}

export default App;
