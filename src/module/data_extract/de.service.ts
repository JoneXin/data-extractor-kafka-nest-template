import { KafkaProducerService } from './../producer_kafka/pk.service';
import { Injectable, Logger } from '@nestjs/common';
import { ScheduleQueue } from '../../utils/queue';

@Injectable()
export class DataExtractService {
    private taskQueue: ScheduleQueue;

    constructor(private logger: Logger, private kafkaProducerService: KafkaProducerService) {
        this.taskQueue = new ScheduleQueue('task-queue');
    }

    // 持久化配置
    demoTask() {}
}
