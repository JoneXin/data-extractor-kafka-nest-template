import { WinstonModule } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { LoggerService, LogLevel } from '@nestjs/common';
import 'winston-daily-rotate-file';

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.printf((i) => `${[i.timestamp]} [${i.level}]: ${i.message}`),
);

const defaultOptions = {
    format: customFormat,
    datePattern: 'YYYY-MM-DD',
    maxSize: '2g',
    maxFiles: '7d',
    dirname: './logs/',
};

//打印格式化
const print_format = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('rts_backend', {
            colors: true,
            prettyPrint: true,
        }),
    ),
    level: 'debug',
});

// 标准输出日志持久化
const presis_info = new winston.transports.DailyRotateFile({
    filename: 'logs/info-%DATE%.log',
    level: 'info',
    ...defaultOptions,
});

// 错误日志持久化
const presis_err = new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    ...defaultOptions,
});

export class LpLogger implements LoggerService {
    private logger: LoggerService;

    constructor() {
        this.logger = WinstonModule.createLogger({
            format: customFormat,
            transports: [print_format, presis_info, presis_err],
        });
    }
    log(message: any, ...optionalParams: any[]) {
        this.logger.log(message, ...optionalParams);
    }
    error(message: any, ...optionalParams: any[]) {
        this.logger.error(message, ...optionalParams);
    }
    warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, ...optionalParams);
    }
    debug?(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, ...optionalParams);
    }
    verbose?(message: any, ...optionalParams: any[]) {
        this.logger.verbose(message, ...optionalParams);
    }
    setLogLevels?(levels: LogLevel[]) {
        this.logger.setLogLevels(levels);
    }
}
