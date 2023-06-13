import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setSwaggerDocument = (app: INestApplication) => {
    const options = new DocumentBuilder()
        .setTitle('接口文档')
        .setDescription('《spug node api服务端》接口文档')
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/doc', app, document);
};
