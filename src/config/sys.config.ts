import { resolve } from 'path';
const sysConf = require('../../config/sys.config.json');
import { KafkaConfig } from 'kafkajs';

type TaskType = {
    sync_delay: string;
    is_open_sync: string;
    kafka_topic: KafkaTopic;
};

// topic list
export enum KafkaTopic {
    demoTask = 'demo_task',
}

export type SysConfType = {
    app: {
        name: string;
        port: number;
    };
    task: Record<KafkaTopic, TaskType>;
    kafka_config: KafkaConfig;
    logs_conf: {
        max_size: string;
        max_files: string;
        storage_dir: string;
    };
};

// 系统配置
export const systemSettings: SysConfType = {
    ...sysConf,
    kafka_config: {
        ...sysConf.kafka_config,
        clientId: process.env.KAFKA_CLIENT_ID || sysConf.kafka_config.clientId,
        brokers: process.env.KAFKA_BROKERS || sysConf.kafka_config.brokers,
    },
    logs_conf: {
        max_size: '2g',
        max_files: '7d',
        storage_dir: '../logs/sqlite-task-server',
    },
};
