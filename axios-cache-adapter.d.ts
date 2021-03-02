/**
 * Created by user on 2019/5/12.
 */

import { AxiosInstance, AxiosRequestConfig, AxiosAdapter } from 'axios';

declare module 'axios'
{
	interface AxiosRequestConfig
	{
		/**
		 * configure how the cached requests will be handled, where they will be stored, etc.
		 */
		cache?: IAxiosCacheAdapterOptions;

		/**
		 * force cache invalidation
		 */
		clearCacheEntry?: boolean;
	}
}

/**
 * configure how the cached requests will be handled, where they will be stored, etc.
 */
export interface IAxiosCacheAdapterOptions
{
	/**
	 * {Number} Maximum time for storing each request in milliseconds,
	 * defaults to 15 minutes when using `setup()`.
	 */
	maxAge?: number;
	/**
	 * {Number} Maximum number of cached request (last in, first out queue system),
	 * defaults to `false` for no limit. *Cannot be overridden per request*
	 */
	limit?: false | number;
	/**
	 * {Object} An instance of localforage, defaults to a custom in memory store.
	 * *Cannot be overridden per request*
	 */
	store?: object;
	/**
	 * {String|Function} Generate a unique cache key for the request.
	 * Will use request url and serialized params by default.
	 */
	key?(req: AxiosRequestConfig): string;
	/**
	 * {Function} Invalidate stored cache. By default will remove cache when
	 * making a `POST`, `PUT`, `PATCH` or `DELETE` query.
	 */
	invalidate?(cfg: IAxiosCacheAdapterOptions, req: AxiosRequestConfig): Promise<void>;
	/**
	 * {Object} Define which kind of requests should be excluded from cache.
	 */
	exclude?: {
		/**
		 * {Array} List of regular expressions to match against request URLs.
		 */
		paths?: RegExp[];
		/**
		 * {Boolean} Exclude requests with query parameters.
		 */
		query?: boolean;
		/**
		 * {Function} Method which returns a `Boolean` to determine if request
		 * should be excluded from cache.
		 */
		filter?: Function;
    /**
     * {Array} HTTP methods which will be excluded from cache.
     * Defaults to `['post', 'patch', 'put', 'delete']`
     * Any methods listed will also trigger cache invalidation while using the default `config.invalidate` method.
     *
     * Note: the HEAD method is always excluded (hard coded).
     */
    methods?: ('get' | 'post' | 'patch' | 'put' | 'delete')[];
	};
	/**
	 * {Boolean} Clear cached item when it is stale.
	 */
	clearOnStale?: boolean;
	/**
	 * {Boolean} Clear all cache when a cache write error occurs
	 * (prevents size quota problems in `localStorage`).
	 */
	clearOnError?: boolean;
	/**
	 * {Function|Boolean} Determine if stale cache should be read when a network error occurs.
	 */
	readOnError?: Function | boolean;
	/**
	 * {Boolean} Determine if response headers should be read to set `maxAge` automatically.
	 * Will try to parse `cache-control` or `expires` headers.
	 */
	readHeaders?: boolean;
	/**
	 * {Boolean} Ignore cache, will force to interpret cache reads as a `cache-miss`.
	 * Useful to bypass cache for a given request.
	 */
	ignoreCache?: boolean;
	/**
	 * {Function|Boolean} Print out debug log to console.
	 */
	debug?: Function | boolean;

  excludeFromCache?: boolean;
}

export interface ISetupCache
{
	adapter: AxiosAdapter;
	config: IAxiosCacheAdapterOptions;
	store: object;
}

/**
 * Create an axios instance pre-configured with the cache adapter. Takes an options object to configure the cache and axios at the same time.
 * @param {AxiosRequestConfig} options
 * @returns {AxiosInstance}
 */
export declare function setup(options: AxiosRequestConfig): AxiosInstance;

/**
 * Create a cache adapter instance. Takes an options object to configure how the cached requests will be handled, where they will be stored, etc.
 */
export declare function setupCache(options: IAxiosCacheAdapterOptions) : ISetupCache;

export class RedisStore { constructor(client: any, HASH_KEY?: string); }

export interface RedisDefaultOptions
{
	prefix?: String;

	maxScanCount?: number;
}

export class RedisDefaultStore { constructor(client: any, options?: RedisDefaultOptions); }

export interface IAxiosCacheAdapterRequest
{
	/**
	 * When a response is served from cache a custom `response.request` object is created with a `fromCache` boolean.
	 */
	fromCache?: boolean,

	/**
	 * Check that query was excluded from cache
	 */
	excludedFromCache?: boolean,
}
