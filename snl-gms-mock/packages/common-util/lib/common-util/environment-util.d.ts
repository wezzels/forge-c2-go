import type { CommonTypes } from '@gms/common-model';
/**
 * The NODE_ENV environment variable.
 */
export declare const nodeEnv: string | undefined;
/**
 * True if NODE_ENV is set to development.
 */
export declare const isNodeEnvDevelopment: boolean;
/**
 * True if NODE_ENV is set to production.
 */
export declare const isNodeEnvProduction: boolean;
/**
 * True if NODE_ENV is set to test.
 */
export declare const isNodeEnvTest: boolean;
/**
 * The UI_URL endpoint. This is the URL from which the UI content is served.
 */
export declare const UI_URL: string;
/**
 * The UI_BASE_PATH endpoint. This is the base path for the URL in a deployment
 */
export declare const UI_BASE_PATH: string;
/**
 * The SUBSCRIPTION protocol.
 */
export declare const UI_SUBSCRIPTION_PROTOCOL: string;
/**
 * The SUBSCRIPTION URL endpoint.
 */
export declare const UI_SUBSCRIPTION_URL: string;
/**
 * The GATEWAY_HTTP_PROXY_URI environment variable (or the default value if not set).
 */
export declare const GATEWAY_HTTP_PROXY_URI: string;
/**
 * The SUBSCRIPTIONS_PROXY_URI environment variable (or the default value if not set).
 */
export declare const SUBSCRIPTIONS_PROXY_URI: string;
/**
 * The API_GATEWAY_URI environment variable (or the default value if not set).
 */
export declare const API_GATEWAY_URI: string;
/**
 * The API_GATEWAY_URI environment variable for checking a user's login status.
 */
export declare const API_LOGIN_CHECK_URI: string;
/**
 * The API_GATEWAY_URI environment variable for accessing the login endpoint.
 */
export declare const API_LOGIN_URI: string;
/**
 * The API_GATEWAY_URI environment variable for accessing the logout endpoint.
 */
export declare const API_LOGOUT_URI: string;
/**
 * The CESIUM_OFFLINE environment variable.
 */
export declare const CESIUM_OFFLINE: boolean;
export declare const VERSION_INFO: CommonTypes.VersionInfo;
/**
 * Turns on timing points for UI. Set to 'verbose' to see log timing points.
 * Set to any other string to see warnings level timing only.
 */
export declare const GMS_PERFORMANCE_MONITORING_ENABLED: string | boolean;
/**
 * ! This needs to be updated whenever a change is made that would make an old redux store or waveform store invalid
 * This version gets added to all .gms files that are saved.
 * On load, this will be checked against the file version of the running application
 */
export declare const GMS_FILE_VERSION: string;
//# sourceMappingURL=environment-util.d.ts.map