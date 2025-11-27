import { Injectable, Logger } from '@nestjs/common';
import { TmdbService } from '../tmdb.service';
import { MoviesService } from '../movies.service';
import { Movie } from '../schemas/movie.schema';

interface TmdbMovie {
  title: string;
  overview: string;
  genre_ids: number[];
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  id: number;
  vote_average: number;
}

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
      // Fetch all existing movies once at the start
      const existingMovies =
        (await this.moviesService.findAllWithoutPagination()) as MovieWithId[];
      const existingTmdbIds = new Set(
        existingMovies.map((movie) => movie.tmdbId),
      );
      this.logger.log(
        `Found ${existingTmdbIds.size} existing movies in database`,
      );

      for (let page = 1; page <= pages; page++) {
        this.logger.log(`Fetching page ${page} from TMDB...`);

        const response = await this.tmdbService.fetchPopularMovies(page);
        const tmdbMovies: TmdbMovie[] = response.results;

        for (const tmdbMovie of tmdbMovies) {
          try {
            // Check if movie already exists using the Set (O(1) lookup)
            if (existingTmdbIds.has(tmdbMovie.id)) {
              this.logger.debug(
                `Movie "${tmdbMovie.title}" already exists, skipping...`,
              );
              continue;
            }

            // Map and create movie
            const movieData = this.tmdbService.mapToMovieSchema(tmdbMovie);
            await this.moviesService.create(movieData);
            // Add to Set to prevent duplicates within same seeding run
            existingTmdbIds.add(tmdbMovie.id);
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
      const movies =
        (await this.moviesService.findAllWithoutPagination()) as MovieWithId[];
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
