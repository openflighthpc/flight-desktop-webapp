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
import AppLayout from './AppLayout';

import {
  Context as UserConfigContext,
  Provider as UserConfigProvider
} from './UserConfigContext';

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
                      <UserConfigProvider>
                        <AppLayout />
                      </UserConfigProvider>
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
