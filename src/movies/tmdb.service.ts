import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';

export interface TmdbMovie {
  title: string;
  overview: string;
  genre_ids: number[];
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  id: number;
  vote_average: number;
}

interface TmdbResponse {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}

@Injectable()
export class TmdbService implements OnModuleInit {
  private readonly apiUrl = process.env.TMDB_API_URL;
  private readonly apiKey = process.env.TMDB_API_KEY;
  private genreMap: Record<number, string> = {};

  async onModuleInit() {
    await this.loadGenres();
  }

  private async loadGenres(): Promise<void> {
    try {
      const response = await axios.get(`${this.apiUrl}/genre/movie/list`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
        },
      });

      const genres = response.data.genres as Array<{
        id: number;
        name: string;
      }>;
      this.genreMap = genres.reduce(
        (map, genre) => {
          map[genre.id] = genre.name;
          return map;
        },
        {} as Record<number, string>,
      );
    } catch (error) {
      console.error('Failed to load genres from TMDB:', error);
      // Fallback to hardcoded genres if API fails
      this.genreMap = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
      };
    }
  }

  async fetchPopularMovies(page = 1): Promise<TmdbResponse> {
    const response = await axios.get<TmdbResponse>(
      `${this.apiUrl}/movie/popular`,
      {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          page,
        },
      },
    );

    return response.data;
  }

  private mapGenreIdsToNames(genreIds: number[]): string[] {
    return genreIds
      .map((id) => this.genreMap[id])
      .filter((name) => name !== undefined);
  }

  mapToMovieSchema(tmdbMovie: TmdbMovie) {
    return {
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      genres: this.mapGenreIdsToNames(tmdbMovie.genre_ids ?? []),
      releaseDate: tmdbMovie.release_date,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      tmdbId: tmdbMovie.id,
      rating: tmdbMovie.vote_average,
    };
  }
}
