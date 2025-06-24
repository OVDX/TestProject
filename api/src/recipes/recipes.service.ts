import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { isAxiosError } from 'axios';
import {
  MealApiResponse,
  RecipeListItemDto,
  RecipeDetailDto,
  RecipeListDto,
  IngredientDto,
} from './dto/recipe.dto';
import { QueryRecipesDto } from './dto/querry-recipe.dto';

function extractIngredients(meal: MealApiResponse): IngredientDto[] {
  const ingredients: IngredientDto[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[
      `strIngredient${i}` as keyof MealApiResponse
    ] as string;
    const measure = meal[`strMeasure${i}` as keyof MealApiResponse] as string;

    if (ingredient?.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || '',
      });
    }
  }

  return ingredients;
}

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('MEAL_API_BASE_URL') ||
      'https://www.themealdb.com/api/json/v1/1';
  }

  async getRecipes(queryDto: QueryRecipesDto): Promise<RecipeListDto> {
    let url: string;
    let filterType: 'ingredient' | 'country' | 'category' | 'all' = 'all';
    let filterValue: string | undefined;

    if (queryDto.ingredient) {
      url = `${this.baseUrl}/filter.php?i=${encodeURIComponent(queryDto.ingredient)}`;
      filterType = 'ingredient';
      filterValue = queryDto.ingredient;
    } else if (queryDto.country) {
      url = `${this.baseUrl}/filter.php?a=${encodeURIComponent(queryDto.country)}`;
      filterType = 'country';
      filterValue = queryDto.country;
    } else if (queryDto.category) {
      url = `${this.baseUrl}/filter.php?c=${encodeURIComponent(queryDto.category)}`;
      filterType = 'category';
      filterValue = queryDto.category;
    } else if (queryDto.search) {
      url = `${this.baseUrl}/search.php?s=${encodeURIComponent(queryDto.search)}`;
      filterType = 'all';
      filterValue = queryDto.search;
    } else {
      url = `${this.baseUrl}/search.php?s=`;
      filterType = 'all';
    }

    try {
      this.logger.log(`Fetching recipes from: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get<{ meals: MealApiResponse[] }>(url, {
          timeout: 10000,
        }),
      );
      const meals: MealApiResponse[] = response.data.meals || [];
      if (!meals.length) {
        return {
          recipes: [],
          total: 0,
          filter: { type: filterType, value: filterValue },
        };
      }
      const recipes: RecipeListItemDto[] = meals.map((meal) => ({
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
      }));
      return {
        recipes,
        total: recipes.length,
        filter: { type: filterType, value: filterValue },
      };
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        this.logger.error(
          `Error fetching recipes. Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`,
        );
        throw new HttpException(
          `External API error: ${error.response.statusText}`,
          error.response.status,
        );
      } else if (error instanceof Error) {
        this.logger.error('Error fetching recipes:', error.message);
      } else {
        this.logger.error(
          'An unknown error occurred while fetching recipes:',
          error,
        );
      }
      throw new HttpException(
        'Failed to fetch recipes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRecipeById(id: string): Promise<RecipeDetailDto> {
    const url = `${this.baseUrl}/lookup.php?i=${encodeURIComponent(id)}`;

    try {
      this.logger.log(`Fetching recipe details from: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get<{ meals: MealApiResponse[] }>(url, {
          timeout: 10000,
        }),
      );
      const meals: MealApiResponse[] = response.data.meals;
      if (!meals || meals.length === 0) {
        throw new HttpException(
          `Recipe with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      const meal = meals[0];
      return this.transformToRecipeDetail(meal);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (isAxiosError(error) && error.response) {
        this.logger.error(
          `Error fetching recipe ${id}. Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`,
        );
        throw new HttpException(
          `External API error: ${error.response.statusText}`,
          error.response.status,
        );
      } else if (error instanceof Error) {
        this.logger.error(`Error fetching recipe ${id}:`, error.message);
      } else {
        this.logger.error(
          `An unknown error occurred while fetching recipe ${id}:`,
          error,
        );
      }

      throw new HttpException(
        'Failed to fetch recipe details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private transformToRecipeDetail(meal: MealApiResponse): RecipeDetailDto {
    const ingredients = extractIngredients(meal);

    return {
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      ingredients,
      tags: meal.strTags
        ? meal.strTags.split(',').map((tag) => tag.trim())
        : undefined,
      youtube: meal.strYoutube || undefined,
      source: meal.strSource || undefined,
    };
  }
}
