
import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { DeviceTypeInterceptor } from '../interceptor/deviceDetector';

@Controller('check-device')
@UseInterceptors(DeviceTypeInterceptor)
export class DeviceController {
    @Get()
    getDevice(@Req() req: Request) {
        return { deviceType: req['deviceType'] }; // mobile, tablet, or desktop
    }
}
