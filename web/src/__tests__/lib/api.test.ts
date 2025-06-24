import { getRecipeById, getRecipes } from "@/app/lib/api";

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe("API Service", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("getRecipes", () => {
    it("should fetch and return a list of recipes", async () => {
      const mockData = { recipes: [{ idMeal: "1", strMeal: "Test" }] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getRecipes({ category: "Seafood" });

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/recipes?category=Seafood",
        { cache: "no-store" }
      );
    });

    it("should return null if the fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      const result = await getRecipes({});
      expect(result).toBeNull();
    });
  });

  describe("getRecipeById", () => {
    it("should fetch and return recipe details", async () => {
      const mockData = { id: "123", name: "Test Recipe" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getRecipeById("123");

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/recipes/123",
        { cache: "no-store" }
      );
    });
  });
});
