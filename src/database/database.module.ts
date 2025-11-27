import { Module } from '@nestjs/common';
import { MovieSeeder } from './seeders/movie.seeder';
import { MoviesModule } from '../movies/movies.module';
import { TmdbService } from '../movies/tmdb.service';

@Module({
  imports: [MoviesModule],
  providers: [MovieSeeder, TmdbService],
  exports: [MovieSeeder],
})
export class DatabaseModule {}
