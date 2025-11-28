import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: User,
  ) {
    const userId = String((user as any)._id);
    const review = await this.reviewsService.create(createReviewDto, userId);

    return {
      message: 'Review created successfully',
      data: review,
    };
  }

  @Get()
  async findAll(@Query('movieId') movieId?: string) {
    let reviews;

    if (movieId) {
      reviews = await this.reviewsService.findByMovie(movieId);
    } else {
      reviews = await this.reviewsService.findAll();
    }

    return {
      message: 'Reviews retrieved successfully',
      data: reviews,
    };
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  async findMyReviews(@CurrentUser() user: User) {
    const userId = String((user as any)._id);
    const reviews = await this.reviewsService.findByUser(userId);

    return {
      message: 'Your reviews retrieved successfully',
      data: reviews,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(id);

    return {
      message: 'Review retrieved successfully',
      data: review,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: User,
  ) {
    const userId = String((user as any)._id);
    const review = await this.reviewsService.update(
      id,
      updateReviewDto,
      userId,
    );

    return {
      message: 'Review updated successfully',
      data: review,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    const userId = String((user as any)._id);
    await this.reviewsService.delete(id, userId, user.role);

    return {
      message: 'Review deleted successfully',
    };
  }
}
