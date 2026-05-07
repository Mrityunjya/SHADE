import { useState, useEffect, useMemo, useRef } from "react";

function Dashboard({
  speed,
  setSpeed,
  collisionCount,
  satelliteCount = 3,
  debrisCount = 10,
  prediction,
}) {
  const [utcTime, setUtcTime] = useState(new Date());
  const [history, setHistory] = useState([]);

  /* =========================
     🧠 TELEMETRY CORE ENGINE
  ========================= */

  const hazardScore = useMemo(
    () => Math.min(collisionCount * 12, 100),
    [collisionCount]
  );

  const stabilityIndex = useMemo(() => {
    const penalty = collisionCount * 7 + debrisCount * 0.4;
    return Math.max(100 - penalty, 0);
  }, [collisionCount, debrisCount]);

  const anomalyLevel = useMemo(() => {
    if (collisionCount === 0) return "NOMINAL";
    if (collisionCount < 3) return "ELEVATED";
    if (collisionCount < 6) return "CRITICAL";
    return "SEVERE";
  }, [collisionCount]);

  const missionState = useMemo(() => {
    if (stabilityIndex > 80)
      return { label: "STABLE ORBIT", color: "green" };
    if (stabilityIndex > 50)
      return { label: "UNSTABLE TRAJECTORY", color: "yellow" };
    return { label: "MISSION RISK ACTIVE", color: "red" };
  }, [stabilityIndex]);

  /* =========================
     🕒 TIME ENGINE (STABLE)
  ========================= */

  useEffect(() => {
    const t = setInterval(() => setUtcTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* =========================
     📡 EVENT BUFFER (IMPORTANT FIX)
  ========================= */

  const lastEventRef = useRef(0);

  useEffect(() => {
    if (collisionCount === 0) return;

    const now = Date.now();

    // ⛔ throttle event spam (1 event / 1.5s)
    if (now - lastEventRef.current < 1500) return;
    lastEventRef.current = now;

    setHistory((prev) => [
      {
        time: new Date().toISOString().split("T")[1].split(".")[0],
        event: "COLLISION DETECTED",
        severity: anomalyLevel,
      },
      ...prev.slice(0, 8),
    ]);
  }, [collisionCount, anomalyLevel]);

  /* =========================
     🎯 SAFE UI HELPERS
  ========================= */

  const formatPercent = (v) => `${Math.min(v, 100)}%`;

  /* =========================
     🚀 RENDER
  ========================= */

  return (
    <div className="nasa-panel">

      {/* 🧭 HEADER */}
      <div className="nasa-header">
        <h1>MISSION CONTROL SYSTEM</h1>
        <p className="subtle">EARTH ORBITAL MONITORING NETWORK</p>
      </div>

      {/* ⏱ TIME + STATE */}
      <div className="grid-2">

        <div className="telemetry-card">
          <div className="label">UTC TIMESTAMP</div>
          <div className="value glow">
            {utcTime.toUTCString()}
          </div>
        </div>

        <div className={`telemetry-card ${missionState.color}`}>
          <div className="label">MISSION STATE</div>
          <div className="value">{missionState.label}</div>
        </div>

      </div>

      {/* 📡 CORE TELEMETRY */}
      <div className="grid-3">

        <div className="telemetry-card">
          <div className="label">ORBITAL SPEED INDEX</div>
          <div className="value">{speed.toFixed(3)}</div>

          <input
            type="range"
            min="0.001"
            max="0.05"
            step="0.001"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
          />

          <div className="mini-bar blue" style={{ width: formatPercent(speed * 2000) }} />
        </div>

        <div className="telemetry-card">
          <div className="label">SATELLITE FLEET</div>
          <div className="value">{satelliteCount}</div>
          <div className="mini-bar blue" style={{ width: "72%" }} />
        </div>

        <div className="telemetry-card">
          <div className="label">DEBRIS FIELD</div>
          <div className="value">{debrisCount}</div>
          <div className="mini-bar yellow" style={{ width: "58%" }} />
        </div>

      </div>

      {/* ⚠ RISK ENGINE */}
      <div className="grid-2">

        <div className={`telemetry-card ${anomalyLevel.toLowerCase()}`}>
          <div className="label">ANOMALY LEVEL</div>
          <div className="value">{anomalyLevel}</div>
          <div className="pulse-ring" />
        </div>

        <div className="telemetry-card red">
          <div className="label">HAZARD INDEX</div>
          <div className="value">{hazardScore}</div>
          <div
            className="progress-bar red"
            style={{ width: formatPercent(hazardScore) }}
          />
        </div>

      </div>

      {/* 🧠 AI SYSTEM */}
      <div className="telemetry-card ai">

        <div className="label">AI TRAJECTORY ANALYSIS</div>

        <div className="value">
          {prediction
            ? `${prediction.time}s TO IMPACT`
            : "ANALYZING ORBITAL TRAJECTORIES..."}
        </div>

        <div className="subtle">
          {prediction
            ? `Distance: ${prediction.distance} km`
            : "Running predictive simulation model"}
        </div>

        <div
          className="progress-bar red"
          style={{
            width: prediction
              ? formatPercent(prediction.distance / 2)
              : "18%",
          }}
        />

      </div>

      {/* 🌍 STABILITY */}
      <div className="telemetry-card">

        <div className="label">ORBITAL STABILITY INDEX</div>

        <div className={`value ${missionState.color}`}>
          {stabilityIndex.toFixed(0)} / 100
        </div>

        <div
          className="progress-bar"
          style={{ width: formatPercent(stabilityIndex) }}
        />

      </div>

      {/* 📉 EVENT LOG */}
      <div className="telemetry-card log">

        <div className="label">EVENT LOG (STREAM BUFFERED)</div>

        <div className="log-list">
          {history.length === 0 && (
            <div className="subtle">No anomalies detected</div>
          )}

          {history.map((h, i) => (
            <div key={i} className="log-item">
              <span>{h.time}</span>
              <span>{h.event}</span>
              <span className={h.severity.toLowerCase()}>
                {h.severity}
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;