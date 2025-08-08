import { ExceptionFilter, Catch, HttpException, NotFoundException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';


@Catch(NotFoundException)
export class CustomNotFoundException implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const message = exception.getResponse() as { message: string };

        response.status(status).json({
            statusCode: status,
            message: 'Resource not found',
        });
    }
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const message = exception.getResponse() as { message: string };

        response.status(status).json({
            statusCode: status,
            message: message.message || 'Internal Server Error',
        });
    }
}
