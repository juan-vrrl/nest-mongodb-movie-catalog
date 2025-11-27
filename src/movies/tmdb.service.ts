import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TmdbService {
  private readonly apiUrl = process.env.TMDB_API_URL;
  private readonly apiKey = process.env.TMDB_API_KEY;

  async fetchPopularMovies(page = 1) {
    const response = await axios.get(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'en-US',
        page,
      },
    });

    return response.data;
  }

  mapToMovieSchema(tmdbMovie: any) {
    return {
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      genres: tmdbMovie.genre_ids?.map((id: number) => id.toString()) ?? [],
      releaseDate: tmdbMovie.release_date,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      tmdbId: tmdbMovie.id,
      rating: tmdbMovie.vote_average,
    };
  }
}
