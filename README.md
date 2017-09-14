# axios-cache-adapter

> Caching module for axios

Integrated to [axios-cache-request](https://github.com/RasCarlito/axios-cache-request).

Adapted from [superapi-cache](https://github.com/stephanebachelier/superapi-cache) by @stephanebachelier

## Install

```sh
npm install --save axios-cache-adapter
```

## Usage

```js
import axios from 'axios'
import axiosCacheAdapter from 'axios-cache-adapter'

axios({
  url: 'http://some-rest.api/url',
  method: 'get',
  adapter: axiosCacheAdapter
}).then(response => {
  // Do something fantastic with response.data \o/
})
```

## License

MIT © [Carl Ogren](https://github.com/RasCarlito)
