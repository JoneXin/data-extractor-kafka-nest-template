import { Module } from '@nestjs/common';
import { ApiModule } from './module/api/api.module';
import { TaskModule } from './module/sync_task/task.module';
import { DataExtractModule } from './module/data_extract/de.module';
import { KafkaProducerModule } from './module/producer_kafka/pk.module';

@Module({
    imports: [ApiModule, TaskModule, DataExtractModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
