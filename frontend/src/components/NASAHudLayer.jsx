import { useEffect, useRef, useState } from "react";

function NASAHudLayer({ prediction, collisionCount }) {
  const [alert, setAlert] = useState(null);
  const audioRef = useRef(null);

  /* 🚨 ALERT ENGINE */
  useEffect(() => {
    if (collisionCount > 0) {
      setAlert("COLLISION ANOMALY DETECTED");
    } else {
      setAlert(null);
    }
  }, [collisionCount]);

  /* 🔊 VOICE SIMULATION */
  useEffect(() => {
    if (!alert) return;

    const msg =
      collisionCount > 5
        ? "Critical orbital instability detected"
        : "Warning. Debris proximity increasing";

    const speak = new SpeechSynthesisUtterance(msg);
    speak.rate = 0.9;
    speak.pitch = 0.7;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speak);
  }, [alert]);

  return (
    <div className="hud-layer">

      {/* 🌐 SCANLINES */}
      <div className="scanlines" />

      {/* 🌫 NOISE LAYER */}
      <div className="noise-overlay" />

      {/* 📡 RADAR */}
      <div className="radar">
        <div className="radar-grid" />
        <div className="radar-sweep" />
      </div>

      {/* ⚠ ALERT */}
      {alert && (
        <div className="alert-panel active">
          ⚠ {alert}
        </div>
      )}

      {/* 🧠 MISSION READOUT */}
      <div className="top-bar">
        <span>ORBITAL SIMULATION ACTIVE</span>

        <span className={collisionCount > 0 ? "danger" : ""}>
          COLLISIONS: {collisionCount}
        </span>

        <span>
          {prediction
            ? `ETA IMPACT: ${prediction.time}s`
            : "TRACKING..."}
        </span>
      </div>
    </div>
  );
}

export default NASAHudLayer;