import config  from "config";
import Hapi, { Server } from "hapi";
import WebSocket from "ws";
import Inert from "inert";
import Vision from "vision";
import HapiSwagger from "hapi-swagger";
import HapiAuthCookie from "hapi-auth-cookie";

import SwaggerOptions from "utils/SwaggerOptions";
import Routes from "routes";

const server = new Hapi.Server({
    host: config.get('app.connection.host'),
    port: config.get('app.connection.port'),
    routes: {
        cors: true,
    }
});

server.register([
    Inert,
    Vision,
    {
        plugin: HapiSwagger,
        options: SwaggerOptions,
    },
    HapiAuthCookie,
]).then(() => {
    /*
       Initialize server - Make sure plugins, caches and other things
                           are ready before listening to requests
    */
   server.auth.strategy('session', 'cookie', {
       password: '980das9809d8asd098dsa098dsadsa09asd8089ads',
       isSecure: false,
       isSameSite: 'Lax'
   });
   server.auth.default('session');
    return server.initialize();
}).then(() => {
    Routes.forEach(route => server.route(route));
    return server.start();
}).then(() => {
    console.info(`Server started at ${server.info.uri}`);
}).catch((err) => {
    server.stop();
    console.error(err);
    process.exit(255);
});
