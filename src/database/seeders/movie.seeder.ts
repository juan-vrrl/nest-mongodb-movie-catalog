import { Injectable, Logger } from '@nestjs/common';
import { TmdbService, TmdbMovie } from '../../movies/tmdb.service';
import { MoviesService } from '../../movies/movies.service';
import { Movie } from '../../movies/schemas/movie.schema';

interface MovieWithId extends Movie {
  _id: { toString: () => string };
}

@Injectable()
export class MovieSeeder {
  private readonly logger = new Logger(MovieSeeder.name);

  constructor(
    private readonly tmdbService: TmdbService,
    private readonly moviesService: MoviesService,
  ) {}

  async seed(pages = 5): Promise<void> {
    this.logger.log('Starting movie seeding...');

    try {
      for (let page = 1; page <= pages; page++) {
        this.logger.log(`Fetching page ${page} from TMDB...`);

        const response = await this.tmdbService.fetchPopularMovies(page);
        const tmdbMovies: TmdbMovie[] = response.results;

        for (const tmdbMovie of tmdbMovies) {
          try {
            // Check if movie already exists by tmdbId
            const existingMovies =
              (await this.moviesService.findAll()) as MovieWithId[];
            const exists = existingMovies.some(
              (movie) => movie.tmdbId === tmdbMovie.id,
            );

            if (exists) {
              this.logger.debug(
                `Movie "${tmdbMovie.title}" already exists, skipping...`,
              );
              continue;
            }

            // Map and create movie
            const movieData = this.tmdbService.mapToMovieSchema(tmdbMovie);
            await this.moviesService.create(movieData);
            this.logger.log(`Created movie: ${tmdbMovie.title}`);
          } catch (error) {
            this.logger.error(
              `Failed to seed movie: ${tmdbMovie.title}`,
              error,
            );
          }
        }
      }

      this.logger.log('Movie seeding completed successfully!');
    } catch (error) {
      this.logger.error('Movie seeding failed', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.logger.log('Clearing all movies from database...');
    try {
      const movies = (await this.moviesService.findAll()) as MovieWithId[];
      for (const movie of movies) {
        const movieId: string = movie._id.toString();
        await this.moviesService.remove(movieId);
      }
      this.logger.log('All movies cleared successfully!');
    } catch (error) {
      this.logger.error('Failed to clear movies', error);
      throw error;
    }
  }
}
