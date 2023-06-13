import { KafkaProducerModule } from './../producer_kafka/pk.module';
import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DataExtractController } from './de.controller';
import { DataExtractService } from './de.service';

@Module({
    imports: [SequelizeModule.forFeature([], 'station_1'), KafkaProducerModule],
    controllers: [DataExtractController],
    providers: [DataExtractService, Logger],
    exports: [DataExtractService],
})
export class DataExtractModule {}
