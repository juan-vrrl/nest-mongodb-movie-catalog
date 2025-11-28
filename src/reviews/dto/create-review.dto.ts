import { IsString, IsNumber, Min, Max, IsMongoId } from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  movie: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
