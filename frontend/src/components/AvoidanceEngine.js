// components/AvoidanceEngine.js

/**
 * 🛰 NASA-STYLE AUTONOMOUS ORBIT CONTROL SYSTEM
 * Smooth, stable, physics-inspired avoidance logic
 */

/* =========================
   🚨 PRIMARY AVOIDANCE SYSTEM
========================= */

export function applyAvoidance(sat, prediction) {
  if (!sat || !prediction) return;

  const distance = prediction.distance || 999;

  // 🧠 Convert danger into smooth intensity curve (non-linear)
  const danger = Math.exp(-(distance - 10) * 0.25) * 25;

  // 🛰 Smooth orbital adjustment (no abrupt jumps)
  const targetShift = danger * 0.015;

  sat.userData.distance += targetShift;

  // 📡 Velocity dampening (prevents runaway acceleration)
  const damping = 0.98;
  sat.userData.speed =
    sat.userData.speed * damping + danger * 0.0008;

  // 🔥 Hard safety clamps (orbital stability boundary)
  sat.userData.distance = clamp(sat.userData.distance, 12, 90);
  sat.userData.speed = clamp(sat.userData.speed, 0.004, 0.06);
}

/* =========================
   🤝 SATELLITE FORMATION CONTROL
========================= */

export function coordinateSatellites(satellites) {
  if (!satellites || satellites.length < 2) return;

  const SAFE_DISTANCE = 28;
  const FORCE_FACTOR = 0.0018;

  for (let i = 0; i < satellites.length; i++) {
    for (let j = i + 1; j < satellites.length; j++) {
      const s1 = satellites[i];
      const s2 = satellites[j];

      if (!s1 || !s2) continue;

      const dist = s1.position.distanceTo(s2.position);

      if (dist < SAFE_DISTANCE) {
        const force = (SAFE_DISTANCE - dist) * FORCE_FACTOR;

        // 🧠 Bidirectional separation (balanced physics)
        s1.userData.distance += force;
        s2.userData.distance -= force;

        // 🔒 Prevent orbit collapse or explosion
        s1.userData.distance = clamp(s1.userData.distance, 12, 90);
        s2.userData.distance = clamp(s2.userData.distance, 12, 90);

        // 🛰 Micro velocity correction (stabilizes jitter)
        s1.userData.speed *= 0.999;
        s2.userData.speed *= 0.999;
      }
    }
  }
}

/* =========================
   🧠 UTILITY: SAFE CLAMP
========================= */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}