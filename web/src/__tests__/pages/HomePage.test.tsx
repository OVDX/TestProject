import { render, screen } from "@testing-library/react";
import HomePage from "@/pages/index"; // Важливо: правильний шлях до вашого компонента
import { RecipeListDto } from "@/app/types/recipe";

jest.mock("@/app/components/SearchFilter/SearchFilter", () => ({
  SearchFilter: () => <div>Mocked SearchFilter</div>,
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("HomePage", () => {
  const mockRecipeData: RecipeListDto = {
    recipes: [
      { idMeal: "1", strMeal: "Meal 1", strMealThumb: "/thumb1.jpg" },
      { idMeal: "2", strMeal: "Meal 2", strMealThumb: "/thumb2.jpg" },
    ],
    total: 2,
  };

  it("should render recipes when data is available", () => {
    render(
      <HomePage
        recipeData={mockRecipeData}
        title="Всі доступні рецепти"
        query={{}}
      />
    );

    expect(
      screen.getByRole("heading", { name: /Всі доступні рецепти/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Meal 1")).toBeInTheDocument();
    expect(screen.getByText("Meal 2")).toBeInTheDocument();

    expect(screen.getByText("Mocked SearchFilter")).toBeInTheDocument();
  });

  it('should render a "not found" message when no recipes are returned', () => {
    render(
      <HomePage
        recipeData={{ recipes: [], total: 0 }}
        title="Результати пошуку"
        query={{ search: "nonexistent" }}
      />
    );

    expect(
      screen.getByRole("heading", { name: /Рецептів не знайдено/i })
    ).toBeInTheDocument();
  });

  it("should display title based on category filter from props", () => {
    render(
      <HomePage
        recipeData={{ recipes: [], total: 0 }}
        title="Рецепти з категорії: Seafood"
        query={{ category: "Seafood" }}
      />
    );

    expect(
      screen.getByRole("heading", { name: /Рецепти з категорії: Seafood/i })
    ).toBeInTheDocument();
  });
});
