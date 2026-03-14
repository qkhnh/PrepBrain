// ─────────────────────────────────────────────────────────────────────────────
// parseVoiceInput.ts
// Parses a spoken ingredient string into structured { name, qty, unit } objects
// Example: "200 grams capsicum, 3 eggs, half a cup feta"
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

export type Unit =
  | "g" | "kg" | "ml" | "L"
  | "cups" | "tbsp" | "tsp"
  | "pcs" | "bunch" | "slice";

export interface ParsedIngredient {
  raw: string;         // original spoken fragment
  name: string;        // capitalised ingredient name
  qty: string;         // quantity as string (e.g. "200", "0.5")
  unit: Unit | "";     // standardised unit or empty string
}

export interface MatchedIngredient extends ParsedIngredient {
  matchedName: string | null;  // name from the ingredient library, or null
  matched: boolean;
}

// ── Unit normalisation map ────────────────────────────────────────────────────

const UNIT_MAP: Record<string, Unit> = {
  // grams
  gram: "g", grams: "g", g: "g",
  // kilograms
  kilogram: "kg", kilograms: "kg", kilo: "kg", kilos: "kg", kg: "kg",
  // millilitres
  millilitre: "ml", millilitres: "ml", milliliter: "ml", milliliters: "ml", ml: "ml",
  // litres
  litre: "L", litres: "L", liter: "L", liters: "L", l: "L",
  // cups
  cup: "cups", cups: "cups",
  // tablespoons
  tablespoon: "tbsp", tablespoons: "tbsp", tbsp: "tbsp",
  // teaspoons
  teaspoon: "tsp", teaspoons: "tsp", tsp: "tsp",
  // pieces
  piece: "pcs", pieces: "pcs", pcs: "pcs",
  // bunch
  bunch: "bunch", bunches: "bunch",
  // slice
  slice: "slice", slices: "slice",
};

// ── Fraction word map ─────────────────────────────────────────────────────────

const FRACTION_MAP: Record<string, number> = {
  "half":           0.5,
  "a half":         0.5,
  "quarter":        0.25,
  "a quarter":      0.25,
  "three quarters": 0.75,
  "third":          0.33,
  "a third":        0.33,
  "two thirds":     0.67,
};

// ── Number word map ───────────────────────────────────────────────────────────

const NUMBER_WORD_MAP: Record<string, number> = {
  a: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, hundred: 100,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function wordsToNumber(str: string): number | null {
  const n = parseFloat(str);
  if (!isNaN(n)) return n;
  return NUMBER_WORD_MAP[str.toLowerCase()] ?? null;
}

function capitalise(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Main parser ───────────────────────────────────────────────────────────────

export function parseVoiceInput(transcript: string): ParsedIngredient[] {
  const parts = transcript
    .toLowerCase()
    .split(/,\s*|\s+and\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts.map((part): ParsedIngredient => {
    // Strip filler words
    const cleaned = part
      .replace(/\b(of|the|some|about|around|approximately|roughly)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

    let qty = "";
    let unit: Unit | "" = "";
    let name = cleaned;

    // 1. Check fraction words (e.g. "half a cup feta")
    for (const [phrase, value] of Object.entries(FRACTION_MAP)) {
      if (cleaned.startsWith(phrase)) {
        qty = String(value);
        name = cleaned.slice(phrase.length).trim();
        break;
      }
    }

    // 2. Check numeric quantity (e.g. "200 grams capsicum")
    if (!qty) {
      const numMatch = cleaned.match(/^(\d+\.?\d*)\s*(.*)/);
      if (numMatch) {
        const candidate = wordsToNumber(numMatch[1]);
        if (candidate !== null) {
          qty = String(candidate);
          name = numMatch[2].trim();
        }
      }
    }

    // 3. Check number words (e.g. "three eggs")
    if (!qty) {
      const wordNumMatch = cleaned.match(
        /^(a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty)\s+(.*)/i
      );
      if (wordNumMatch) {
        const candidate = wordsToNumber(wordNumMatch[1]);
        if (candidate !== null) {
          qty = String(candidate);
          name = wordNumMatch[2].trim();
        }
      }
    }

    // 4. Extract unit from remaining name string
    if (name) {
      const unitMatch = name.match(
        /^(grams?|kilograms?|kilos?|kg|millilitres?|milliliters?|ml|litres?|liters?|cups?|tablespoons?|tbsp|teaspoons?|tsp|pieces?|pcs|bunch(?:es)?|slices?|g|l)\b\s*/i
      );
      if (unitMatch) {
        const spokenUnit = unitMatch[1].toLowerCase();
        unit = UNIT_MAP[spokenUnit] ?? "";
        name = name.slice(unitMatch[0].length).trim();
      }
    }

    // 5. Default unit if qty present but no unit found
    if (qty && !unit) {
      const numQty = parseFloat(qty);
      unit = numQty >= 50 ? "g" : "pcs";
    }

    return {
      raw: part,
      name: capitalise(name),
      qty,
      unit,
    };
  });
}

// ── Ingredient matcher ────────────────────────────────────────────────────────

interface IngredientEntry {
  name: string;
  category: string;
}

export function matchToIngredients(
  parsed: ParsedIngredient[],
  allIngredients: IngredientEntry[]
): MatchedIngredient[] {
  return parsed.map((item): MatchedIngredient => {
    const nameLower = item.name.toLowerCase();

    // 1. Exact match
    let match = allIngredients.find(
      (i) => i.name.toLowerCase() === nameLower
    );

    // 2. Partial match — spoken name contains library name or vice versa
    if (!match) {
      match = allIngredients.find(
        (i) =>
          i.name.toLowerCase().includes(nameLower) ||
          nameLower.includes(i.name.toLowerCase())
      );
    }

    // 3. Word-level match (e.g. "cherry tomatoes" → "Cherry Tomato")
    if (!match) {
      const words = nameLower.split(" ");
      match = allIngredients.find((i) =>
        words.some(
          (w) => w.length > 3 && i.name.toLowerCase().includes(w)
        )
      );
    }

    return {
      ...item,
      matchedName: match?.name ?? null,
      matched: !!match,
    };
  });
}