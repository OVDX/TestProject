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
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export class RecipeDetailDto {
  id: string;
  name: string;
  image: string;
  category: string;
  area: string;
  instructions: string;
  ingredients: IngredientDto[];
  tags?: string[];
  youtube?: string;
  source?: string;
}

export class IngredientDto {
  name: string;
  measure: string;
}

export class RecipeListDto {
  recipes: RecipeListItemDto[];
  total: number;
  filter?: {
    type: 'ingredient' | 'country' | 'category' | 'all';
    value?: string;
  };
}
