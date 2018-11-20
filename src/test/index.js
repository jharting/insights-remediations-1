'use strict';

require('should');
const sinon = require('sinon');
const supertest = require('supertest');

const app = require('../app');
const config = require('../config');
const vmaas = require('../connectors/vmaas');
const identityUtils = require('../middleware/identity/utils');

let server;

beforeAll(async () => {
    server = await app.start();
});

beforeEach(() => {
    exports.sandbox = sinon.createSandbox();
});

exports.getSandbox = () => exports.sandbox;

afterEach(() => {
    exports.sandbox.restore();
    delete exports.sandbox;
});

afterAll(async () => {
    if (server) {
        await server.stop();
    }
});

exports.request = supertest.agent(`http://localhost:${config.port}${config.path.base}`);

function createHeader (id, account_number) {
    return {
        [identityUtils.IDENTITY_HEADER]: identityUtils.createIdentityHeader(id, account_number)
    };
}

exports.auth = Object.freeze({
    default: createHeader(),
    empty: createHeader(101, 'test01')
});

exports.mockVmaas = function () {
    exports.sandbox.stub(vmaas, 'getErratum').callsFake(() => ({ synopsis: 'mock synopsis' }));
};

exports.throw404 = () => {
    const error =  new Error();
    error.name === 'StatusCodeError';
    error.statusCode === 404;
    throw new error;
};

