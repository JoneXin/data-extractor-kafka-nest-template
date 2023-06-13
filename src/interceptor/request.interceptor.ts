/*
https://docs.nestjs.com/interceptors#interceptors
*/
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Request, Response, query } from 'express';
import { map } from 'rxjs/operators';
import { ResponseMessage } from './api.transform.class';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
    constructor() {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const host = context.switchToHttp();
        const req = context.switchToHttp().getRequest();
        return next.handle().pipe(
            map(async (data) => {
                if (!data) return null;
                const response = context.switchToHttp().getResponse();
                console.log(req.url);

                // 图片流返回
                if (data.directives) {
                    response.set({ 'Content-Type': 'image/png' });
                    response.send(data.image);
                } else if (req.url == '/api/status' && req.method == 'GET') {
                    console.log(2);

                    return data;
                } else {
                    // json 返回
                    response.header('Content-Type', 'application/json; charset=utf-8');
                    return ResponseMessage.success(data);
                }
            }),
        );
    }
}
