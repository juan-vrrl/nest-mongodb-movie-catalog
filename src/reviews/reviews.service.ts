import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Review> {
    // Check if user already reviewed this movie
    const existingReview = await this.reviewModel.findOne({
      user: userId,
      movie: createReviewDto.movie,
    });

    if (existingReview) {
      throw new ConflictException(
        'You have already reviewed this movie. Use update instead.',
      );
    }

    const review = new this.reviewModel({
      ...createReviewDto,
      user: userId,
    });

    return await review.save();
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewModel
      .find()
      .populate('user', 'name email')
      .populate('movie', 'title')
      .exec();
  }

  async findByMovie(movieId: string): Promise<Review[]> {
    return await this.reviewModel
      .find({ movie: movieId })
      .populate('user', 'name email')
      .exec();
  }

  async findByUser(userId: string): Promise<Review[]> {
    return await this.reviewModel
      .find({ user: userId })
      .populate('movie', 'title poster releaseDate')
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('user', 'name email')
      .populate('movie', 'title')
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if the user owns this review
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const reviewUserId = review.user.toString();
    if (reviewUserId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate('user', 'name email')
      .populate('movie', 'title')
      .exec();

    if (!updatedReview) {
      throw new NotFoundException('Review not found');
    }

    return updatedReview;
  }

  async delete(id: string, userId: string, userRole: string): Promise<void> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Allow user to delete their own review or admin to delete any review
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const reviewUserId = review.user.toString();
    if (reviewUserId !== userId && userRole !== 'admin') {
      throw new ForbiddenException(
        'You can only delete your own reviews unless you are an admin',
      );
    }

    await this.reviewModel.findByIdAndDelete(id);
  }
}
