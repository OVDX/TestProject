import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipeListDto, RecipeDetailDto } from './dto/recipe.dto';
import { QueryRecipesDto } from './dto/querry-recipe.dto';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Рецепти')
@Controller('recipes')
export class RecipesController {
  private readonly logger = new Logger(RecipesController.name);

  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список рецептів за фільтрами' })
  @ApiResponse({
    status: 200,
    description: 'Рецепти успішно отримано.',
    type: RecipeListDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера. Не вдалося отримати рецепти.',
  })
  async getRecipes(@Query() queryDto: QueryRecipesDto): Promise<RecipeListDto> {
    this.logger.log(`GET /recipes with filters:`, queryDto);

    try {
      return await this.recipesService.getRecipes(queryDto);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error in getRecipes:', error.message);
      } else {
        this.logger.error('An unknown error occurred in getRecipes:', error);
      }
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати один рецепт за його ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID рецепта',
    example: '52772',
  })
  @ApiResponse({
    status: 200,
    description: 'Деталі рецепта успішно отримано.',
    type: RecipeDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: "Невірний запит. ID рецепта є обов'язковим.",
  })
  @ApiResponse({
    status: 404,
    description: 'Не знайдено. Рецепт із вказаним ID не знайдено.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Внутрішня помилка сервера. Не вдалося отримати деталі рецепта.',
  })
  async getRecipeById(@Param('id') id: string): Promise<RecipeDetailDto> {
    this.logger.log(`GET /recipes/${id}`);

    if (!id || id.trim() === '') {
      throw new HttpException(
        "ID рецепта є обов'язковим",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.recipesService.getRecipeById(id);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error in getRecipeById for ID ${id}:`,
          error.message,
        );
      } else {
        this.logger.error(
          `An unknown error occurred in getRecipeById for ID ${id}:`,
          error,
        );
      }
      throw error;
    }
  }
}
