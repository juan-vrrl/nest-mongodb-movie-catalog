import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  overview?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  posterPath?: string;

  @IsOptional()
  @IsString()
  backdropPath?: string;

  @IsOptional()
  @IsNumber()
  tmdbId?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;
}
