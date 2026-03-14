import { useState } from "react";
import IngredientSelector from "../components/IngredientSelector";
import VoiceInput from "../components/VoiceInput";
import { ALL_INGREDIENTS } from "../data/ingredients";
import styles from "./PrepPage.module.css";

export default function PrepPage({ onSubmit }) {
  const [selected, setSelected] = useState({});       // { name: { qty, unit } }
  const [atRiskSet, setAtRiskSet] = useState(new Set());
  const [notes, setNotes] = useState("");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const selectedCount = Object.keys(selected).length;

  // ── Selection handlers ──────────────────────────────
  const handleToggle = (name) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[name]) {
        delete next[name];
        // also remove from at-risk if deselected
        setAtRiskSet((r) => { const s = new Set(r); s.delete(name); return s; });
      } else {
        next[name] = { qty: "", unit: "g" };
      }
      return next;
    });
  };

  const handleToggleRisk = (name) => {
    setAtRiskSet((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const handleUpdateQty = (name, qty) =>
    setSelected((prev) => ({ ...prev, [name]: { ...prev[name], qty } }));

  const handleUpdateUnit = (name, unit) =>
    setSelected((prev) => ({ ...prev, [name]: { ...prev[name], unit } }));

  // ── Voice input ─────────────────────────────────────
  const handleTranscript = (text) => {
    setTranscript(text);
    // Try to match spoken words against ingredient list
    const parts = text
      .split(/,|and/i)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    parts.forEach((part) => {
      const match = ALL_INGREDIENTS.find(
        (i) =>
          i.name.toLowerCase().includes(part) ||
          part.includes(i.name.toLowerCase())
      );
      if (match && !selected[match.name]) {
        handleToggle(match.name);
      }
    });
  };

  // ── Submit ──────────────────────────────────────────
  const handleSubmit = () => {
    if (selectedCount === 0) {
      setError("Please select at least one ingredient.");
      return;
    }
    setError("");
    const payload = {
      ingredients: Object.keys(selected).map((name) => ({
        name,
        qty: selected[name].qty,
        unit: selected[name].unit,
        atRisk: atRiskSet.has(name),
      })),
      notes,
    };
    onSubmit(payload);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>PrepBrain · Morning Prep</p>
        <h1 className={styles.title}>What's in the kitchen?</h1>
        <p className={styles.subtitle}>
          Tap ingredients to select them. Flag anything at-risk and we'll
          prioritise it in the suggestion.
        </p>
      </div>

      {/* Voice input row */}
      <div className={styles.voiceRow}>
        <VoiceInput
          onTranscript={handleTranscript}
          listening={listening}
          setListening={setListening}
        />
      </div>

      {/* Voice transcript feedback */}
      {transcript && (
        <div className={styles.transcript}>
          <span className={styles.transcriptLabel}>Heard: </span>
          {transcript}
          <span className={styles.transcriptHint}>
            {" "}— matched ingredients selected below
          </span>
        </div>
      )}

      {/* Ingredient selector */}
      <IngredientSelector
        selected={selected}
        atRiskSet={atRiskSet}
        onToggle={handleToggle}
        onToggleRisk={handleToggleRisk}
        onUpdateQty={handleUpdateQty}
        onUpdateUnit={handleUpdateUnit}
      />

      {/* Notes */}
      <div className={styles.notesSection}>
        <label className={styles.notesLabel}>
          Any notes for today?{" "}
          <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. busy Saturday, market crowd, one vegan staff on today…"
          rows={2}
          className={styles.textarea}
        />
      </div>

      {/* Error */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={selectedCount === 0}
        className={`${styles.submitBtn} ${selectedCount > 0 ? styles.submitActive : ""}`}
      >
        {selectedCount > 0
          ? `Generate suggestion with ${selectedCount} ingredient${selectedCount !== 1 ? "s" : ""} →`
          : "Select ingredients to continue"}
      </button>
    </div>
  );
}