import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() query: QueryMovieDto) {
    const { movies, metadata } = await this.moviesService.findAll(query);

    return {
      message: 'Movies retrieved successfully',
      data: movies,
      metadata,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(id);

    return {
      message: 'Movie retrieved successfully',
      data: movie,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateMovieDto) {
    const movie = await this.moviesService.create(body);

    return {
      message: 'Movie created successfully',
      data: movie,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    const movie = await this.moviesService.update(id, body);

    return {
      message: 'Movie updated successfully',
      data: movie,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const movie = await this.moviesService.remove(id);

    return {
      message: 'Movie deleted successfully',
      data: movie,
    };
  }
}
