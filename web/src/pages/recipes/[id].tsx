import { RecipeSidebar } from "@/app/components/RecipeSidebar/RecipeSidebar";
import { getRecipeById, getRecipes } from "@/app/lib/api";
import { RecipeDetailDto, RecipeListItemDto } from "@/app/types/recipe";
import "../../app/globals.css";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./details.module.css";

export const getServerSideProps: GetServerSideProps<{
  recipe: RecipeDetailDto;
  sidebarRecipes: RecipeListItemDto[];
}> = async (context) => {
  const { id } = context.params!;

  if (!id || typeof id !== "string") {
    return { notFound: true };
  }

  const recipe = await getRecipeById(id);

  if (!recipe) {
    return { notFound: true };
  }

  const sidebarData = await getRecipes({ category: recipe.category });
  const sidebarRecipes =
    sidebarData?.recipes.filter((r) => r.idMeal !== recipe.id) || [];

  return {
    props: {
      recipe,
      sidebarRecipes,
    },
  };
};

export default function RecipePage({
  recipe,
  sidebarRecipes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <div className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>
                Головна
              </Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbCurrent}>Рецепт</span>
            </div>

            <h1 className={styles.title}>{recipe.name}</h1>

            <div className={styles.metadata}>
              <Link
                href={`/?country=${recipe.area}`}
                className={styles.countryLink}
              >
                <span className={styles.countryIcon}>🌍</span>
                {recipe.area}
              </Link>
              <Link
                href={`/?category=${recipe.category}`}
                className={styles.categoryLink}
              >
                <span className={styles.categoryIcon}>🍽️</span>
                {recipe.category}
              </Link>
            </div>
          </header>

          <div className={styles.content}>
            <div className={styles.imageSection}>
              <div className={styles.imageContainer}>
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  className={styles.image}
                />
                <div className={styles.imageOverlay}></div>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.ingredientsCard}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📝</span>
                  Інгредієнти
                  <span className={styles.ingredientCount}>
                    ({recipe.ingredients.length})
                  </span>
                </h2>
                <ul className={styles.ingredientsList}>
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index} className={styles.ingredientItem}>
                      <div className={styles.ingredientBullet}></div>
                      <div className={styles.ingredientContent}>
                        <Link
                          href={`/?ingredient=${encodeURIComponent(ing.name)}`}
                          className={styles.ingredientName}
                        >
                          {ing.name}
                        </Link>
                        <span className={styles.ingredientMeasure}>
                          {ing.measure}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.instructionsCard}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>👨‍🍳</span>
                  Інструкція
                </h2>
                <div className={styles.instructionsContent}>
                  {recipe.instructions.split("\n").map(
                    (paragraph, index) =>
                      paragraph.trim() && (
                        <p key={index} className={styles.instructionParagraph}>
                          {paragraph.trim()}
                        </p>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className={styles.sidebar}>
          <RecipeSidebar category={recipe.category} recipes={sidebarRecipes} />
        </aside>
      </div>
    </div>
  );
}
