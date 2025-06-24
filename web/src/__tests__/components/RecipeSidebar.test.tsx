import { RecipeSidebar } from "@/app/components/RecipeSidebar/RecipeSidebar";
import { RecipeListItemDto } from "@/app/types/recipe";
import { render, screen } from "@testing-library/react";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("RecipeSidebar", () => {
  const mockRecipes: RecipeListItemDto[] = [
    { idMeal: "1", strMeal: "First Recipe", strMealThumb: "thumb1.jpg" },
    { idMeal: "2", strMeal: "Second Recipe", strMealThumb: "thumb2.jpg" },
  ];
  const mockCategory = "Test Category";

  it("should render null when recipes array is empty", () => {
    const { container } = render(
      <RecipeSidebar category={mockCategory} recipes={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render the category title and a list of recipes", () => {
    render(<RecipeSidebar category={mockCategory} recipes={mockRecipes} />);

    expect(
      screen.getByRole("heading", { name: /Більше з Test Category/i })
    ).toBeInTheDocument();

    expect(screen.getByText("First Recipe")).toBeInTheDocument();
    expect(screen.getByText("Second Recipe")).toBeInTheDocument();
  });

  it("should have links pointing to the correct recipe pages", () => {
    render(<RecipeSidebar category={mockCategory} recipes={mockRecipes} />);

    const firstLink = screen.getByRole("link", { name: /First Recipe/i });
    const secondLink = screen.getByRole("link", { name: /Second Recipe/i });

    expect(firstLink).toHaveAttribute("href", "/recipes/1");
    expect(secondLink).toHaveAttribute("href", "/recipes/2");
  });
});
