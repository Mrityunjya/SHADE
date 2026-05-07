// components/AIEngine.js

/**
 * 🧠 AI RISK ENGINE (PRO TELEMETRY VERSION)
 * Converts raw prediction → structured mission intelligence
 */

/* =========================
   🧠 CORE RISK ENGINE
========================= */

export function computeRisk(prediction = {}) {
  const {
    distance = 999,
    time = 999,
    velocity = 0,
  } = prediction;

  // Normalize factors
  const distanceFactor = Math.max(0, 100 - distance * 6);   // closer = worse
  const timeFactor = Math.max(0, 100 - time * 5);           // sooner = worse
  const velocityFactor = Math.min(velocity * 10, 100);      // faster = worse

  // Weighted risk model (NASA-style heuristic scoring)
  const score =
    distanceFactor * 0.45 +
    timeFactor * 0.4 +
    velocityFactor * 0.15;

  return Math.max(0, Math.min(100, score));
}

/* =========================
   🚨 RISK CLASSIFICATION
========================= */

export function getRiskLevel(prediction) {
  if (!prediction) return "SAFE";

  const score = computeRisk(prediction);

  if (score >= 75) return "CRITICAL";
  if (score >= 50) return "WARNING";
  if (score >= 25) return "EVADE";
  return "SAFE";
}

/* =========================
   🎨 COLOR MAPPING (CONSISTENT UI SYSTEM)
========================= */

export function getRiskColor(levelOrPrediction) {
  // allow both direct level or prediction object
  const level =
    typeof levelOrPrediction === "string"
      ? levelOrPrediction
      : getRiskLevel(levelOrPrediction);

  switch (level) {
    case "CRITICAL":
      return "#ff2d2d"; // deep alert red
    case "WARNING":
      return "#ff8c00"; // orange alert
    case "EVADE":
      return "#facc15"; // yellow caution
    case "SAFE":
    default:
      return "#22c55e"; // green stable
  }
}

/* =========================
   📡 MISSION STATE ENGINE (OPTIONAL BUT POWERFUL)
========================= */

export function getMissionState(prediction) {
  const score = computeRisk(prediction);

  if (score >= 75) {
    return {
      state: "MISSION COMPROMISED",
      priority: 1,
    };
  }

  if (score >= 50) {
    return {
      state: "TRAJECTORY INSTABILITY",
      priority: 2,
    };
  }

  if (score >= 25) {
    return {
      state: "MONITORING REQUIRED",
      priority: 3,
    };
  }

  return {
    state: "NOMINAL ORBIT",
    priority: 4,
  };
}

/* =========================
   📊 TELEMETRY SUMMARY (FOR DASHBOARD)
========================= */

export function getAIReport(prediction) {
  const score = computeRisk(prediction);
  const level = getRiskLevel(prediction);
  const state = getMissionState(prediction);

  return {
    score: Number(score.toFixed(2)),
    level,
    state: state.state,
    priority: state.priority,
  };
}