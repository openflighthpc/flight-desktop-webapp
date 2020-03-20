import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from './CurrentUserContext';

test('Provider renders without crashing', () => {
  render(
    <Provider>
      <div>Some children</div>
    </Provider>
  );
});
