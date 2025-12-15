
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class DeviceTypeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const userAgent = request.headers['user-agent'] as string;
        console.log('LEOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        console.log('User-Agent DAATAAAA:', userAgent);

        const parserInstance = new UAParser();
        parserInstance.setUA(userAgent);
        console.log('Parser InstanceAAAAAAAAA:', parserInstance.getResult());

        const parser = UAParser(userAgent);
        console.log('Parsed Device Info:', parser);
        const deviceType = parser.device.type || 'NO HAY NADAAA'; // defaults to desktop if null
        const osName = parser.os.name || 'NO LO SEEEEE';
        console.log('Parsed Device Info:', osName);
        // Attach device info to request for later use
        request.deviceType = deviceType;

        return next.handle();
    }
}
