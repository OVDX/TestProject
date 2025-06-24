import { IsOptional, IsString } from 'class-validator';

export class QueryRecipesDto {
  @IsOptional()
  @IsString()
  ingredient?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
