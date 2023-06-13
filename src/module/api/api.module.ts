import { Logger, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { DataExtractModule } from '../data_extract/de.module';

@Module({
    imports: [DataExtractModule],
    controllers: [ApiController],
    providers: [ApiService, Logger],
})
export class ApiModule {}
