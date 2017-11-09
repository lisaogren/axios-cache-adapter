import axios from 'axios';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

const defaults = {
  // Default settings when solely creating the cache adapter with setupCache.
  cache: {
    maxAge: 0,
    limit: false,
    store: null,
    key: null,
    exclude: {
      paths: [],
      query: true,
      filter: null
    },
    adapter: axios.defaults.adapter,
    clearOnStale: true,
    clearOnError: true,
    debug: false
  },

  // Additional defaults when creating the axios instance with the cache adapter.
  axios: {
    cache: {
      maxAge: 15 * 60 * 1000
    }
  }
};

// List of disallowed in the per-request config.
// Debug is also added because it would currently have no effect.
const disallowedPerRequestKeys = ['limit', 'store', 'adapter', 'debug'];

/**
 * Merge the per-request config in another config.
 *
 * This method exists because not all keys should be allowed as it
 * may lead to unexpected behaviours. For instance, setting another
 * store or adapter per request is wrong, instead another instance
 * axios, or the adapter, should be used.
 *
 * @param {Object} config Config object.
 * @param {Object} [requestConfig={}] The per-request config.
 * @return {Object}
 */
const mergeRequestConfig = function(config, requestConfig = {}) {
  return merge({}, config, omit(requestConfig, disallowedPerRequestKeys));
};

export { defaults, mergeRequestConfig };
export default { defaults, mergeRequestConfig };
