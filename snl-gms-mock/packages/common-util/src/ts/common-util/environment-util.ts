import type { CommonTypes } from '@gms/common-model';

import { isWindowDefined } from './window-util';

const getScope = () => {
  if (isWindowDefined()) {
    return window;
  }
  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== 'undefined') {
    // eslint-disable-next-line no-restricted-globals
    return self;
  }
  return undefined;
};

const scope = getScope();
const scopeIsDefined = typeof scope !== 'undefined';

// TODO determine if the util library should only use primitive types
// TODO determine if the environment utils should be moved to a different package

/**
 * The NODE_ENV environment variable.
 */
export const nodeEnv = process.env.NODE_ENV;

/**
 * True if NODE_ENV is set to development.
 */
export const isNodeEnvDevelopment = nodeEnv === 'development';

/**
 * True if NODE_ENV is set to production.
 */
export const isNodeEnvProduction = nodeEnv === 'production';

/**
 * True if NODE_ENV is set to test.
 */
export const isNodeEnvTest = nodeEnv === 'test';

/**
 * The UI_URL endpoint. This is the URL from which the UI content is served.
 */
export const UI_URL = scopeIsDefined
  ? `${scope.location.protocol}//${scope.location.host}`
  : 'http://localhost:8000';

/**
 * The UI_BASE_PATH endpoint. This is the base path for the URL in a deployment
 */
export const UI_BASE_PATH =
  scopeIsDefined && !scope.location.host.includes('localhost') ? '/interactive-analysis-ui' : '';

/**
 * The SUBSCRIPTION protocol.
 */
export const UI_SUBSCRIPTION_PROTOCOL =
  scopeIsDefined && scope.location.protocol === 'https:' ? 'wss' : 'ws';

/**
 * The SUBSCRIPTION URL endpoint.
 */
export const UI_SUBSCRIPTION_URL = scopeIsDefined
  ? `${UI_SUBSCRIPTION_PROTOCOL}://${scope.location.host}`
  : 'ws://localhost';

/**
 * The GATEWAY_HTTP_PROXY_URI environment variable (or the default value if not set).
 */
export const GATEWAY_HTTP_PROXY_URI = process.env.GATEWAY_HTTP_PROXY_URI || UI_URL;

/**
 * The SUBSCRIPTIONS_PROXY_URI environment variable (or the default value if not set).
 */
export const SUBSCRIPTIONS_PROXY_URI = process.env.SUBSCRIPTIONS_PROXY_URI || UI_SUBSCRIPTION_URL;

/**
 * The API_GATEWAY_URI environment variable (or the default value if not set).
 */
export const API_GATEWAY_URI = GATEWAY_HTTP_PROXY_URI;

/**
 * The API_GATEWAY_URI environment variable for checking a user's login status.
 */
export const API_LOGIN_CHECK_URI = `${GATEWAY_HTTP_PROXY_URI}/interactive-analysis-api-gateway/auth/checkLogIn`;

/**
 * The API_GATEWAY_URI environment variable for accessing the login endpoint.
 */
export const API_LOGIN_URI = `${GATEWAY_HTTP_PROXY_URI}/interactive-analysis-api-gateway/auth/logInUser`;

/**
 * The API_GATEWAY_URI environment variable for accessing the logout endpoint.
 */
export const API_LOGOUT_URI = `${GATEWAY_HTTP_PROXY_URI}/interactive-analysis-api-gateway/auth/logOutUser`;

/**
 * The CESIUM_OFFLINE environment variable.
 */
export const CESIUM_OFFLINE = process.env.CESIUM_OFFLINE
  ? !(
      process.env.CESIUM_OFFLINE === 'null' ||
      process.env.CESIUM_OFFLINE === 'undefined' ||
      process.env.CESIUM_OFFLINE === 'false'
    )
  : false;

export const VERSION_INFO: CommonTypes.VersionInfo = {
  versionNumber: process.env.VERSION_NUMBER ?? 'Unknown version',
  commitSHA: process.env.COMMIT_SHA ?? 'Unknown commit'
};

/**
 * Turns on timing points for UI. Set to 'verbose' to see log timing points.
 * Set to any other string to see warnings level timing only.
 */
export const GMS_PERFORMANCE_MONITORING_ENABLED =
  process.env.GMS_PERFORMANCE_MONITORING_ENABLED?.toLocaleLowerCase() ?? false;

/**
 * ! This needs to be updated whenever a change is made that would make an old redux store or waveform store invalid
 * This version gets added to all .gms files that are saved.
 * On load, this will be checked against the file version of the running application
 */
export const GMS_FILE_VERSION = process.env.GMS_FILE_VERSION || `0.3`;
