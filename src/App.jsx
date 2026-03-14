import { useState } from "react";
import PrepPage from "./pages/PrepPage";
import SuggestionPage from "./pages/SuggestionPage";
import styles from "./App.module.css";

export default function App() {
  const [page, setPage] = useState("prep");       // "prep" | "suggestion"
  const [prepData, setPrepData] = useState(null); // ingredients + notes from P1

  const handlePrepSubmit = (data) => {
    setPrepData(data);
    setPage("suggestion");
  };

  const handleBack = () => {
    setPage("prep");
  };

  return (
    <div className={styles.app}>
      {/* Nav bar */}
      <nav className={styles.nav}>
        <span className={styles.logo}>PrepBrain</span>
        <div className={styles.steps}>
          <span className={`${styles.step} ${page === "prep" ? styles.stepActive : styles.stepDone}`}>
            1
          </span>
          <span className={styles.stepLine} />
          <span className={`${styles.step} ${page === "suggestion" ? styles.stepActive : ""}`}>
            2
          </span>
        </div>
      </nav>

      {/* Pages */}
      <main className={styles.main}>
        {page === "prep" && (
          <PrepPage onSubmit={handlePrepSubmit} />
        )}
        {page === "suggestion" && (
          <SuggestionPage data={prepData} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}