import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

import { environment } from '../environments/environment';
import { TokyoNightPreset } from './core/theme/tokyo-night-preset';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      license: environment.primengLicenseKey,
      theme: {
        preset: TokyoNightPreset,
        options: {
          darkModeSelector: '[dark]',
        },
      },
    }),
    // Singleton message bus for every <p-toast> in the app. Provided globally
    // so any feature component can inject MessageService without having to
    // re-declare it in its own `providers: [...]` array.
    MessageService,
  ],
};
