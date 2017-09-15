# axios-cache-adapter

> Caching module for axios

Adapted from [superapi-cache](https://github.com/stephanebachelier/superapi-cache) by @stephanebachelier

## Install

```sh
npm install --save axios-cache-adapter
```

## Usage

```js
import axios from 'axios'
import axiosCacheAdapter from 'axios-cache-adapter'

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

## License

MIT © [Carl Ogren](https://github.com/RasCarlito)
