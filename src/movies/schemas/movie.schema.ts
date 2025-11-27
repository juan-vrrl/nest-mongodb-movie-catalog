import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  overview: string;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop()
  releaseDate: string;

  @Prop()
  posterPath: string;

  @Prop()
  backdropPath: string;

  @Prop()
  tmdbId: number;

  @Prop()
  rating: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
