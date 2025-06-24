import { render, screen } from "@testing-library/react";

import { RecipeDetailDto, RecipeListItemDto } from "@/app/types/recipe";
import RecipePage from "@/pages/recipes/[id]";

jest.mock("@/app/components/RecipeSidebar/RecipeSidebar", () => ({
  RecipeSidebar: ({
    category,
    recipes,
  }: {
    category: string;
    recipes: RecipeListItemDto[];
  }) => (
    <div data-testid="mock-sidebar">
      <h3>Sidebar for {category}</h3>
      <p>Recipes count: {recipes.length}</p>
    </div>
  ),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockRecipe: RecipeDetailDto = {
  id: "52772",
  name: "Teriyaki Chicken Casserole",
  category: "Chicken",
  area: "Japanese",
  image: "/test-image.jpg",
  instructions: "First instruction line.\nSecond instruction line.",
  ingredients: [
    { name: "Chicken Breast", measure: "1 lb" },
    { name: "Soy Sauce", measure: "1/2 cup" },
  ],
  tags: ["Casserole", "Chicken"],
};

const mockSidebarRecipes: RecipeListItemDto[] = [
  {
    idMeal: "53060",
    strMeal: "Other Chicken Dish",
    strMealThumb: "/other.jpg",
  },
  {
    idMeal: "53061",
    strMeal: "Another Chicken Dish",
    strMealThumb: "/another.jpg",
  },
];

describe("RecipePage", () => {
  beforeEach(() => {
    render(
      <RecipePage recipe={mockRecipe} sidebarRecipes={mockSidebarRecipes} />
    );
  });

  it("should render the main recipe details correctly", () => {
    expect(
      screen.getByRole("heading", { name: /Teriyaki Chicken Casserole/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Japanese")).toBeInTheDocument();
    expect(screen.getByText("Chicken")).toBeInTheDocument();
  });

  it("should render the list of ingredients with correct links", () => {
    expect(screen.getByText("Chicken Breast")).toBeInTheDocument();
    expect(screen.getByText("1 lb")).toBeInTheDocument();
    expect(screen.getByText("Soy Sauce")).toBeInTheDocument();
    const ingredientLink = screen.getByRole("link", {
      name: /Chicken Breast/i,
    });
    expect(ingredientLink).toHaveAttribute(
      "href",
      "/?ingredient=Chicken%20Breast"
    );
  });

  it("should render the instructions", () => {
    expect(screen.getByText(/First instruction line/i)).toBeInTheDocument();
    expect(screen.getByText(/Second instruction line/i)).toBeInTheDocument();
  });

  it("should render the sidebar with correct props", () => {
    const sidebar = screen.getByTestId("mock-sidebar");

    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveTextContent("Sidebar for Chicken");
    expect(sidebar).toHaveTextContent("Recipes count: 2");
  });
});
