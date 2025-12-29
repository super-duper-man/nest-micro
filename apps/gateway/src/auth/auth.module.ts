import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserModule } from './users/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    imports: [UserModule],
    providers: [AuthService, {
        provide: APP_GUARD,
        useClass: AuthGuard
    }],
    exports: [AuthService]
})
export class AuthModule {
}
