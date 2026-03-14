import { useState, useMemo, useRef } from "react";
import { INGREDIENT_CATEGORIES, ALL_INGREDIENTS, FEATURED_INGREDIENT_NAMES } from "../data/ingredients";
import styles from "./IngredientSelector.module.css";

const UNITS = ["g", "kg", "ml", "L", "pcs", "cups", "bunch", "slice"];
const FEATURED_SET = new Set(FEATURED_INGREDIENT_NAMES);

export default function IngredientSelector({ selected, atRiskSet, onToggle, onToggleRisk, onUpdateQty, onUpdateUnit }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("featured");
  const [showTray, setShowTray] = useState(false);
  const tabsRef = useRef(null);
  const dragStartXRef = useRef(null);
  const dragStartScrollRef = useRef(0);
  const isDraggingRef = useRef(false);

  const selectedCount = Object.keys(selected).length;

  // Filter ingredients by search + category (featured = popular only)
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_INGREDIENTS.filter(({ name, category }) => {
      const matchCat = activeCategory === "featured"
        ? FEATURED_SET.has(name)
        : category === activeCategory;
      const matchSearch = !q || name.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setActiveCategory("featured");
  };

  const handleTabsMouseDown = (e) => {
    if (!tabsRef.current) return;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = tabsRef.current.scrollLeft;
    isDraggingRef.current = false;
  };

  const handleTabsMouseMove = (e) => {
    if (dragStartXRef.current == null || !tabsRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    tabsRef.current.scrollLeft = dragStartScrollRef.current - dx;
    isDraggingRef.current = true;
  };

  const handleTabsMouseUp = () => {
    dragStartXRef.current = null;
    setTimeout(() => { isDraggingRef.current = false; }, 0);
  }

  const handleTabClick = (categoryId, e) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setActiveCategory(categoryId);
    setSearch("");
  };

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
            <button className={styles.clearBtn} onClick={() => setSearch("")}>×</button>
          )}
        </div>
      </div>

      {/* Category tabs (scrollable with mouse drag) */}
      <div
        ref={tabsRef}
        className={styles.tabs}
        role="tablist"
        onMouseDown={handleTabsMouseDown}
        onMouseMove={handleTabsMouseMove}
        onMouseUp={handleTabsMouseUp}
        onMouseLeave={handleTabsMouseUp}
      >
        <button
          role="tab"
          type="button"
          className={`${styles.tab} ${activeCategory === "featured" ? styles.tabActive : ""}`}
          onClick={(e) => handleTabClick("featured", e)}
        >
          Featured
        </button>
        {INGREDIENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            type="button"
            className={`${styles.tab} ${activeCategory === cat.id ? styles.tabActive : ""}`}
            onClick={(e) => handleTabClick(cat.id, e)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Ingredient chip grid */}
      <div className={styles.grid}>
        {filtered.length === 0 && (
          <p className={styles.empty}>No ingredients match "{search}"</p>
        )}
        {filtered.map(({ name }) => {
          const isSel = !!selected[name];
          const isRisk = atRiskSet.has(name);
          return (
            <button
              key={name}
              onClick={() => onToggle(name)}
              className={`${styles.chip} ${isSel ? styles.chipSelected : ""} ${isSel && isRisk ? styles.chipRisk : ""}`}
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
              {selectedCount} ingredient{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <span className={styles.trayToggle}>
              {showTray ? "▲ Hide" : "▼ Set quantities & flag at-risk"}
            </span>
          </button>

          {showTray && (
            <div className={styles.trayBody}>
              {/* Column headers */}
              <div className={styles.trayRowHeader}>
                <span>Ingredient</span>
                <span>Qty</span>
                <span>Unit</span>
                <span>At-risk?</span>
                <span />
              </div>

              {Object.keys(selected).map((name) => {
                const isRisk = atRiskSet.has(name);
                return (
                  <div key={name} className={styles.trayRow}>
                    <span className={styles.trayName}>{name}</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="—"
                      value={selected[name].qty}
                      onChange={(e) => onUpdateQty(name, e.target.value)}
                      className={styles.qtyInput}
                    />
                    <select
                      value={selected[name].unit}
                      onChange={(e) => onUpdateUnit(name, e.target.value)}
                      className={styles.unitSelect}
                    >
                      {UNITS.map((u) => <option key={u}>{u}</option>)}
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

function SearchIcon() {
  return (
    <svg
      className={styles.searchIcon}
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
