import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// 🧠 Engines
import { predictCollision } from "./PredictionEngine";
import { applyAvoidance, coordinateSatellites } from "./AvoidanceEngine";
import { createHeatZone } from "./HeatmapEngine";

// 🔥 NEW
import { getRiskLevel, getRiskColor } from "./AIEngine";
import { drawTrajectory } from "./TrajectoryEngine";

function OrbitScene({ speed = 0.01, setCollisionCount, setPrediction }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let frame = 0;
    let uiFrame = 0;

    const PHYSICS_STEP = 3;        // ⬆ reduced load
    const ASTEROID_SKIP = 3;       // ⬇ fewer checks per frame
    const LABEL_STEP = 5;          // ⬇ smoother UI

    /* =========================
       PERFORMANCE CACHE OBJECTS
    ========================= */

    const tempVec = new THREE.Vector3(); // reuse (NO GC spam)
    const tempScreen = new THREE.Vector3();

    /* SCENE */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    /* CAMERA */
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 200, 500);

    /* RENDERER */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* BLOOM */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        0.7,
        0.5,
        0.2
      )
    );

    /* CONTROLS */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /* LIGHT */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    scene.add(new THREE.PointLight(0xffffff, 4, 10000));

    /* STARS (UNCHANGED) */
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(8000 * 3);

    for (let i = 0; i < starPos.length; i++) {
      starPos[i] = (Math.random() - 0.5) * 9000;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 1 })
      )
    );

    /* SUN */
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(25, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffaa00 })
    );
    scene.add(sun);

    const planets = [];
    const satellites = [];
    const asteroids = [];

    /* LABEL SYSTEM */
    const labelContainer = document.createElement("div");
    Object.assign(labelContainer.style, {
      position: "absolute",
      top: 0,
      left: 0,
      pointerEvents: "none",
    });
    container.appendChild(labelContainer);

    function createLabel() {
      const div = document.createElement("div");
      Object.assign(div.style, {
        position: "absolute",
        fontSize: "10px",
        padding: "3px 6px",
        borderRadius: "6px",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        fontFamily: "monospace",
        willChange: "transform", // ⚡ GPU hint
      });
      labelContainer.appendChild(div);
      return div;
    }

    /* ORBITS + PLANETS (UNCHANGED) */
    function createOrbit(radius) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius - 0.5, radius + 0.5, 96), // reduced segments
        new THREE.MeshBasicMaterial({
          color: 0x44aaff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
        })
      );
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    }

    function createPlanet(size, distance, speedVal, color) {
      createOrbit(distance);

      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(size, 24, 24), // ⬇ lighter geometry
        new THREE.MeshStandardMaterial({ color })
      );

      planet.userData = {
        distance,
        angle: Math.random() * Math.PI * 2,
        speed: speedVal,
      };

      scene.add(planet);
      planets.push(planet);
      return planet;
    }

    function createSatellite(parent, dist, index) {
      const group = new THREE.Group();

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(5, 3, 3),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x00ffff,
          emissiveIntensity: 1.5,
        })
      );

      group.add(body);

      group.userData = {
        parent,
        distance: dist,
        angle: Math.random() * Math.PI * 2,
        speed: 0.03,
        label: createLabel(),
        id: "SAT-" + index,
        lastRisk: null,
      };

      scene.add(group);
      satellites.push(group);
    }

    /* ASTEROIDS */
    for (let i = 0; i < 1200; i++) {
      const a = new THREE.Mesh(
        new THREE.DodecahedronGeometry(Math.random() + 0.3, 0),
        new THREE.MeshStandardMaterial({ color: 0x777777 })
      );

      a.userData = {
        r: 240 + Math.random() * 40,
        ang: Math.random() * Math.PI * 2,
        speed: 0.0007,
      };

      asteroids.push(a);
      scene.add(a);
    }

    const earth = createPlanet(8, 150, 0.01, 0x2266ff);
    createPlanet(4, 60, 0.02, 0xaaaaaa);
    createPlanet(6, 100, 0.015, 0xffcc88);
    createPlanet(6, 200, 0.008, 0xff5533);
    createPlanet(12, 300, 0.004, 0xffaa88);

    createSatellite(earth, 25, 1);
    createSatellite(earth, 35, 2);
    createSatellite(earth, 45, 3);

    /* =========================
       ANIMATION LOOP (OPTIMIZED)
    ========================= */

    function animate() {
      requestAnimationFrame(animate);

      frame++;
      uiFrame++;

      const t = Date.now() * 0.0002;

      camera.position.x = Math.sin(t) * 400;
      camera.position.z = Math.cos(t) * 400;
      camera.lookAt(0, 0, 0);

      /* PLANETS */
      planets.forEach((p) => {
        p.userData.angle += p.userData.speed * speed * 50;
        p.position.x = p.userData.distance * Math.cos(p.userData.angle);
        p.position.z = p.userData.distance * Math.sin(p.userData.angle);
      });

      /* ASTEROIDS (LIGHTER UPDATE) */
      for (let i = 0; i < asteroids.length; i += ASTEROID_SKIP) {
        const a = asteroids[i];
        a.userData.ang += a.userData.speed;

        a.position.x = a.userData.r * Math.cos(a.userData.ang);
        a.position.z = a.userData.r * Math.sin(a.userData.ang);
      }

      let bestPrediction = null;

      satellites.forEach((s, idx) => {
        s.userData.angle += s.userData.speed;

        s.position.x =
          s.userData.parent.position.x +
          s.userData.distance * Math.cos(s.userData.angle);

        s.position.z =
          s.userData.parent.position.z +
          s.userData.distance * Math.sin(s.userData.angle);

        /* 🔥 THROTTLED AI */
        if (frame % PHYSICS_STEP === 0 && idx % 2 === 0) {
          const a = asteroids[(frame + idx) % asteroids.length];
          const result = predictCollision(s, a);

          if (result) {
            bestPrediction = result;

            createHeatZone(scene, result.point);
            drawTrajectory(scene, s.position.clone(), result.point);
            applyAvoidance(s, result);
          }
        }

        /* 🔥 LABEL (HEAVY OPTIMIZATION) */
        if (uiFrame % LABEL_STEP === 0) {
          tempScreen.copy(s.position).project(camera);

          const x = (tempScreen.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-tempScreen.y * 0.5 + 0.5) * window.innerHeight;

          const risk = getRiskLevel(bestPrediction);
          const color = getRiskColor(risk);

          if (s.userData.label) {
            s.userData.label.style.transform =
              `translate(${x}px,${y}px)`;

            s.userData.label.style.border = `1px solid ${color}`;
            s.userData.label.innerHTML =
              `${s.userData.id}<br/><span style="color:${color}">${risk}</span>`;
          }
        }
      });

      coordinateSatellites(satellites);

      /* PREDICTION THROTTLED */
      if (bestPrediction && setPrediction && frame % 15 === 0) {
        setPrediction({
          time: bestPrediction.time.toFixed(2),
          distance: bestPrediction.distance.toFixed(2),
        });
      }

      controls.update();
      composer.render();
    }

    animate();

    return () => {
      container.innerHTML = "";
      renderer.dispose();
      composer.dispose();
      controls.dispose();
    };
  }, [speed]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

export default OrbitScene;