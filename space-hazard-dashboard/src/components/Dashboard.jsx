import { useState, useEffect } from "react";

function Dashboard({ speed, setSpeed, collisionCount, satelliteCount = 3, debrisCount = 10 }) {
  const [collisionHistory, setCollisionHistory] = useState([]);
  const [utcTime, setUtcTime] = useState(new Date());
  const hazardScore = collisionCount * 10;

  // Update collision history
  useEffect(() => {
    if (collisionCount > 0) {
      const now = new Date();
      setCollisionHistory((prev) => [
        { time: now.toLocaleTimeString(), count: collisionCount },
        ...prev.slice(0, 4), // keep last 5 collisions
      ]);
    }
  }, [collisionCount]);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setUtcTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        width: "550px",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: 30,
        background: `radial-gradient(circle at 20% 20%, rgba(10,10,30,0.9), rgba(0,0,0,0.8)),
                     url('/textures/galaxy_glitter.jpg') center/cover no-repeat`,
        borderRadius: 15,
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 20px rgba(56,189,248,0.5)",
        color: "white",
        zIndex: 10,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ color: "#38bdf8", marginBottom: 25, textShadow: "0 0 12px #38bdf8, 0 0 20px #0ea5e9" }}>
        🚀 Space Hazard Control Room
      </h2>

      {/* Live Clock */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3>🕒 UTC Time</h3>
        <p style={{ fontSize: 18, fontWeight: "bold", textShadow: "0 0 6px #38bdf8" }}>
          {utcTime.toUTCString()}
        </p>
      </div>

      {/* Orbit Speed */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3>Orbit Speed</h3>
        <input
          type="range"
          min="0.001"
          max="0.05"
          step="0.001"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <p>Current speed: <strong>{speed.toFixed(3)}</strong></p>
        <div style={{ marginTop: 5, height: 8, background: "rgba(15,23,42,0.5)", borderRadius: 4 }}>
          <div style={{
            width: `${(speed / 0.05) * 100}%`,
            height: "100%",
            background: "#38bdf8",
            borderRadius: 4,
            boxShadow: "0 0 10px #38bdf8",
            transition: "width 0.2s ease"
          }} />
        </div>
      </div>

      {/* Collision Alerts */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3>⚠ Collision Alerts</h3>
        <p style={{ fontSize: 32, fontWeight: "bold", color: "#ef4444", textShadow: "0 0 12px #ef4444,0 0 20px #f87171" }}>
          {collisionCount}
        </p>
        <div style={{ height: 8, background: "rgba(30,41,59,0.5)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            width: `${Math.min(collisionCount * 10, 100)}%`,
            height: "100%",
            background: "#ef4444",
            borderRadius: 4,
            boxShadow: "0 0 8px #ef4444",
            transition: "width 0.3s ease"
          }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 12 }}>
          <strong>Recent Collisions:</strong>
          <ul style={{ paddingLeft: 15 }}>
            {collisionHistory.length === 0 && <li>None yet</li>}
            {collisionHistory.map((c, i) => (
              <li key={i}>{c.time} - Total: {c.count}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Satellite & Debris Counts */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3>🛰 Satellites</h3>
        <p style={{ fontWeight: "bold", textShadow: "0 0 6px #38bdf8" }}>{satelliteCount}</p>
        <h3>☄️ Debris</h3>
        <p style={{ fontWeight: "bold", textShadow: "0 0 6px #facc15" }}>{debrisCount}</p>
      </div>

      {/* Hazard Score */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3>Hazard Score</h3>
        <p style={{
          fontSize: 30, fontWeight: "bold",
          color: hazardScore < 50 ? "#22c55e" : hazardScore < 100 ? "#facc15" : "#ef4444",
          textShadow: `0 0 10px ${hazardScore < 50 ? "#22c55e" : hazardScore < 100 ? "#facc15" : "#ef4444"}`
        }}>{hazardScore}</p>
        <div style={{ height: 8, background: "rgba(30,41,59,0.5)", borderRadius: 4 }}>
          <div style={{
            width: `${Math.min(hazardScore, 100)}%`,
            height: "100%",
            background: hazardScore < 50 ? "#22c55e" : hazardScore < 100 ? "#facc15" : "#ef4444",
            borderRadius: 4,
            boxShadow: `0 0 8px ${hazardScore < 50 ? "#22c55e" : hazardScore < 100 ? "#facc15" : "#ef4444"}`,
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      {/* Status */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3>Status</h3>
        <p style={{
          fontWeight: "bold",
          fontSize: 18,
          color: collisionCount === 0 ? "#22c55e" : "#ef4444",
          textShadow: collisionCount === 0 ? "0 0 10px #22c55e" : "0 0 12px #ef4444"
        }}>
          {collisionCount === 0 ? "✅ Stable Orbit" : "⚠ High Risk Zone"}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;