<a name="0.5.0"></a>
# [0.5.0](https://github.com/stephanebachelier/superapi-cache/compare/0.5.0...v0.5.0) (2016-02-11)


### Bug Fixes

* **cache:** fix runtime error when no service ([33bda03](https://github.com/stephanebachelier/superapi-cache/commit/33bda03))



<a name="0.5.0"></a>
# 0.5.0 (2016-02-11)


### Bug Fixes

* **cache:** fix agent response override on cache hit ([4822a49](https://github.com/stephanebachelier/superapi-cache/commit/4822a49))
* **hydrate:** support headers serialization from string ([6f3085d](https://github.com/stephanebachelier/superapi-cache/commit/6f3085d))
* **hydration:** do not assume JSON data ([0d97a3a](https://github.com/stephanebachelier/superapi-cache/commit/0d97a3a))
* **middleware:** fix variables shadowing issue ([45dd709](https://github.com/stephanebachelier/superapi-cache/commit/45dd709))
* **serialise:** fix to use response xhr ([e0ceafb](https://github.com/stephanebachelier/superapi-cache/commit/e0ceafb))
* **test:** switch to blue-tape to avoid non ending test ([0fc9d62](https://github.com/stephanebachelier/superapi-cache/commit/0fc9d62))

### Features

* **cache:** add configuration ([cce19ae](https://github.com/stephanebachelier/superapi-cache/commit/cce19ae))
* **cache:** add overridable function to define the cache key ([189ec0e](https://github.com/stephanebachelier/superapi-cache/commit/189ec0e))
* **cache:** add read operation from cache ([c0744af](https://github.com/stephanebachelier/superapi-cache/commit/c0744af))
* **cache:** add response serialization ([1a457d1](https://github.com/stephanebachelier/superapi-cache/commit/1a457d1))
* **cache:** cache response from network ([72a4c97](https://github.com/stephanebachelier/superapi-cache/commit/72a4c97))
* **cache:** caching function is now a separate configuration ([267a9d4](https://github.com/stephanebachelier/superapi-cache/commit/267a9d4))
* **cache:** inject caching handler ([3b77567](https://github.com/stephanebachelier/superapi-cache/commit/3b77567))
* **cache:** intercept the cache error to trigger a network fetch ([1e2db42](https://github.com/stephanebachelier/superapi-cache/commit/1e2db42))
* **cache:** return value from cache if it exists ([a202ddc](https://github.com/stephanebachelier/superapi-cache/commit/a202ddc))
* **cache:** stop cache handling on cache miss ([644cb09](https://github.com/stephanebachelier/superapi-cache/commit/644cb09))
* **example:** add simple example ([9c42154](https://github.com/stephanebachelier/superapi-cache/commit/9c42154))
* **hydrate:** add logic to build response from cache ([4adad10](https://github.com/stephanebachelier/superapi-cache/commit/4adad10))
* **hydrate:** parse JSON-based cache value ([8386519](https://github.com/stephanebachelier/superapi-cache/commit/8386519))
* **hydrate:** throw error on empty cache ([c9c5f5a](https://github.com/stephanebachelier/superapi-cache/commit/c9c5f5a))
* **log:** add configurable log about cache hit/miss ([54b7a1f](https://github.com/stephanebachelier/superapi-cache/commit/54b7a1f))
* **memory:** migrate store to promise ([5794e33](https://github.com/stephanebachelier/superapi-cache/commit/5794e33))
* **middleware:** export default cache read function ([798ce92](https://github.com/stephanebachelier/superapi-cache/commit/798ce92))
* **response:** add logic to build response from serialized response ([8015708](https://github.com/stephanebachelier/superapi-cache/commit/8015708))
* **store:** add memory store ([118d462](https://github.com/stephanebachelier/superapi-cache/commit/118d462))


### BREAKING CHANGES

* cache: caching function should be a function not related to the store



<a name="0.0.0"></a>
# 0.0.0 (2016-02-11)


### Bug Fixes

* **cache:** fix agent response override on cache hit ([4822a49](https://github.com/stephanebachelier/superapi-cache/commit/4822a49))
* **hydrate:** support headers serialization from string ([6f3085d](https://github.com/stephanebachelier/superapi-cache/commit/6f3085d))
* **hydration:** do not assume JSON data ([0d97a3a](https://github.com/stephanebachelier/superapi-cache/commit/0d97a3a))
* **middleware:** fix variables shadowing issue ([45dd709](https://github.com/stephanebachelier/superapi-cache/commit/45dd709))
* **serialise:** fix to use response xhr ([e0ceafb](https://github.com/stephanebachelier/superapi-cache/commit/e0ceafb))
* **test:** switch to blue-tape to avoid non ending test ([0fc9d62](https://github.com/stephanebachelier/superapi-cache/commit/0fc9d62))

### Features

* **cache:** add configuration ([cce19ae](https://github.com/stephanebachelier/superapi-cache/commit/cce19ae))
* **cache:** add overridable function to define the cache key ([189ec0e](https://github.com/stephanebachelier/superapi-cache/commit/189ec0e))
* **cache:** add read operation from cache ([c0744af](https://github.com/stephanebachelier/superapi-cache/commit/c0744af))
* **cache:** add response serialization ([1a457d1](https://github.com/stephanebachelier/superapi-cache/commit/1a457d1))
* **cache:** cache response from network ([72a4c97](https://github.com/stephanebachelier/superapi-cache/commit/72a4c97))
* **cache:** caching function is now a separate configuration ([267a9d4](https://github.com/stephanebachelier/superapi-cache/commit/267a9d4))
* **cache:** inject caching handler ([3b77567](https://github.com/stephanebachelier/superapi-cache/commit/3b77567))
* **cache:** intercept the cache error to trigger a network fetch ([1e2db42](https://github.com/stephanebachelier/superapi-cache/commit/1e2db42))
* **cache:** return value from cache if it exists ([a202ddc](https://github.com/stephanebachelier/superapi-cache/commit/a202ddc))
* **cache:** stop cache handling on cache miss ([644cb09](https://github.com/stephanebachelier/superapi-cache/commit/644cb09))
* **example:** add simple example ([9c42154](https://github.com/stephanebachelier/superapi-cache/commit/9c42154))
* **hydrate:** add logic to build response from cache ([4adad10](https://github.com/stephanebachelier/superapi-cache/commit/4adad10))
* **hydrate:** parse JSON-based cache value ([8386519](https://github.com/stephanebachelier/superapi-cache/commit/8386519))
* **hydrate:** throw error on empty cache ([c9c5f5a](https://github.com/stephanebachelier/superapi-cache/commit/c9c5f5a))
* **log:** add configurable log about cache hit/miss ([54b7a1f](https://github.com/stephanebachelier/superapi-cache/commit/54b7a1f))
* **memory:** migrate store to promise ([5794e33](https://github.com/stephanebachelier/superapi-cache/commit/5794e33))
* **middleware:** export default cache read function ([798ce92](https://github.com/stephanebachelier/superapi-cache/commit/798ce92))
* **response:** add logic to build response from serialized response ([8015708](https://github.com/stephanebachelier/superapi-cache/commit/8015708))
* **store:** add memory store ([118d462](https://github.com/stephanebachelier/superapi-cache/commit/118d462))


### BREAKING CHANGES

* cache: caching function should be a function not related to the store



