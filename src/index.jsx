import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import AppState from './AppState';
import App from './App';
import Horizon from '@horizon/client';

const horizon = Horizon({host: 'localhost:5000'});
const appState = new AppState(horizon);


horizon.onReady(() => {
  console.log('horizon is ready');

  render(
    <AppContainer>
      <App appState={appState} />
    </AppContainer>,
    document.getElementById('root')
  );

  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;

      render(
        <AppContainer>
          <NextApp appState={appState} />
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }

});

horizon.connect();

