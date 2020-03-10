import React from 'react';

import BrandBar from './BrandBar';
import Footer from './Footer';
import Dashboard from './Dashboard';
import { Provider as CurrentUserProvider } from './CurrentUserContext';
import { Provider as SessionsProvider } from './SessionsContext';

function App() {
  return (
    <div className="App">
      <CurrentUserProvider>
        <SessionsProvider>
          <BrandBar />
          <div
            className="container-fluid"
            id="main"
          >
            <div className="row content">
              <div className="col-sm-2 sidenav"></div>
              <div className="col centernav mt-4">
                <Dashboard />
              </div>
              <div className="col-sm-2 sidenav"></div>
            </div>
          </div>
          <Footer />
        </SessionsProvider>
      </CurrentUserProvider>
    </div>
  );
}

export default App;
