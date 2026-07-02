/**
 * Production environment configuration. Selected automatically by
 * `fileReplacements` in `angular.json` when building with
 * `--configuration production`.
 *
 * For secrets that should not be committed (license keys, server tokens,
 * etc.), the conventional approach is for the CI/CD pipeline to overwrite
 * this file with real values before the build runs. Alternatively, keep
 * the values empty here and have the secret manager inject them at
 * deploy time through another mechanism.
 *
 * Firebase web configuration is public by design and is safe to commit.
 */
export const environment = {
  production: true,
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
