/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

// Require the framework and instantiate it
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createWiki } from './src/api/create-wiki.js';
import { wikiExists } from './src/utils/wikiExists.js';
import AddressFactory from './src/utils/address.js';
import { State } from './src/state.js';
import { ERR_NOWIKIEXIST } from './src/constants.js';
import { Listener } from './src/listener.js';

const state = new State();

const fastify = Fastify({ logger: { file: '../log.txt' } });
fastify.register(cors, {});

// Declare a route
fastify.post('/wiki/create', async (request) => {
    const { body } = request;
    if (!body.path) {
        throw Error('Path must be provided');
    }

    const reason = await createWiki(body.path);
    return { created: reason === true, message: reason === true ? '' : reason };
});

fastify.post('/wiki/connect', async (request) => {
    const { body } = request;
    if (!body.path) {
        throw Error('Path must be provided');
    }
    if (!wikiExists(body.path)) {
        throw Error(ERR_NOWIKIEXIST);
    }
    let listener = state.getListener(body.path);
    if (!listener) {
        listener = new Listener(body.path, AddressFactory.getNextAddress());
    }
    await listener.listen();
    state.addListener(listener);
    state.setOpenWiki(listener.filePath);
    return listener.getPayload();
});

// Run the server!
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
};
start();
