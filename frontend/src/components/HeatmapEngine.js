import * as THREE from "three";

/**
 * 🌡 NASA-STYLE DYNAMIC HEATMAP SYSTEM
 * Efficient pooled + time-decay danger visualization
 */

/* =========================
   ⚙️ CONFIG
========================= */

const MAX_ZONES = 25;
const ZONE_LIFETIME = 1200; // ms
const SPAWN_THROTTLE = 120;

let lastSpawnTime = 0;

/* 🧠 object pool (prevents GC spikes) */
const activeZones = [];

/* Shared geometry (GPU optimization) */
const sharedGeometry = new THREE.CircleGeometry(10, 32);

/* =========================
   🔥 CREATE HEAT ZONE
========================= */

export function createHeatZone(scene, position, intensity = 1) {
  const now = Date.now();

  // ⏱ throttle spawn rate
  if (now - lastSpawnTime < SPAWN_THROTTLE) return;
  lastSpawnTime = now;

  // 🧹 prevent memory overload
  if (activeZones.length > MAX_ZONES) {
    const old = activeZones.shift();
    scene.remove(old.mesh);
    old.mesh.geometry.dispose();
    old.mesh.material.dispose();
  }

  const material = new THREE.MeshBasicMaterial({
    color: getHeatColor(intensity),
    transparent: true,
    opacity: 0.25 + intensity * 0.15,
  });

  const mesh = new THREE.Mesh(sharedGeometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.copy(position);

  const zone = {
    mesh,
    life: 1,
    intensity,
    createdAt: now,
  };

  activeZones.push(zone);
  scene.add(mesh);
}

/* =========================
   🔥 UPDATE SYSTEM (CALL IN ANIMATION LOOP)
========================= */

export function updateHeatZones(scene) {
  const now = Date.now();

  for (let i = activeZones.length - 1; i >= 0; i--) {
    const z = activeZones[i];

    const age = now - z.createdAt;
    const t = 1 - age / ZONE_LIFETIME;

    if (t <= 0) {
      scene.remove(z.mesh);
      continue;
    }

    // 🌡 smooth fade + expansion (heat diffusion feel)
    z.mesh.material.opacity = t * (0.25 + z.intensity * 0.2);
    z.mesh.scale.setScalar(1 + (1 - t) * 2.5);

    // slight upward drift = energy dissipation illusion
    z.mesh.position.y += 0.01;

    // remove expired
    if (t <= 0.05) {
      scene.remove(z.mesh);
      activeZones.splice(i, 1);
    }
  }
}

/* =========================
   🎨 HEAT COLOR GRADIENT SYSTEM
========================= */

function getHeatColor(intensity) {
  // green → yellow → orange → red
  if (intensity < 0.3) return 0x22c55e;
  if (intensity < 0.5) return 0xfacc15;
  if (intensity < 0.75) return 0xff8c00;
  return 0xff2d2d;
}