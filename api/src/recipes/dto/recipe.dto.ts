import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface MealApiResponse {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strSource?: string;
  strImageSource?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
  // Там 20 інгредієнтів та їх measure тому виніс їх динамічно щоб не портити вигляд класу
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

export class RecipeDto {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strSource?: string;

  static fromApiToDto(apiData: MealApiResponse): RecipeDto {
    return {
      idMeal: apiData.idMeal,
      strMeal: apiData.strMeal,
      strCategory: apiData.strCategory,
      strArea: apiData.strArea,
      strInstructions: apiData.strInstructions,
      strMealThumb: apiData.strMealThumb,
      strTags: apiData.strTags,
      strYoutube: apiData.strYoutube,
      strSource: apiData.strSource,
    };
  }
}

export class RecipeListItemDto {
  @ApiProperty({ description: 'ID страви.', example: '1' })
  idMeal: string;

  @ApiProperty({
    description: 'Назва страви.',
    example: 'Teriyaki Chicken Casserole',
  })
  strMeal: string;

  @ApiProperty({
    description: 'URL для thumbnail картинки страви.',
    example:
      'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
  })
  strMealThumb: string;
}

export class IngredientDto {
  @ApiProperty({
    description: 'Назва інгредієнту.',
    example: 'Chicken',
  })
  name: string;

  @ApiProperty({
    description: 'Міри інгредієнту.',
    example: '1 lb',
  })
  measure: string;
}

export class RecipeDetailDto {
  @ApiProperty({ description: 'ID страви.', example: '1' })
  id: string;

  @ApiProperty({
    description: 'Назва.',
    example: 'Teriyaki Chicken Casserole',
  })
  name: string;

  @ApiProperty({
    description: 'URL картинки.',
    example:
      'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
  })
  image: string;

  @ApiProperty({ description: 'Категорія страви.', example: 'Chicken' })
  category: string;

  @ApiProperty({
    description: 'Країна страви.',
    example: 'Japanese',
  })
  area: string;

  @ApiProperty({
    description: 'Інструкція для приготування.',
  })
  instructions: string;

  @ApiProperty({
    type: [IngredientDto],
    description: 'Список інгредієнтів.',
  })
  ingredients: IngredientDto[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Теги страви.',
    example: ['Chicken', 'Casserole'],
  })
  tags?: string[];
  @ApiPropertyOptional({
    description: 'URL на youtube.',
    example: 'https://www.youtube.com/watch?v=gOU1uZH1C1E',
  })
  youtube?: string;

  @ApiPropertyOptional({
    description: 'URL на оригінальне посилання.',
  })
  source?: string;
}

class RecipeListFilterDto {
  @ApiProperty({
    enum: ['ingredient', 'country', 'category', 'all'],
    description: 'тип фільтру.',
  })
  type: 'ingredient' | 'country' | 'category' | 'all';

  @ApiPropertyOptional()
  value?: string;
}

export class RecipeListDto {
  @ApiProperty({
    type: [RecipeListItemDto],
  })
  recipes: RecipeListItemDto[];

  @ApiProperty({
    example: 15,
  })
  total: number;
  @ApiPropertyOptional({
    type: RecipeListFilterDto,
  })
  filter?: RecipeListFilterDto;
}
