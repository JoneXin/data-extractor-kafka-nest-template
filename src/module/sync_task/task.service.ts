import { systemSettings } from '../../config/sys.config';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataExtractService } from '../data_extract/de.service';

@Injectable()
export class TaskService {
    constructor(private dataExtractService: DataExtractService) {}

    @Cron(systemSettings.task['demo_task'].sync_delay)
    demoTask() {
        this.dataExtractService.demoTask();
    }
}
