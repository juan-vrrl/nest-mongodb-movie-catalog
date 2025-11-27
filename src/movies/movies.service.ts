import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';

export interface FindAllOptions {
  search?: string;
  genre?: string;
  sortBy?: 'title' | 'rating' | 'releaseDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult {
  movies: Movie[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<MovieDocument>,
  ) {}

  private readonly logger = new Logger(MoviesService.name);

  async findAll(options: FindAllOptions = {}): Promise<PaginatedResult> {
    try {
      const {
        search,
        genre,
        sortBy = 'releaseDate',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = options;

      // Build query filter
      const filter: FilterQuery<MovieDocument> = {};

      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      if (genre) {
        filter.genres = { $in: [genre] };
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      };

      // Execute query with pagination
      const [movies, total] = await Promise.all([
        this.movieModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        this.movieModel.countDocuments(filter).exec(),
      ]);

      return {
        movies,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve movies', error);
      throw error;
    }
  }

  async findAllWithoutPagination(): Promise<Movie[]> {
    try {
      const movies = await this.movieModel.find().exec();
      return movies;
    } catch (error) {
      this.logger.error('Failed to retrieve all movies', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const movie = await this.movieModel.findById(id).exec();
      return movie;
    } catch (error) {
      this.logger.error(`Failed to retrieve movie with id ${id}`, error);
      throw error;
    }
  }

  async create(data: Partial<Movie>) {
    try {
      const movie = await this.movieModel.create(data);
      return movie;
    } catch (error) {
      this.logger.error('Failed to create movie', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Movie>) {
    try {
      const movie = await this.movieModel
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
      return movie;
    } catch (error) {
      this.logger.error(`Failed to update movie with id ${id}`, error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const movie = await this.movieModel.findByIdAndDelete(id).exec();
      return movie;
    } catch (error) {
      this.logger.error(`Failed to delete movie with id ${id}`, error);
      throw error;
    }
  }
}
