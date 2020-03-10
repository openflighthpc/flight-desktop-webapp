import React from 'react';

import BrandBar from './BrandBar';
import Footer from './Footer';
import UnauthenticatedDashboard from './UnauthenticatedDashboard';

function App() {
  return (
    <div className="App">
      <BrandBar />
      <div
        className="container-fluid"
        id="main"
      >
        <div className="row content">
          <div className="col-sm-2 sidenav"></div>
          <div className="col centernav mt-4">
            <UnauthenticatedDashboard />
          </div>
          <div className="col-sm-2 sidenav"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
