import { useRef } from "react";
import styles from "./VoiceInput.module.css";

export default function VoiceInput({ onTranscript, listening, setListening }) {
  const recognitionRef = useRef(null);

  const toggle = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-AU";

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onTranscript(text);
      setListening(false);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <div className={styles.wrapper}>
      <button
        onClick={toggle}
        className={`${styles.btn} ${listening ? styles.active : ""}`}
        title={listening ? "Stop recording" : "Start voice input"}
      >
        <MicIcon />
        <span>{listening ? "Listening…" : "Voice input"}</span>
        {listening && <span className={styles.pulse} />}
      </button>
      <p className={styles.hint}>
        {listening
          ? "Speak your ingredients — e.g. capsicum, feta, eggs"
          : "Tap to speak your ingredients"}
      </p>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
    </svg>
  );
}
