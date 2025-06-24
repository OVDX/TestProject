import { RecipeCard } from "@/app/components/RecipeCard/RecipeCard";
import { getRecipes } from "@/app/lib/api";
import "../app/globals.css";
import { RecipeListDto } from "@/app/types/recipe";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { SearchFilter } from "@/app/components/SearchFilter/SearchFilter";
import styles from "./main.module.css";
import { ParsedUrlQuery } from "querystring";

function formatRecipesCount(count: number): string {
  if (count % 100 >= 11 && count % 100 <= 19) {
    return "рецептів";
  }
  const lastDigit = count % 10;
  if (lastDigit === 1) {
    return "рецепт";
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return "рецепти";
  }
  return "рецептів";
}

function getPageTitle(query: ParsedUrlQuery): string {
  if (query.category) return `Рецепти з категорії: ${query.category}`;
  if (query.country) return `Рецепти з країни: ${query.country}`;
  if (query.ingredient) return `Рецепти з інгредієнтом: ${query.ingredient}`;
  if (query.search) return `Результати пошуку для: "${query.search}"`;
  return "Всі доступні рецепти";
}

function getPageSubtitle(query: ParsedUrlQuery, recipesCount: number): string {
  if (recipesCount === 0) return "Спробуйте змінити критерії пошуку";

  const countText = `${recipesCount} ${formatRecipesCount(recipesCount)}`;

  if (query.category) return `Знайдено ${countText} у цій категорії`;
  if (query.country) return `Знайдено ${countText} з цієї країни`;
  if (query.ingredient) return `Знайдено ${countText} з цим інгредієнтом`;
  if (query.search) return `Знайдено ${countText} за вашим запитом`;
  return `Ознайомтесь з ${countText} з нашої колекції`;
}

export const getServerSideProps: GetServerSideProps<{
  recipeData: RecipeListDto | null;
  title: string;
  query: ParsedUrlQuery;
}> = async (context) => {
  const { query } = context;
  const recipeData = await getRecipes({
    ingredient: query.ingredient as string,
    country: query.country as string,
    category: query.category as string,
    search: query.search as string,
  });
  const title = getPageTitle(query);

  return {
    props: {
      recipeData,
      title,
      query,
    },
  };
};

export default function HomePage({
  recipeData,
  title,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const recipesCount = recipeData?.recipes.length || 0;
  const subtitle = getPageSubtitle(query, recipesCount);
  const hasResults = recipeData && recipeData.recipes.length > 0;
  const hasFilters = Object.keys(query).length > 0;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>

            {hasFilters && (
              <div className={styles.activeFilters}>
                <span className={styles.filtersLabel}>Активні фільтри:</span>
                <div className={styles.filterTags}>
                  {query.category && (
                    <span className={styles.filterTag}>
                      Категорія: {query.category}
                    </span>
                  )}
                  {query.country && (
                    <span className={styles.filterTag}>
                      Країна: {query.country}
                    </span>
                  )}
                  {query.ingredient && (
                    <span className={styles.filterTag}>
                      Інгредієнт: {query.ingredient}
                    </span>
                  )}
                  {query.search && (
                    <span className={styles.filterTag}>
                      Пошук: `{query.search}`
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <section className={styles.searchSection}>
          <SearchFilter />
        </section>

        <section className={styles.resultsSection}>
          {!hasResults ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3 className={styles.noResultsTitle}>Рецептів не знайдено</h3>
              <p className={styles.noResultsText}>
                {hasFilters
                  ? "Спробуйте змінити критерії пошуку або скинути фільтри, щоб побачити більше рецептів."
                  : "Вибачте, на даний момент ми не змогли знайти жодного рецепта."}
              </p>
              {hasFilters && (
                <div className={styles.suggestions}>
                  <p className={styles.suggestionsTitle}>
                    Спробуйте ці поради:
                  </p>
                  <ul className={styles.suggestionsList}>
                    <li>Перевірте правопис</li>
                    <li>Використовуйте більш загальні терміни</li>
                    <li>Спробуйте інші категорії або країни</li>
                    <li>Скиньте всі фільтри, щоб переглянути всі рецепти</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <div className={styles.resultsInfo}>
                  <span className={styles.resultsCount}>
                    {recipesCount} {formatRecipesCount(recipesCount)}
                  </span>
                  {hasFilters && (
                    <span className={styles.resultsFiltered}>
                      (відфільтровані результати)
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.recipesGrid}>
                {recipeData.recipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
