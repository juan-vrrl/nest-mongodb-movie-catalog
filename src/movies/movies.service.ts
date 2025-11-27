import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<MovieDocument>,
  ) {}

  private readonly logger = new Logger(MoviesService.name);

  async findAll() {
    try {
      const movies = await this.movieModel.find().exec();
      return movies;
    } catch (error) {
      this.logger.error('Failed to retrieve movies', error);
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
