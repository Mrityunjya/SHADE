import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function OrbitScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 200, 500);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /* ⭐ STARS */
    const starGeo = new THREE.BufferGeometry();
    const starCount = 6000;
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 8000;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 1 })
      )
    );

    /* 💡 LIGHT */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const sunLight = new THREE.PointLight(0xffffff, 3.5, 9000);
    scene.add(sunLight);

    const loader = new THREE.TextureLoader();
    const objects = [];
    let earthRef = null;

    /* 🌞 SUN */
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(25, 32, 32),
      new THREE.MeshStandardMaterial({
        map: loader.load("/textures/sun.jpg"),
        emissive: 0xffaa00,
        emissiveIntensity: 2.5,
      })
    );
    scene.add(sun);

    /* 🌟 ORBIT RING */
    function createOrbitRing(radius) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius - 0.6, radius + 0.6, 128),
        new THREE.MeshBasicMaterial({
          color: 0x44aaff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        })
      );
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    }

    /* 🪐 PLANET */
    function createPlanet(size, texture, distance, speed, moonCount = 0, isSaturn = false, isEarth = false) {

      createOrbitRing(distance);

      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshStandardMaterial({
          map: loader.load(`/textures/${texture}`),
        })
      );

      planet.userData = {
        distance,
        angle: Math.random() * Math.PI * 2,
        speed,
      };

      scene.add(planet);
      objects.push(planet);

      if (isEarth) earthRef = planet;

      if (isSaturn) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(size + 3, size + 8, 64),
          new THREE.MeshBasicMaterial({
            color: 0xd2b48c,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
          })
        );
        ring.rotation.x = Math.PI / 2;
        planet.add(ring);
      }

      for (let i = 0; i < moonCount; i++) {
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(size * 0.3, 16, 16),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xaaaaaa,
            emissiveIntensity: 0.7,
          })
        );

        moon.userData = {
          parent: planet,
          angle: Math.random() * Math.PI * 2,
          distance: size * 4 + i * 4,
          speed: 0.03 + Math.random() * 0.02,
        };

        scene.add(moon);
        objects.push(moon);
      }
    }

    /* 🛰 SATELLITE TYPE 1 */
    function createSatellite(parent, orbitRadius, speed) {
      const group = new THREE.Group();

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(4, 4, 6),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x888888,
          emissiveIntensity: 1.5,
        })
      );
      group.add(body);

      const panelGeo = new THREE.BoxGeometry(12, 0.5, 5);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x3366ff,
        emissive: 0x2244ff,
        emissiveIntensity: 2,
      });

      const left = new THREE.Mesh(panelGeo, panelMat);
      left.position.x = -9;
      group.add(left);

      const right = new THREE.Mesh(panelGeo, panelMat);
      right.position.x = 9;
      group.add(right);

      const blink = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      blink.position.y = 3;
      group.add(blink);

      group.userData = {
        parent,
        angle: Math.random() * Math.PI * 2,
        distance: orbitRadius,
        speed,
        blink,
        timer: 0,
      };

      scene.add(group);
      objects.push(group);
    }

    /* 🪨 ASTEROID BELT */
    const asteroidBelt = new THREE.Group();
    for (let i = 0; i < 2500; i++) {
      const size = Math.random() * 1.5 + 0.5;
      const asteroid = new THREE.Mesh(
        new THREE.DodecahedronGeometry(size),
        new THREE.MeshStandardMaterial({ color: 0x777777 })
      );

      const radius = 215 + Math.random() * 40;
      const angle = Math.random() * Math.PI * 2;

      asteroid.position.x = radius * Math.cos(angle);
      asteroid.position.z = radius * Math.sin(angle);
      asteroid.position.y = (Math.random() - 0.5) * 10;

      asteroid.userData = { angle, radius, speed: 0.0006 };
      asteroidBelt.add(asteroid);
    }
    scene.add(asteroidBelt);

    /* 🪐 PLANETS */
    createPlanet(4, "mercury.jpg", 60, 0.02);
    createPlanet(5, "venus.jpg", 95, 0.015);
    createPlanet(7, "earth.jpg", 140, 0.01, 2, false, true);
    createPlanet(5, "mars.jpg", 180, 0.008);
    createPlanet(12, "jupyter.jpg", 250, 0.004, 4);
    createPlanet(11, "saturn.jpg", 330, 0.003, 3, true);
    createPlanet(9, "uranus.jpg", 400, 0.002);
    createPlanet(9, "neptune.jpg", 460, 0.0015);

    /* 🛰 ADD SATELLITES TO EARTH */
    createSatellite(earthRef, 25, 0.03);
    createSatellite(earthRef, 35, 0.025);
    createSatellite(earthRef, 45, 0.02);

    /* 🔄 ANIMATION */
    function animate() {
      requestAnimationFrame(animate);

      sun.rotation.y += 0.002;

      objects.forEach((obj) => {
        obj.userData.angle += obj.userData.speed;

        if (!obj.userData.parent) {
          obj.position.x = obj.userData.distance * Math.cos(obj.userData.angle);
          obj.position.z = obj.userData.distance * Math.sin(obj.userData.angle);
        } else {
          obj.position.x =
            obj.userData.parent.position.x +
            obj.userData.distance * Math.cos(obj.userData.angle);
          obj.position.z =
            obj.userData.parent.position.z +
            obj.userData.distance * Math.sin(obj.userData.angle);

          if (obj.userData.blink) {
            obj.userData.timer += 0.05;
            const i = Math.abs(Math.sin(obj.userData.timer));
            obj.userData.blink.material.color.setRGB(1, i, i);
          }
        }
      });

      asteroidBelt.children.forEach((a) => {
        a.userData.angle += a.userData.speed;
        a.position.x = a.userData.radius * Math.cos(a.userData.angle);
        a.position.z = a.userData.radius * Math.sin(a.userData.angle);
      });

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    return () => container.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

export default OrbitScene;