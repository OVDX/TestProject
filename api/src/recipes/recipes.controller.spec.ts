import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RecipeListDto, RecipeDetailDto } from './dto/recipe.dto';

const mockRecipesService = {
  getRecipes: jest.fn(),
  getRecipeById: jest.fn(),
};

const mockRecipeList: RecipeListDto = {
  recipes: [
    { idMeal: '1', strMeal: 'Test Meal 1', strMealThumb: 'thumb1.jpg' },
  ],
  total: 1,
  filter: { type: 'all' },
};

const mockRecipeDetail: RecipeDetailDto = {
  id: '52772',
  name: 'Teriyaki Chicken Casserole',
  image: 'image.jpg',
  category: 'Chicken',
  area: 'Japanese',
  instructions: 'Some instructions...',
  ingredients: [{ name: 'Chicken', measure: '1 lb' }],
};

describe('RecipesController', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRecipes', () => {
    it('should return a list of recipes', async () => {
      mockRecipesService.getRecipes.mockResolvedValue(mockRecipeList);

      const query = { category: 'Chicken' };
      const result = await controller.getRecipes(query);

      expect(result).toEqual(mockRecipeList);
      expect(mockRecipesService.getRecipes).toHaveBeenCalledWith(query);
    });

    it('should throw an error if the service fails', async () => {
      const error = new Error('Service failed');
      mockRecipesService.getRecipes.mockRejectedValue(error);

      await expect(controller.getRecipes({})).rejects.toThrow(error);
    });
  });

  describe('getRecipeById', () => {
    it('should return a single recipe detail', async () => {
      mockRecipesService.getRecipeById.mockResolvedValue(mockRecipeDetail);

      const recipeId = '52772';
      const result = await controller.getRecipeById(recipeId);

      expect(result).toEqual(mockRecipeDetail);
      expect(mockRecipesService.getRecipeById).toHaveBeenCalledWith(recipeId);
    });

    it('should throw HttpException if id is empty', async () => {
      const emptyId = '';

      await expect(controller.getRecipeById(emptyId)).rejects.toThrow(
        new HttpException("ID рецепта є обов'язковим", HttpStatus.BAD_REQUEST),
      );

      expect(mockRecipesService.getRecipeById).not.toHaveBeenCalled();
    });

    it('should throw HttpException if recipe is not found', async () => {
      const error = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      mockRecipesService.getRecipeById.mockRejectedValue(error);

      await expect(controller.getRecipeById('unknown-id')).rejects.toThrow(
        error,
      );
    });
  });
});
