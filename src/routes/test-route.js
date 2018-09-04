import Joi from "joi";
import TestController from "controllers/TestController";
import { Test as TestSchema } from "schemas";


import gencert from 'gencert';


export default [
    {
        path: '/test',
        method: 'POST',
        config: {
            description: `Push something to test`,
            tags: [ "api", "test" ],
            validate: {
                payload: TestSchema,
            }
        },
        handler: TestController.testMe,
    },
    {
        path: '/upload',
        method: 'POST',
        config: {
            payload: {
                output: 'stream',
                allow: 'multipart/form-data',
            },
            plugins: {
                'hapi-swagger': { payloadType: 'form'},
            }, 
            auth: false, 
            tags: ["api"],
            description: `Upload Something`,
            validate: {
               payload: {
                name: Joi.string(),
                somefile: Joi.any().meta({ swaggerType: 'file'}).description(`Some file`),
               }
            }
        },
        handler: (request, h) => {
            const somefile = request.payload.somefile;
            console.log(somefile._data.length);
            return h.response();
        }
    },
    {
        path: '/live',
        method: 'POST',
        config: {
            auth: false,
            tags: ["api"],
            validate: {
                payload:Joi.object().keys({
                        a: Joi.string(),
                        b: Joi.string().allow('')
                    }).or('a', 'b')
            }
        },
        handler: (request, h) => {
            return h.response();
        }
    }, {
        path:  '/cert',
        method: 'GET',
        config: {
            auth: false,
        },
        handler: (request, h) => {
            return gencert((err, certDoc) => {
                if(err) return h.response().code(400);
                return h.response(certDoc).header('Content-type', 'application/pdf');
            });
        }
    }
]; 