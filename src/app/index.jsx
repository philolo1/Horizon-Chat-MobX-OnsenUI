import React from 'react';
import {render} from 'react-dom';
import AppState from './AppState';
import App from './App';
import Horizon from '@horizon/client';

// const horizon = Horizon({host: 'localhost:5000'});
const horizon = Horizon();
const appState = new AppState(horizon);


horizon.onReady(() => {
  console.log('horizon is ready');

  render(
    <App appState={appState} />,
    document.getElementById('root')
  );
});

console.log('connect horizon');
horizon.connect();

