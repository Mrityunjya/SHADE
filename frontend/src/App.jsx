import { useState, useMemo } from "react";
import OrbitScene from "./components/OrbitScene.jsx";
import Dashboard from "./components/Dashboard.jsx";
import NASAHudLayer from "./components/NASAHudLayer.jsx";
import "./index.css";

function App() {
  const [speed, setSpeed] = useState(0.01);
  const [collisionCount, setCollisionCount] = useState(0);
  const [prediction, setPrediction] = useState(null);

  /* =========================
     🧠 GLOBAL MISSION STATE
  ========================= */

  const missionState = useMemo(() => {
    const risk =
      collisionCount === 0
        ? "SAFE"
        : collisionCount < 3
        ? "ELEVATED"
        : collisionCount < 6
        ? "CRITICAL"
        : "SEVERE";

    const stability = Math.max(100 - collisionCount * 8, 0);

    return {
      risk,
      stability,
      satelliteCount: 3,
      debrisCount: 10,
    };
  }, [collisionCount]);

  /* =========================
     🚀 RENDER LAYERS
  ========================= */

  return (
    <div className="app-container">

      {/* 🌌 3D SIMULATION LAYER */}
      <div className="scene-layer">
        <OrbitScene
          speed={speed}
          setCollisionCount={setCollisionCount}
          setPrediction={setPrediction}
        />
      </div>

      {/* 🛰 HUD OVERLAY (IN-WORLD DISPLAY) */}
      <NASAHudLayer
        prediction={prediction}
        collisionCount={collisionCount}
        stabilityIndex={missionState.stability}
      />

      {/* 🧠 CONTROL DASHBOARD (MISSION CONTROL PANEL) */}
      <Dashboard
        speed={speed}
        setSpeed={setSpeed}
        collisionCount={collisionCount}
        satelliteCount={missionState.satelliteCount}
        debrisCount={missionState.debrisCount}
        prediction={prediction}
      />

      {/* 🚨 FUTURE ALERT LAYER SLOT */}
      {/* 
      {missionState.risk === "SEVERE" && (
        <div className="overlay-alert danger">
          🚨 SEVERE ORBITAL INSTABILITY DETECTED
        </div>
      )}
      */}

    </div>
  );
}

export default App;