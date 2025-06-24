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

@Controller('recipes')
export class RecipesController {
  private readonly logger = new Logger(RecipesController.name);

  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async getRecipes(@Query() queryDto: QueryRecipesDto): Promise<RecipeListDto> {
    this.logger.log(`GET /recipes with filters:`, queryDto);

    try {
      return await this.recipesService.getRecipes(queryDto);
    } catch (error) {
      this.logger.error('Error in getRecipes:', error.message);
      throw error;
    }
  }

  @Get(':id')
  async getRecipeById(@Param('id') id: string): Promise<RecipeDetailDto> {
    this.logger.log(`GET /recipes/${id}`);

    if (!id || id.trim() === '') {
      throw new HttpException('Recipe ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.recipesService.getRecipeById(id);
    } catch (error) {
      this.logger.error(`Error in getRecipeById for ID ${id}:`, error.message);
      throw error;
    }
  }

  @Get('category/:category')
  async getRecipesByCategory(
    @Param('category') category: string,
  ): Promise<RecipeListDto> {
    this.logger.log(`GET /recipes/category/${category}`);

    if (!category || category.trim() === '') {
      throw new HttpException('Category is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.recipesService.getRecipesByCategory(category);
    } catch (error) {
      this.logger.error(
        `Error in getRecipesByCategory for category ${category}:`,
        error.message,
      );
      throw error;
    }
  }
}
