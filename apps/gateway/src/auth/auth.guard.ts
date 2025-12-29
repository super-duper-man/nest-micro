import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { UserService } from './users/user.service';
import { REQUIRED_ROLE_KEY } from './admin.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly authService: AuthService, private userService: UserService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass
    ]);

    if (isPublic)
      return true;

    const req = context.switchToHttp().getRequest();

    const authorization = req.headers['authorization'];

    if (!authorization || typeof authorization !== 'string')
      throw new UnauthorizedException('Missing authorization header');

    const token = authorization.startsWith('Bearer ') ? authorization.slice('Bearer '.length).trim() : '';

    if (!token)
      throw new UnauthorizedException('Invalid token');

    const identifiedAuthUser = await this.authService.verifyAndBuildContext(token);

    const dbUser = await this.userService.UpsertUser({ clerkUserId: identifiedAuthUser.clerkUserId, email: identifiedAuthUser.email, name: identifiedAuthUser.name });

    const user = {
      ...identifiedAuthUser,
      role: dbUser.role,
    };

    //attach user to request
    req.user = user;

    const requiredRole = this.reflector.getAllAndOverride<string>(REQUIRED_ROLE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if(requiredRole === 'admin' && user.role !== 'admin')
      throw new ForbiddenException('Admin access required');

    return true;
  }
}
