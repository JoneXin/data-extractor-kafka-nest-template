import { Logger, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { DataExtractModule } from '../data_extract/de.module';

@Module({
    imports: [DataExtractModule],
    controllers: [TaskController],
    providers: [TaskService, Logger],
})
export class TaskModule {}
