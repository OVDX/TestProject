import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./SearchFilter.module.css";

export function SearchFilter() {
  const router = useRouter();

  const initialFilterType = Object.keys(router.query)[0] || "search";
  const initialSearchTerm = router.query[initialFilterType] || "";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm as string);
  const [filterType, setFilterType] = useState(initialFilterType);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      router.push({
        pathname: "/",
        query: { [filterType]: searchTerm.trim() },
      });
    } else {
      router.push("/");
    }
  };

  const clearFilter = () => {
    setSearchTerm("");
    router.push("/");
  };

  const isFiltered = Object.keys(router.query).length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.subtitle}>
          Пошук по назві, категорії, країні та інгредієнтам
        </p>
      </div>

      <form onSubmit={handleSearch} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="search-term" className={styles.label}>
            Пошук по
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="search-term"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Chicken, Canadian, Seafood..."
              className={styles.input}
            />
            <div className={styles.searchIcon}>
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.selectGroup}>
          <label htmlFor="filter-type" className={styles.label}>
            Фільтр
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="filter-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.select}
            >
              <option value="search">По назві</option>
              <option value="category">По категорії</option>
              <option value="country">По країні</option>
              <option value="ingredient">По інгредієнтам</option>
            </select>
            <div className={styles.selectIcon}>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.searchButton}>
            <span>Пошук</span>
          </button>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilter}
              className={styles.clearButton}
            >
              <span>Очистити</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
