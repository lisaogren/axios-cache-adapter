# :rocket: axios-cache-adapter [![Build Status](https://travis-ci.org/RasCarlito/axios-cache-adapter.svg?branch=master)](https://travis-ci.org/RasCarlito/axios-cache-adapter) [![codecov](https://codecov.io/gh/RasCarlito/axios-cache-adapter/branch/master/graph/badge.svg)](https://codecov.io/gh/RasCarlito/axios-cache-adapter) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Caching adapter for axios. Store request results in a configurable store to prevent unneeded network requests.

Adapted from [superapi-cache](https://github.com/stephanebachelier/superapi-cache)
by [@stephanebachelier](https://github.com/stephanebachelier)

## Install

Using npm

```sh
npm install --save axios-cache-adapter
```

Or bower

```sh
bower install --save axios-cache-adapter
```

Or from a CDN like unpkg.com

```html
<script type="text/javascript" src="https://unpkg.com/axios-cache-adapter"></script>
```

## Usage

### Instantiate adapter on its own

You can instantiate the `axios-cache-adapter` on its own using the `setupCache()` method and then attach the adapter manually to an instance of `axios`.

```js
// Import dependencies
import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000
})

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter
})

// Send a GET request to some REST api
api({
  url: 'http://some-rest.api/url',
  method: 'get'
}).then(async (response) => {
  // Do something fantastic with response.data \o/
  console.log('Request response:', response)

  // Interacting with the store, see `localForage` API.
  const length = await cache.store.length()

  console.log('Cache store length:', length)
})
```

### Instantiate axios with bound adapter

You can use the `setup()` method to get an instance of `axios` pre-configured with the `axios-cache-adapter`. This will remove `axios` as a direct dependency in your code.

```js
// Import dependencies
import { setup } from 'axios-cache-adapter'

// Create `axios` instance with pre-configured `axios-cache-adapter` attached to it
const api = setup({
  // `axios` options
  baseURL: 'http://some-rest.api',

  // `axios-cache-adapter` options
  cache: {
    maxAge: 15 * 60 * 1000
  }
})

// Send a GET request to some REST api
api.get('/url').then(async (response) => {
  // Do something awesome with response.data \o/
  console.log('Request response:', response)

  // Interacting with the store, see `localForage` API.
  const length = await api.cache.length()

  console.log('Cache store length:', length)
})
```

### Override instance config with per request options

After setting up `axios-cache-adapter` with a specific cache configuration you can override parts of that configuration on individual requests.

```js
import { setup } from 'axios-cache-adapter'

const api = setup({
  baseURL: 'https://httpbin.org',

  cache: {
    maxAge: 15 * 60 * 1000
  }
})

// Use global instance config
api.get('/get').then((response) => {
  // Do something awesome with response
})

// Override `maxAge` and cache URLs with query parameters
api.get('/get?with=query', {
  cache: {
    maxAge: 2 * 60 * 1000, // 2 min instead of 15 min
    exclude: { query: false }
  }
})
  .then((response) => {
    // Do something beautiful ;)
  })
```

_Note: Not all instance options can be overridden per request, see the API documentation at the end of this readme_

### Use localforage as cache store

You can give a `localforage` instance to `axios-cache-adapter` which will be used to store cache data instead of the default [in memory](https://github.com/RasCarlito/axios-cache-adapter/blob/master/src/memory.js) store.

_Note: This only works client-side because `localforage` does not work in Node.js_

```js
import localforage from 'localforage'
import memoryDriver from 'localforage-memoryStorageDriver'
import { setup } from 'axios-cache-adapter'

// `async` wrapper to configure `localforage` and instantiate `axios` with `axios-cache-adapter`
async function configure () {
  // Register the custom `memoryDriver` to `localforage`
  await localforage.defineDriver(memoryDriver)

  // Create `localforage` instance
  const store = localforage.createInstance({
    // List of drivers used
    driver: [
      localforage.INDEXEDDB,
      localforage.LOCALSTORAGE,
      memoryDriver._driver
    ],
    // Prefix all storage keys to prevent conflicts
    name: 'my-cache'
  })

  // Create `axios` instance with pre-configured `axios-cache-adapter` using a `localforage` store
  return setup({
    // `axios` options
    baseURL: 'http://some-rest.api',

    // `axios-cache-adapter` options
    cache: {
      maxAge: 15 * 60 * 1000,
      store // Pass `localforage` store to `axios-cache-adapter`
    }
  })
}

configure().then(async (api) => {
  const response = await api.get('/url')

  // Display something beautiful with `response.data` ;)
})
```

### Check if response is served from network or from cache

When a response is served from cache a custom `response.request` object is created with a `fromCache` boolean.

```js
// Import dependencies
import assert from 'assert'
import { setup } from 'axios-cache-adapter'

// Create `axios` instance with pre-configured `axios-cache-adapter`
const api = setup({
  cache: {
    maxAge: 15 * 60 * 1000
  }
})

// Wrap code in an `async` function
async function exec () {
  // First request will be served from network
  const response = await api.get('http://some-rest.api/url')

  // `response.request` will contain the origin `axios` request object
  assert.ok(response.request.fromCache !== true)

  // Second request to same endpoint will be served from cache
  const anotherResponse = await api.get('http://some-rest.api/url')

  // `response.request` will contain `fromCache` boolean
  assert.ok(anotherResponse.request.fromCache === true)
}

// Execute our `async` wrapper
exec()
```

### Read stale cache data on network error

You can tell `axios-cache-adapter` to read stale cache data when a network error occurs using the `readOnError` option.

`readOnError` can either be a `Boolean` telling cache adapter to attempt reading stale cache when any network error happens or a `Function` which receives the error and request objects and then returns a `Boolean`.

By default `axios-cache-adapter` clears stale cache data automatically, this would conflict with activating the `readOnError` option, so the `clearOnStale` option should be set to `false`.

```js
import { setup } from 'axios-cache-adapter'

const api = setup({
  cache: {
    // Attempt reading stale cache data when response status is either 4xx or 5xx
    readOnError: (error, request) => {
      return error.response.status >= 400 && error.response.status < 600
    },
    // Deactivate `clearOnStale` option so that we can actually read stale cache data
    clearOnStale: false
  }
})

// Make a first successful request which will store the response in cache
api.get('https://httpbin.org/get').then(response => {
  // Response will not come from cache
  assert.ok(response.request.fromCache !== true)
})

// Let's say that the stored data has become stale (default 15min max age has passed)
// and we make the same request but it results in an internal server error (status=500)
api.get('https://httpbin.org/get').then(response => {
  // Response is served from cache
  assert.ok(response.request.fromCache === true)
  // We can check that it actually served stale cache data
  assert.ok(response.request.stale === true)
}).catch(err => {
  // Will not execute this because stale cache data was returned
  // If the attempt at reading stale cache fails, the network error will be thrown and this method executed
})
```

_Note: Passing a function to `readOnError` is a smarter thing to do as you get to choose when a stale cache read should be attempted instead of doing it on all kind of errors_

### Invalidate cache entries

By default, a cache entry will be invalidated when a `POST`, `PUT`, `PATCH` or `DELETE` request is made to the same URL using the following method:

```js
async defaultInvalidate (config, request) {
  const method = request.method.toLowerCase()

  if (method !== 'get') {
    await config.store.removeItem(config.uuid)
  }
}
```

You can customize how `axios-cache-adapter` invalidates stored cache entries by providing a custom `invalidate` function.

```js
import { setup } from 'axios-cache-adapter'

// Create cached axios instance with custom invalidate method
const api = setup({
  cache: {
    // Invalidate only when a specific option is passed through config
    invalidate: async (config, request) => {
      if (request.clearCacheEntry) {
        await config.store.removeItem(config.uuid)
      }
    }
  }
})

// Make a request that will get stored into cache
api.get('https://httpbin.org/get').then(response => {
  assert.ok(response.request.fromCache !== true)
})

// Wait some time

// Make another request to same end point but force cache invalidation
api.get('https://httpbin.org/get', { clearCacheEntry: true }).then(response => {
  // Response should not come from cache
  assert.ok(response.request.fromCache !== true)
})
```

### Use response headers to automatically set `maxAge`

When you set the `readHeaders` option to `true`, the adapter will try to read `cache-control` or `expires` headers to automatically set the `maxAge` option for the given request.

```js
import assert from 'assert'
import { setup } from 'axios-cache-adapter'

const api = setup({
  cache: {
    // Tell adapter to attempt using response headers
    readHeaders: true,
    // For this example to work we disable query exclusion
    exclude: { query: false }
  }
})

// Make a request which will respond with header `cache-control: max-age=60`
api.get('https://httpbin.org/cache/60').then(response => {
  // Cached `response` will expire one minute later
})

// Make a request which responds with header `cache-control: no-cache`
api.get('https://httpbin.org/response-headers?cache-control=no-cache').then(response => {
  // Response will not come from cache
  assert.ok(response.request.fromCache !== true)

  // Check that query was excluded from cache
  assert.ok(response.request.excludedFromCache === true)
})
```

_Note: For the `cache-control` header, only the `max-age`, `no-cache` and `no-store` values are interpreted._

## API

### setupCache(options)

Create a cache adapter instance. Takes an `options` object to configure how the cached requests will be handled,
where they will be stored, etc.

#### Options

```js
// Options passed to `setupCache()`.
{
  // {Number} Maximum time for storing each request in milliseconds,
  // defaults to 15 minutes when using `setup()`.
  maxAge: 0,
  // {Number} Maximum number of cached request (last in, first out queue system),
  // defaults to `false` for no limit. *Cannot be overridden per request*
  limit: false,
  // {Object} An instance of localforage, defaults to a custom in memory store.
  // *Cannot be overridden per request*
  store: new MemoryStore(),
  // {String|Function} Generate a unique cache key for the request.
  // Will use request url and serialized params by default.
  key: req => req.url + serializeQuery(req.params),
  // {Function} Invalidate stored cache. By default will remove cache when
  // making a `POST`, `PUT`, `PATCH` or `DELETE` query.
  invalidate: async (cfg, req) => {
    const method = req.method.toLowerCase()
    if (method !== 'get') {
      await cfg.store.removeItem(cfg.uuid)
    }
  },
  // {Object} Define which kind of requests should be excluded from cache.
  exclude: {
    // {Array} List of regular expressions to match against request URLs.
    paths: [],
    // {Boolean} Exclude requests with query parameters.
    query: true,
    // {Function} Method which returns a `Boolean` to determine if request
    // should be excluded from cache.
    filter: null
  },
  // {Boolean} Clear cached item when it is stale.
  clearOnStale: true,
  // {Boolean} Clear all cache when a cache write error occurs
  // (prevents size quota problems in `localStorage`).
  clearOnError: true,
  // {Function|Boolean} Determine if stale cache should be read when a network error occurs.
  readOnError: false,
  // {Boolean} Determine if response headers should be read to set `maxAge` automatically.
  // Will try to parse `cache-control` or `expires` headers.
  readHeaders: false,
  // {Boolean} Ignore cache, will force to interpret cache reads as a `cache-miss`.
  // Useful to bypass cache for a given request.
  ignoreCache: false,
  // {Function|Boolean} Print out debug log to console.
  debug: false
}
```

#### Returns

`setupCache()` returns an object containing the configured `adapter`, the cache `store` and the `config` that is applied to this instance.

### setup(options)

Create an `axios` instance pre-configured with the cache adapter. Takes an `options` object to configure the cache and
axios at the same time.

#### Options

```js
{
  cache: {
    // Options passed to the `setupCache()` method
  }

  // Options passed to `axios.create()` method
}
```

All the other parameters will be passed directly to the [`axios.create`](https://github.com/mzabriskie/axios#creating-an-instance) method.

#### Returns

`setup()` returns an instance of `axios` pre-configured with the cache adapter.
The cache `store` is conveniently attached to the `axios` instance as `instance.cache` for easy access.

### Per request options

Using the same object definition as the `setup` method you can override cache options for individual requests.

```js
api.get('https://httpbin.org/get', {
  cache: {
    // Options override
  }
})
```

All options except `limit` and `store` can be overridden per request.

Also the following keys are used internally and therefore should not be set in the options: `adapter`, `uuid`, `acceptStale`.

## Building

```sh
npm run build
```

Webpack is used to build [umd](https://github.com/umdjs/umd) versions of the library that are placed in the `dist` folder.

* `cache.js`
* `cache.min.js`
* `cache.node.js`
* `cache.node.min.js`

A different version of `axios-cache-adapter` is generated for node and the browser due to how Webpack 4 uses a `target` to change how the UMD wrapper is generated using `global` or `window`. If you are using the library in node or in your front-end code while using a module bundler (Webpack, rollup, etc) the correct version will be picked up automatically thanks to the `"main"` and `"browser"` fields in the `package.json`.

`axios-cache-adapter` is developped in ES6+ and uses async/await syntax. It is transpiled to ES5 using `babel` with `preset-env`.

## Testing

Tests are executed using [karma](https://github.com/karma-runner/karma).

To launch a single run tests using ChromeHeadless:

```sh
npm test
```

To launch tests in watch mode in Chrome for easier debugging with devtools:

```sh
npm run watch
```

## Browser vs Node.js

`axios-cache-adapter` was designed to run in the browser. It does work in nodejs using the [in memory store](https://github.com/RasCarlito/axios-cache-adapter/blob/master/src/memory.js). But storing data in memory is not the greatests idea ever.

You can give a `store` to override the in memory store but it has to comply with the [`localForage`](https://github.com/localForage/localForage) API and `localForage` does not work in nodejs for very good reasons that are better explained in [this issue](https://github.com/localForage/localForage/issues/57).

Maybe it should be possible to connect `axios-cache-adapter` to a [redis](https://redis.io/) store or something equivalent.

If you have any suggestions for a better way to work in nodejs please open an issue or submit a pull request.

## License

MIT © [Carl Ogren](https://github.com/RasCarlito)
