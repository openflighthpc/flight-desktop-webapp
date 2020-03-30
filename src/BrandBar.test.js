import BrandBar from './BrandBar';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Context as CurrentUserContext } from './CurrentUserContext';
import { Context as ConfigContext } from './ConfigContext';

test('renders without crashing', () => {
  render(
    <Router>
      <ConfigContext.Provider value={{ clusterName: 'A cluster' }}>
        <CurrentUserContext.Provider value={{ currentUser: null, actions: {} }}>
          <BrandBar />
        </CurrentUserContext.Provider>
      </ConfigContext.Provider>
    </Router>
  );
});
