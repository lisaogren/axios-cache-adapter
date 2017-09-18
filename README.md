# axios-cache-adapter

> Caching module for axios

Adapted from [superapi-cache](https://github.com/stephanebachelier/superapi-cache) by @stephanebachelier

## Install

```sh
npm install --save axios-cache-adapter
```

## Usage

You can use the adapter directly

```js
import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'

const cache = axiosCacheAdapter({
  maxAge: 15 * 60 * 1000
})

const api = axios.create({
  adapter: cache.adapter
})

api({
  url: 'http://some-rest.api/url',
  method: 'get'
}).then(response => {
  // Do something fantastic with response.data \o/
})
```

Or you can get an instance of axios preconfigured with the cache adapter

```js
import { setup } from 'axios-cache-adapter'

const api = setup({
  maxAge: 15 * 60 * 1000
})

api({
  url: 'http://some-reset.api/url',
  method: 'get'
}).then(response => {
  // Do something awesome with response.data \o/
})
```

## License

MIT © [Carl Ogren](https://github.com/RasCarlito)
