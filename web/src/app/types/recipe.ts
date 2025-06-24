export interface RecipeListItemDto {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface RecipeListDto {
  recipes: RecipeListItemDto[];
  total: number;
  filter?: {
    type: "ingredient" | "country" | "category" | "all";
    value?: string;
  };
}

export interface IngredientDto {
  name: string;
  measure: string;
}

export interface RecipeDetailDto {
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
