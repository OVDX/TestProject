import Link from "next/link";
import { RecipeListItemDto } from "../../types/recipe";
import styles from "./RecipeSidebar.module.css";

interface RecipeSidebarProps {
  category: string;
  recipes: RecipeListItemDto[];
}

export function RecipeSidebar({ category, recipes }: RecipeSidebarProps) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Більше з {category}</h3>
        <div className={styles.divider}></div>
      </div>

      <ul className={styles.recipeList}>
        {recipes.map((recipe) => (
          <li key={recipe.idMeal} className={styles.recipeItem}>
            <Link
              href={`/recipes/${recipe.idMeal}`}
              className={styles.recipeLink}
            >
              <span className={styles.recipeName}>{recipe.strMeal}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
