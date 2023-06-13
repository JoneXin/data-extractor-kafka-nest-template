import { Module } from '@nestjs/common';
import { ApiModule } from './module/api/api.module';
import { TaskModule } from './module/sync_task/task.module';
import { DataExtractModule } from './module/data_extract/de.module';
import { KafkaProducerModule } from './module/producer_kafka/pk.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { mysqlConfig } from './config/mysql.config';

@Module({
    imports: [
        ApiModule,
        TaskModule,
        DataExtractModule,
        ...Object.values(mysqlConfig).map((seqConf) => SequelizeModule.forRoot(seqConf)),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
