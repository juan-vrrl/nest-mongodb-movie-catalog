import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.log(
      `Auth header: ${authHeader ? authHeader.substring(0, 20) + '...' : 'MISSING'}`,
    );

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.log('HandleRequest called');

    if (info) {
      this.logger.error(`JWT Error: ${info.message || info.name}`);
      this.logger.error(`Info details: ${JSON.stringify(info)}`);
    }

    if (err) {
      this.logger.error('Authentication error:', err);
      throw err;
    }

    if (!user) {
      this.logger.error('No user returned from strategy');
      throw new UnauthorizedException('Invalid token or user not found');
    }

    this.logger.log(`User authenticated: ${user.email}`);
    return user;
  }
}
