import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PandaProvider } from 'panda-wallet-provider/dist/context/PandaWalletContext';

import { OrdinalLock } from './contracts/ordinalLock';
import artifact from '../artifacts/ordinalLock.json';

OrdinalLock.loadArtifact(artifact);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <PandaProvider>
  <App />
</PandaProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();