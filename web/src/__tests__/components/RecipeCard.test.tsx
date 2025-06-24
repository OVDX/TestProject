import { RecipeCard } from "@/app/components/RecipeCard/RecipeCard";
import { RecipeListItemDto } from "@/app/types/recipe";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("RecipeCard", () => {
  const mockRecipe: RecipeListItemDto = {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken Casserole",
    strMealThumb: "/test-image.jpg",
  };

  it("should render the recipe name and link correctly", () => {
    render(<RecipeCard recipe={mockRecipe} />);

    expect(screen.getByText(mockRecipe.strMeal)).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/recipes/${mockRecipe.idMeal}`);
  });
});
