import { RecipeListDto, RecipeDetailDto } from "../types/recipe";

const API_BASE_URL = process.env.API_BASE_URL;

interface GetRecipesParams {
  ingredient?: string;
  country?: string;
  category?: string;
  search?: string;
}

export async function getRecipes(
  params: GetRecipesParams
): Promise<RecipeListDto | null> {
  const query = new URLSearchParams();
  if (params.ingredient) query.append("ingredient", params.ingredient);
  if (params.country) query.append("country", params.country);
  if (params.category) query.append("category", params.category);
  if (params.search) query.append("search", params.search);

  const url = `${API_BASE_URL}/recipes?${query.toString()}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Не вдалось завантажити рецепти");
    }
    return response.json();
  } catch (error) {
    console.error("API помилка:", error);
    return null;
  }
}

export async function getRecipeById(
  id: string
): Promise<RecipeDetailDto | null> {
  const url = `${API_BASE_URL}/recipes/${id}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Не вдалось завантажити по id: ${id}`);
    }
    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}
