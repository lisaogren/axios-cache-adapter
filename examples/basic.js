const {setup} = require('axios-cache-adapter')

// Create an `axios` instance with `axios-cache-adapter` pre-configured
const api = setup({
    // `axios` options
    baseURL: 'https://httpbin.org',

    // `axios-cache-adapter` options
    cache: {
        // Cache expiration in milliseconds, here 15min
        maxAge: 15 * 60 * 1000,
        // Cache exclusion rules
        exclude: {
            // Store responses from requests with query parameters in cache
            query: false
        }
    }
})

// Make a request to https://httpbin.org/get?foo=bar (runkit handles what appears to be a top-level await)
const response = await api.get('/get?foo=bar')

// Check received data and that response did not come from cache
console.log(response.data.args.foo)
console.log(response.request.fromCache === true)

// Make another request to the same endpoint
const anotherResponse = await api.get('/get?foo=bar')

// Check received data and that response came from the cache
console.log(anotherResponse.data.args.foo)
console.log(anotherResponse.request.fromCache === true)
