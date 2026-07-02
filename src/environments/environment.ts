/**
 * Default (development) environment configuration.
 *
 * Both this file and `environment.prod.ts` are committed to the repo
 * because Angular CLI's `fileReplacements` requires both files to exist
 * at build time. Use this file for non-secret local configuration and
 * inject real secrets at build / deploy time (CI/CD variable, secret
 * manager, etc.) rather than committing them.
 *
 * `primengLicenseKey` is intentionally empty in source control. Get a
 * free community license at https://primeui.org and paste the value
 * here for local development. Leaving it empty is fine — PrimeNG will
 * log a single `PrimeUI license is not configured.` warning to the
 * console but the components work.
 *
 * `firebase` fields are safe to leave empty for local development.
 * Real Firebase web config is public-by-design when populated (the
 * keys identify the project, not the user), but keep them out of
 * source control as a hygiene default.
 */
export const environment = {
  production: false,
  primengLicenseKey: '',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
} as const;
