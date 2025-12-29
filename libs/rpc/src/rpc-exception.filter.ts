import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { Request, Response } from "express";
import { RpcErrorPayload } from "./rpc.types";

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        if (exception instanceof RpcException) {
            return super.catch(exception, host);
        }

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = (exception as HttpException).getStatus();

        switch (status) {
            case 400: {
                const payload: RpcErrorPayload = {
                    code: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: response
                };

                return super.catch(new RpcException(payload), host);
            }

            default:
                const payload: RpcErrorPayload = {
                    code: 'INTERNAL',
                    message: 'Internal server error!',
                };
                return super.catch(new RpcException(payload), host);
        }
    }
}