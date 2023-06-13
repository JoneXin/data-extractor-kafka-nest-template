import { KafkaTopic, SysConfType, systemSettings } from '../../config/sys.config';
import { Injectable, Logger } from '@nestjs/common';
import { Kafka, KafkaConfig, Producer } from 'kafkajs';
import { KafkaDataonf } from '../../typing';

@Injectable()
export class KafkaProducerService {
    private kafkaProducer: Producer;
    private kafkaProducerOpt: KafkaConfig;

    constructor(private readonly logger: Logger) {
        this.kafkaProducerOpt = systemSettings.kafka_config;
        this.initKafka();
    }

    // 初始化kafka
    private async initKafka() {
        try {
            const kafka = new Kafka(this.kafkaProducerOpt);
            this.kafkaProducer = kafka.producer();
            await this.kafkaProducer.connect();
            this.logger.log('init kafka producer success!');
        } catch (e: any) {
            this.logger.error(e, e?.stack, KafkaProducerService.name);
        }
    }

    // 数据上报到kafka
    async send<T extends KafkaDataonf>(msg: T, topic: KafkaTopic): Promise<boolean> {
        try {
            await this.kafkaProducer.send({
                topic,
                messages: [
                    {
                        value: JSON.stringify(msg),
                    },
                ],
            });
            return true;
        } catch (e) {
            this.logger.error(e);
            return false;
        }
    }
}
