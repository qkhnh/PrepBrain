import { useState, useMemo } from "react";
import { INGREDIENT_CATEGORIES, ALL_INGREDIENTS } from "../data/Ingredients";
import type { Unit } from "../lib/parseVoiceInput";
import styles from "./IngredientSelector.module.css";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SelectedIngredient {
  qty: string;
  unit: Unit | "";
}

export type SelectedMap = Record<string, SelectedIngredient>;

interface Props {
  selected: SelectedMap;
  atRiskSet: Set<string>;
  onToggle: (name: string) => void;
  onToggleRisk: (name: string) => void;
  onUpdateQty: (name: string, qty: string) => void;
  onUpdateUnit: (name: string, unit: Unit | "") => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const UNITS: (Unit | "")[] = ["g", "kg", "ml", "L", "pcs", "cups", "bunch", "slice"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function IngredientSelector({
  selected,
  atRiskSet,
  onToggle,
  onToggleRisk,
  onUpdateQty,
  onUpdateUnit,
}: Props) {
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showTray, setShowTray] = useState<boolean>(false);

  const selectedCount = Object.keys(selected).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_INGREDIENTS.filter(({ name, category }) => {
      const matchCat = activeCategory === "all" || category === activeCategory;
      const matchSearch = !q || name.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const handleCategoryClick = (id: string): void => {
    setActiveCategory(id);
    setSearch("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
    setActiveCategory("all");
  };

  const activeCategoryLabel =
    INGREDIENT_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "All ingredients";

  return (
    <div className={styles.wrapper}>

      {/* Search bar */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search ingredients…"
            value={search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeCategory === "all" ? styles.tabActive : ""}`}
          onClick={() => handleCategoryClick("all")}
        >
          All
        </button>
        {INGREDIENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.tab} ${activeCategory === cat.id ? styles.tabActive : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Section label */}
      <p className={styles.sectionLabel}>
        {search
          ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
          : activeCategory === "all"
          ? "All ingredients"
          : activeCategoryLabel}
      </p>

      {/* Ingredient chips */}
      <div className={styles.grid}>
        {filtered.length === 0 && (
          <p className={styles.empty}>No ingredients match &quot;{search}&quot;</p>
        )}
        {filtered.map(({ name }) => {
          const isSel = !!selected[name];
          const isRisk = atRiskSet.has(name);
          return (
            <button
              key={name}
              onClick={() => onToggle(name)}
              className={[
                styles.chip,
                isSel ? styles.chipSelected : "",
                isSel && isRisk ? styles.chipRisk : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {isSel && <span className={styles.check}>✓</span>}
              {name}
              {isSel && isRisk && <span className={styles.riskIcon}>⚠</span>}
            </button>
          );
        })}
      </div>

      {/* Selected tray */}
      {selectedCount > 0 && (
        <div className={styles.tray}>
          <button
            className={styles.trayHeader}
            onClick={() => setShowTray((v) => !v)}
          >
            <span className={styles.trayCount}>
              <span className={styles.trayCountBadge}>{selectedCount}</span>
              ingredient{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <span className={styles.trayToggle}>
              {showTray ? "▲ Collapse" : "▼ Set quantities & flag at-risk"}
            </span>
          </button>

          {showTray && (
            <div className={styles.trayBody}>
              <div className={styles.trayRowHeader}>
                <span>Ingredient</span>
                <span>Qty</span>
                <span>Unit</span>
                <span>At-risk</span>
                <span />
              </div>

              {Object.entries(selected).map(([name, { qty, unit }]) => {
                const isRisk = atRiskSet.has(name);
                return (
                  <div key={name} className={styles.trayRow}>
                    <span className={styles.trayName}>{name}</span>

                    <input
                      type="number"
                      min={0}
                      placeholder="—"
                      value={qty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onUpdateQty(name, e.target.value)
                      }
                      className={styles.qtyInput}
                    />

                    <select
                      value={unit}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        onUpdateUnit(name, e.target.value as Unit | "")
                      }
                      className={styles.unitSelect}
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u || "—"}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => onToggleRisk(name)}
                      className={`${styles.riskBtn} ${isRisk ? styles.riskActive : ""}`}
                    >
                      {isRisk ? "⚠ At-risk" : "Flag"}
                    </button>

                    <button
                      onClick={() => onToggle(name)}
                      className={styles.removeBtn}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function SearchIcon(): JSX.Element {
  return (
    <svg
      className={styles.searchIcon}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}