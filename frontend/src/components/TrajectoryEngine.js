import * as THREE from "three";

/**
 * 🚀 NASA-STYLE TRAJECTORY VISUALIZATION ENGINE
 * High-performance, pooled, risk-aware prediction lines
 */

/* =========================
   ⚙️ CONFIG + POOL SYSTEM
========================= */

const MAX_TRAILS = 30;
const ACTIVE_TRAILS = [];

const sharedCurve = new THREE.QuadraticBezierCurve3();

/* =========================
   🎯 MAIN FUNCTION
========================= */

export function drawTrajectory(scene, start, end, risk = 0.5) {
  if (!scene || !start || !end) return;

  /* 🧹 POOL LIMIT (prevents FPS drops) */
  if (ACTIVE_TRAILS.length > MAX_TRAILS) {
    const old = ACTIVE_TRAILS.shift();
    scene.remove(old.line);
    old.geometry.dispose();
    old.material.dispose();
  }

  /* =========================
     📡 DYNAMIC CURVE HEIGHT (AI-based arc)
  ========================= */

  const distance = start.distanceTo(end);

  const height = Math.min(60, 10 + distance * 0.15 + risk * 30);

  const mid = start.clone().lerp(end, 0.5);
  mid.y += height;

  /* =========================
     🧠 CURVE GENERATION
  ========================= */

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(25);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  /* =========================
     🎨 RISK-BASED COLOR SYSTEM
  ========================= */

  const color = getTrajectoryColor(risk);

  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15 + risk * 0.7,
  });

  const line = new THREE.Line(geometry, material);

  scene.add(line);

  const trail = {
    line,
    geometry,
    material,
    life: 1,
    decay: 0.03 + risk * 0.02,
  };

  ACTIVE_TRAILS.push(trail);

  /* =========================
     ⏱ NO setTimeout → FRAME-BASED CLEANUP
  ========================= */

  return trail;
}

/* =========================
   🔄 UPDATE FUNCTION (CALL IN ANIMATION LOOP)
========================= */

export function updateTrajectories(scene) {
  for (let i = ACTIVE_TRAILS.length - 1; i >= 0; i--) {
    const t = ACTIVE_TRAILS[i];

    t.life -= t.decay;

    if (t.life <= 0) {
      scene.remove(t.line);
      t.geometry.dispose();
      t.material.dispose();
      ACTIVE_TRAILS.splice(i, 1);
      continue;
    }

    // 🌫 fade effect
    t.material.opacity *= t.life;

    // slight pulsation (feels like live prediction)
    t.line.scale.setScalar(1 + (1 - t.life) * 0.05);
  }
}

/* =========================
   🎨 TRAJECTORY COLOR ENGINE
========================= */

function getTrajectoryColor(risk) {
  // green → yellow → orange → red gradient system
  if (risk < 0.3) return 0x22c55e;
  if (risk < 0.5) return 0xfacc15;
  if (risk < 0.75) return 0xff8c00;
  return 0xff2d2d;
}