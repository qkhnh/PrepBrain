import { useState } from "react";
import IngredientSelector from "../components/IngredientSelector";
import type { SelectedMap } from "../components/IngredientSelector";
import VoiceInput from "../components/VoiceInput";
import { ALL_INGREDIENTS } from "../data/Ingredients";
import { parseVoiceInput, matchToIngredients } from "../lib/parseVoiceInput";
import type { MatchedIngredient, Unit } from "../lib/parseVoiceInput";
import styles from "./PrepPage.module.css";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SubmittedIngredient {
  name: string;
  qty: string;
  unit: Unit | "";
  atRisk: boolean;
}

export interface PrepPayload {
  ingredients: SubmittedIngredient[];
  notes: string;
}

interface Props {
  onSubmit: (data: PrepPayload) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PrepPage({ onSubmit }: Props) {
  const [selected, setSelected] = useState<SelectedMap>({});
  const [atRiskSet, setAtRiskSet] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<string>("");
  const [listening, setListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [voiceResults, setVoiceResults] = useState<MatchedIngredient[]>([]);
  const [error, setError] = useState<string>("");

  const selectedCount = Object.keys(selected).length;

  // ── Selection handlers ────────────────────────────────────────────────────

  const handleToggle = (name: string): void => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[name]) {
        delete next[name];
        setAtRiskSet((r) => {
          const s = new Set(r);
          s.delete(name);
          return s;
        });
      } else {
        next[name] = { qty: "", unit: "g" };
      }
      return next;
    });
  };

  const handleToggleRisk = (name: string): void => {
    setAtRiskSet((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const handleUpdateQty = (name: string, qty: string): void => {
    setSelected((prev) => ({ ...prev, [name]: { ...prev[name], qty } }));
  };

  const handleUpdateUnit = (name: string, unit: Unit | ""): void => {
    setSelected((prev) => ({ ...prev, [name]: { ...prev[name], unit } }));
  };

  // ── Voice input ───────────────────────────────────────────────────────────

  const handleTranscript = (text: string): void => {
    setTranscript(text);

    const parsed = parseVoiceInput(text);
    const matched = matchToIngredients(parsed, ALL_INGREDIENTS);
    setVoiceResults(matched);

    matched.forEach((item: MatchedIngredient) => {
      if (item.matched && item.matchedName) {
        setSelected((prev) => ({
          ...prev,
          [item.matchedName!]: {
            qty: item.qty,
            unit: item.unit,
          },
        }));
      }
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = (): void => {
    if (selectedCount === 0) {
      setError("Please select at least one ingredient.");
      return;
    }
    setError("");

    const payload: PrepPayload = {
      ingredients: Object.entries(selected).map(([name, { qty, unit }]) => ({
        name,
        qty,
        unit,
        atRisk: atRiskSet.has(name),
      })),
      notes,
    };

    onSubmit(payload);
  };

  // ── Derived state ─────────────────────────────────────────────────────────

  const matchedCount = voiceResults.filter((r) => r.matched).length;
  const unmatchedItems = voiceResults.filter((r) => !r.matched);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>Morning Prep · Today's Kitchen</p>
        <h1 className={styles.title}>What's in the kitchen?</h1>
        <p className={styles.subtitle}>
          Select your leftover ingredients below. Flag anything at-risk and
          PrepBrain will prioritise it when generating today's special.
        </p>
      </div>

      {/* Voice input */}
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
          <div className={styles.transcriptRow}>
            <span className={styles.transcriptLabel}>Heard:</span>
            <span className={styles.transcriptText}>{transcript}</span>
          </div>

          {voiceResults.length > 0 && (
            <div className={styles.voiceResultsGrid}>
              {voiceResults.map((item, i) => (
                <div
                  key={i}
                  className={`${styles.voiceResult} ${
                    item.matched
                      ? styles.voiceResultMatched
                      : styles.voiceResultUnmatched
                  }`}
                >
                  <span className={styles.voiceResultName}>
                    {item.matched ? "✓" : "?"}{" "}
                    {item.matchedName ?? item.name}
                  </span>
                  {item.qty && (
                    <span className={styles.voiceResultQty}>
                      {item.qty} {item.unit}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {unmatchedItems.length > 0 && (
            <p className={styles.unmatchedWarning}>
              {unmatchedItems.length} item
              {unmatchedItems.length !== 1 ? "s" : ""} not recognised — add
              manually below if needed
            </p>
          )}

          {matchedCount > 0 && (
            <p className={styles.transcriptHint}>
              {matchedCount} ingredient{matchedCount !== 1 ? "s" : ""} selected
              with quantities — edit in the tray below
            </p>
          )}
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
          Chef notes{" "}
          <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNotes(e.target.value)
          }
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
        className={`${styles.submitBtn} ${
          selectedCount > 0 ? styles.submitActive : ""
        }`}
      >
        {selectedCount > 0
          ? `Generate today's special — ${selectedCount} ingredient${
              selectedCount !== 1 ? "s" : ""
            } selected →`
          : "Select ingredients to continue"}
      </button>
    </div>
  );
}