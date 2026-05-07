import * as THREE from "three";

/**
 * 🧠 NASA-STYLE ORBITAL PREDICTION ENGINE
 * Fast, vector-based, probabilistic collision forecasting
 */

/* =========================
   🚀 MAIN PREDICTION FUNCTION
========================= */

export function predictCollision(sat, asteroid) {
  if (!sat || !asteroid) return null;

  const steps = 25; // optimized (was 40)
  const dt = 0.6;

  let closestDistance = Infinity;
  let bestState = null;

  for (let i = 1; i <= steps; i++) {
    const t = i * dt;

    /* =========================
       🛰 SATELLITE FUTURE POSITION
    ========================= */

    const satAngle =
      sat.userData.angle + sat.userData.speed * t;

    const satFuture = new THREE.Vector3(
      sat.userData.parent.position.x +
        sat.userData.distance * Math.cos(satAngle),
      0,
      sat.userData.parent.position.z +
        sat.userData.distance * Math.sin(satAngle)
    );

    /* =========================
       ☄ ASTEROID FUTURE POSITION
    ========================= */

    const astAngle =
      asteroid.userData.ang + asteroid.userData.speed * t;

    const astFuture = new THREE.Vector3(
      asteroid.userData.r * Math.cos(astAngle),
      0,
      asteroid.userData.r * Math.sin(astAngle)
    );

    const distance = satFuture.distanceTo(astFuture);

    /* =========================
       🧠 TRACK CLOSEST APPROACH
    ========================= */

    if (distance < closestDistance) {
      closestDistance = distance;

      bestState = {
        time: t,
        distance,
        point: satFuture.clone(),

        // 🔥 NEW: intelligence layer
        confidence: computeConfidence(distance, t),
        risk: computeRiskScore(distance, t),
      };
    }

    /* =========================
       🚨 HARD COLLISION CHECK
    ========================= */

    if (distance < 8) {
      return {
        collision: true,
        ...bestState,
        severity: "IMPACT IMMINENT",
      };
    }
  }

  return bestState;
}

/* =========================
   🧠 AI CONFIDENCE MODEL
========================= */

function computeConfidence(distance, time) {
  // closer + sooner = higher confidence
  const d = Math.max(0, 1 - distance / 50);
  const t = Math.max(0, 1 - time / 20);

  return Math.min(1, (d + t) / 2);
}

/* =========================
   📊 RISK SCORING MODEL (0–100)
========================= */

function computeRiskScore(distance, time) {
  const distanceRisk = Math.max(0, 100 - distance * 6);
  const timeRisk = Math.max(0, 100 - time * 5);

  return Math.min(100, distanceRisk * 0.6 + timeRisk * 0.4);
}