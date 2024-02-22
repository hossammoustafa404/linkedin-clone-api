import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RequestWithUser } from 'src/shared/interfaces';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    // Get request object
    const request: RequestWithUser = context.switchToHttp().getRequest();

    // Get user role
    const userRole = request.user.role;

    // Get allowed roles
    const roles = this.reflector.get('roles', context.getHandler());

    // Throw an error if user is not allowed to do the action
    if (!roles.includes(userRole)) {
      throw new ForbiddenException(
        `${userRole} is not allowed to do this action`,
      );
    }

    // Go to the next step in the req/res cycle
    return true;
  }
}
