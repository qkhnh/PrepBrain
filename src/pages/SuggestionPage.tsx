// P2 — Suggestion output page
// This is a placeholder so App.jsx doesn't break.
// We'll build this out in the next step.

export default function SuggestionPage({ data, onBack }) {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "DM Sans, sans-serif" }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: "#9E9C96", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: "1.5rem" }}
      >
        ← Back to ingredients
      </button>
      <h2 style={{ fontFamily: "Playfair Display, serif", color: "#1C1F1A" }}>
        Suggestion page coming soon
      </h2>
      <p style={{ color: "#6B6860", fontSize: 14 }}>
        You submitted {data?.ingredients?.length || 0} ingredient{data?.ingredients?.length !== 1 ? "s" : ""}.
      </p>
      <pre style={{ background: "#F5F4F0", padding: "1rem", borderRadius: 8, fontSize: 12, color: "#444441", overflow: "auto" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}