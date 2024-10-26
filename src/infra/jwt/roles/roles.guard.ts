import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

// import { Permissions } from '@/shared/enum/permissions';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: FastifyRequest = context.switchToHttp().getRequest();

    // const route = request?.routeOptions?.url || request.url;
    // const method = request.method.toLowerCase();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException(
        'Missing Authorization Token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      this.jwtService.verify(token) as any;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException(
          'Authorization Token Expired',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (error instanceof JsonWebTokenError) {
        throw new HttpException(
          'Invalid Authorization Token',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          'Invalid Authorization Token',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    const user = this.jwtService.decode(token) as any;
    if (!user) {
      throw new HttpException(
        'Invalid or Expired Authorization Token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // const roles = user.roles as string[];
    // const permissions = user.permissions as string[];
    // const accessCheck = this.hasAccess(route, method, roles, permissions);
    const accessCheck = 'Access Granted';
    if (accessCheck === 'Access Granted') {
      return true;
    } else {
      throw new HttpException(accessCheck, HttpStatus.FORBIDDEN);
    }
  }

  private hasAccess(
    route: string,
    method: string,
    roles: string[],
    permissions: string[],
  ): string {
    if (roles.includes('ADM')) {
      return 'Access Granted';
    }

    const withdrawalRoutes = [
      '/withdraw/payout-manual',
      '/withdraw/pending',
      '/withdraw/check',
    ];

    const withdrawalPermissions = {
      post: 'withdrawal-write',
      get: 'withdrawal-read',
      delete: 'withdrawal-delete',
    };

    if (withdrawalRoutes.some((r) => route.startsWith(r))) {
      if (
        roles.includes('WITHDRAWAL') &&
        permissions.includes(withdrawalPermissions[method])
      ) {
        return 'Access Granted';
      } else {
        return 'Access denied: WITHDRAWAL role required with appropriate permissions';
      }
    }

    // const cmsRoutes = [
    //   '/pay-keys',
    //   '/pay-keys-transactions',
    //   '/products',
    //   '/tags',
    //   '/payments',
    //   '/webhooks',
    //   '/account',
    //   '/withdraw',
    // ];

    // const cmsPermissions = {
    //   post: Permissions.CMS_WRITE,
    //   get: Permissions.CMS_READ,
    //   delete: Permissions.CMS_DELETE,
    //   patch: Permissions.CMS_WRITE,
    // };

    // const postRoutes = ['/posts'];

    // const postPermissions = {
    //   post: Permissions.POST_WRITE,
    //   get: Permissions.POST_READ,
    //   delete: Permissions.POST_DELETE,
    //   patch: Permissions.POST_WRITE,
    // };

    // if (cmsRoutes.some((r) => route.startsWith(r))) {
    //   if (
    //     roles.includes('CMS') &&
    //     permissions.includes(cmsPermissions[method])
    //   ) {
    //     return 'Access Granted';
    //   } else {
    //     return 'Access denied: CMS role required with appropriate permissions';
    //   }
    // }

    // if (postRoutes.some((r) => route.startsWith(r))) {
    //   if (
    //     roles.includes('Post') &&
    //     permissions.includes(postPermissions[method])
    //   ) {
    //     return 'Access Granted';
    //   } else {
    //     return 'Access denied: Post role required with appropriate permissions';
    //   }
    // }

    this.logger.debug('Access denied: No matching roles or permissions found');
    return 'Access denied: No matching roles or permissions found';
  }
}
