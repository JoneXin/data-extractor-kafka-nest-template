import * as Monitor from 'appmetrics-dash';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { systemSettings } from './config/sys.config';
import { LpLogger } from './lib/logger';
import * as bodyParser from 'body-parser';
import { setSwaggerDocument } from './utils/swagger';
import { ValidationPipe } from '@nestjs/common';
import { RequestInterceptor } from './interceptor/request.interceptor';
import { monitorConfig } from './config/monitor.config';
import * as serveStatic from 'serve-static';
import { join } from 'path';

async function bootstrap() {
    Monitor.attach(monitorConfig);

    const app = await NestFactory.create(AppModule, {
        logger: new LpLogger(),
    });

    app.use(serveStatic(join(__dirname, '../public')));

    // app.setGlobalPrefix('');

    app.enableCors();

    app.use(bodyParser.json({ limit: '500mb' }));

    setSwaggerDocument(app);

    app.useGlobalInterceptors(new RequestInterceptor());

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.listen(systemSettings.app.port, '0.0.0.0', () => {
        console.log(`server running success in http://127.0.0.1:${systemSettings.app.port}`);
        console.log(`swagger document running in http://127.0.0.1:${systemSettings.app.port}/doc`);
        console.log(`monitor attach running in http://127.0.0.1:/${monitorConfig.url}`);
    });
}

bootstrap();
