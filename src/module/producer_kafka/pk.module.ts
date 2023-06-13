import { Module } from '@nestjs/common';
import { KafkaProducerController } from './pk.controller';
import { KafkaProducerService } from './pk.service';
import { Logger } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [KafkaProducerController],
    providers: [KafkaProducerService, Logger],
    exports: [KafkaProducerService],
})
export class KafkaProducerModule {}
