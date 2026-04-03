import { WeavessConfiguration } from '@gms/weavess-core';
import defaultsDeep from 'lodash/defaultsDeep';
import memoizeOne from 'memoize-one';
/**
 * Returns the Weavess configuration based on the configuration
 * passed in by the user and the default configuration
 *
 * @param config
 * @param defaultConfig
 */
const getConfiguration = (config, defaultConfig = WeavessConfiguration.defaultConfiguration) => defaultsDeep(config, defaultConfig);
export const memoizedGetConfiguration = memoizeOne(getConfiguration);
//# sourceMappingURL=configuration.js.map