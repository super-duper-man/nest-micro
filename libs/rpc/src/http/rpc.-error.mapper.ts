import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RpcErrorCode } from "../rpc.types";

export function mapRpcErrorToHttp(err: any): never {
    const payload = err?.error ?? err;
    const code: RpcErrorCode | undefined = payload?.code as RpcErrorCode | undefined;
    const message = payload?.message ?? "Request failed!!!";

    switch(code){
        case 'BAD_REQUEST':
        case 'VALIDATION_ERROR':
            throw new BadRequestException(message);
        case 'NOT_FOUND':
            throw new NotFoundException(message);
        case 'UNAUTHORIZED':
            throw new UnauthorizedException(message);
        case 'FORBIDDEN':
            throw new ForbiddenException(message);
        default:
            throw new InternalServerErrorException(message);
    }
}