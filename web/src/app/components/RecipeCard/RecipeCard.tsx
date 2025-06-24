import Link from "next/link";
import Image from "next/image";
import { RecipeListItemDto } from "../../types/recipe";
import styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: RecipeListItemDto;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.idMeal}`} className={styles.cardLink}>
      <div className={styles.imageContainer}>
        <Image
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className={styles.image}
        />
        <div className={styles.overlay}></div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{recipe.strMeal}</h3>
        <div className={styles.badge}>Рецепт</div>
      </div>
    </Link>
  );
}
