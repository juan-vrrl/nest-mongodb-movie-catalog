import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET') || 'your-secret-key';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.logger.log(
      `JWT Strategy initialized with secret from ConfigService: ${secret}`,
    );
  }

  async validate(payload: JwtPayload) {
    this.logger.log('Validating JWT payload');
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    try {
      const user = await this.authService.validateUser(payload);

      if (!user) {
        this.logger.error(`User not found for ID: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }

      this.logger.log(`User validated successfully: ${payload.email}`);
      return {
        _id: payload.sub,
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      this.logger.error('JWT validation failed:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
