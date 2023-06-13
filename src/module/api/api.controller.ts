import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
@Controller('demo')
export class ApiController {
    constructor(private apiService: ApiService) {}

    @Get('/')
    test() {
        return this.apiService.test();
    }
}
