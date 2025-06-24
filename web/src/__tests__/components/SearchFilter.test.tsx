import { SearchFilter } from "@/app/components/SearchFilter/SearchFilter";
import { render, screen, fireEvent } from "@testing-library/react";

const mockRouter = {
  push: jest.fn(),
  query: {},
};

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

describe("SearchFilter", () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
    mockRouter.query = {};
  });

  it("should render with default values when no query params are present", () => {
    render(<SearchFilter />);

    expect(screen.getByPlaceholderText(/e.g., Chicken/i)).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("search");
    expect(
      screen.queryByRole("button", { name: /Очистити/i })
    ).not.toBeInTheDocument();
  });

  it("should initialize with values from the URL query", () => {
    mockRouter.query = { category: "Seafood" };
    render(<SearchFilter />);

    expect(screen.getByPlaceholderText(/e.g., Chicken/i)).toHaveValue(
      "Seafood"
    );
    expect(screen.getByRole("combobox")).toHaveValue("category");
    expect(
      screen.getByRole("button", { name: /Очистити/i })
    ).toBeInTheDocument();
  });

  it("should update state on user input and call router.push on submit", () => {
    render(<SearchFilter />);

    const input = screen.getByPlaceholderText(/e.g., Chicken/i);
    const select = screen.getByRole("combobox");
    const searchButton = screen.getByRole("button", { name: /Пошук/i });

    fireEvent.change(input, { target: { value: "My Search" } });
    expect(input).toHaveValue("My Search");

    fireEvent.change(select, { target: { value: "ingredient" } });
    expect(select).toHaveValue("ingredient");
    fireEvent.click(searchButton);

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/",
      query: { ingredient: "My Search" },
    });
  });

  it('should call router.push with "/" when clear button is clicked', () => {
    mockRouter.query = { search: "something" };
    render(<SearchFilter />);

    const clearButton = screen.getByRole("button", { name: /Очистити/i });

    fireEvent.click(clearButton);

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });
});
