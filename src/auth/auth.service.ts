import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    role?: string,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const user = await this.usersService.create(email, password, name, role);

    const payload: JwtPayload = {
      sub: (user as any)._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: (user as any)._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return await this.usersService.findById(payload.sub);
  }
}
