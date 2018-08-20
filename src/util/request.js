'use strict';

const config = require('../config');
const base = require('request-promise').defaults({
    timeout: config.requestTimeout
});

function wrap (request) {
    const wrapper = options => request(options).catch(e => {
        e.options = options;
        throw e;
    });

    wrapper.unwrap = () => request;
    wrapper.defaults = opts => wrap(request.defaults(opts));

    return wrapper;
}

/*
 * Wraps request to provide better debugging (include request opts with the error object)
 */
module.exports = wrap(base);
