import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryRecipesDto {
  @ApiPropertyOptional({
    description: 'Фільтр по інгредієнту.',
    example: 'chicken_breast',
  })
  @IsOptional()
  @IsString()
  ingredient?: string;

  @ApiPropertyOptional({
    description: 'Фільтр по країні.',
    example: 'Canadian',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Фільтр по категорії.',
    example: 'Seafood',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Пошук по назві.',
    example: 'Arrabiata',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
