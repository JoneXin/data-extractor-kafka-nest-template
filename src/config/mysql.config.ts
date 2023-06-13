import { SequelizeModuleOptions } from '@nestjs/sequelize';
const mysqlConf = require('../../config/mysql.config.json');
const SeqConf = {
    dialect: 'mysql',
    timezone: '+08:00',
    name: 'slit',
    logging: false,
    query: { raw: true },
    autoLoadModels: true,
};
enum SourceType {
    demo = 'demo',
}

type MysqlConf = Record<SourceType, SequelizeModuleOptions>;

export const mysqlConfig: MysqlConf = {
    demo: {
        ...mysqlConf.demo,
        ...SeqConf,
    },
};
