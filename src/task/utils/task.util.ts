import { Logger } from "@nestjs/common";
import { ServerResponse } from 'http';
import * as crypto from 'crypto';

// Extend ServerResponse to include locals property
interface ResponseWithLocals extends ServerResponse {
    locals?: {
        cspNonce?: string;
        [key: string]: any;
    };
}

export const formattedMessage = (message: string): string => {
    const logger = new Logger('prettier-message');
    logger.verbose(message + ' lalalalala');
    return message;
};


export const getOrCreateNonce = (res: ResponseWithLocals): string => {
    // if (!res.locals) res.locals = {};
    // if (!res.locals.cspNonce) {
    //     res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    //     res.setHeader('X-CSP-Nonce', res.locals.cspNonce);
    // }
    // const logger = new Logger('prettier-message');
    // logger.verbose(`'nonce-${res.locals.cspNonce}'`);
    // return `'nonce-${res.locals.cspNonce}'`;
    return `'nonce-1234'`;
}

export const provinceCodeDescription = {
    informaciondeprovincianodisponible: 'Información de provincia no disponible',
    ciudadautonomadebuenosaires: 'Ciudad de Buenos Aires',
    ciudaddebuenosaires: 'Ciudad de Buenos Aires',
    buenosaires: 'Buenos Aires',
    catamarca: 'Catamarca',
    cordoba: 'Córdoba',
}
