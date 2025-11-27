import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(
    email: string,
    password: string,
    name: string,
    role?: string,
  ): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        name,
        role,
      });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(`Failed to find user with email ${email}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      this.logger.error(`Failed to find user with id ${id}`, error);
      throw error;
    }
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
