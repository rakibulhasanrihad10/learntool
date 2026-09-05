import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from '@/app/App';
import { PWA_UPDATE_EVENT, setUpdateHandler } from '@/pwa/update';
import '@/styles/index.css';

// Prompt-driven service worker: the worker installs and precaches in the
// background, but a new version only activates after the user accepts the
// update banner (see PwaBanners). Never imported by tests.
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: false,
    onNeedRefresh() {
      window.dispatchEvent(new Event(PWA_UPDATE_EVENT));
    },
    onOfflineReady() {},
  });
  setUpdateHandler(() => {
    void updateSW(true);
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
