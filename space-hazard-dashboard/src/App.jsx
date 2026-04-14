import { useState } from "react";
import OrbitScene from "./components/OrbitScene.jsx";
import Dashboard from "./components/Dashboard.jsx";
import "./index.css";

function App() {
  const [speed, setSpeed] = useState(0.01);
  const [collisionCount, setCollisionCount] = useState(0);

  return (
    <div className="app">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <Dashboard
          speed={speed}
          setSpeed={setSpeed}
          collisionCount={collisionCount}
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <OrbitScene
          speed={speed}
          setCollisionCount={setCollisionCount}
        />
      </div>
    </div>
  );
}

export default App;