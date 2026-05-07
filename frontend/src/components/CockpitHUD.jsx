import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function CockpitHUD({ scene, camera, prediction, collisionCount }) {
  const meshRef = useRef();

  useEffect(() => {
    if (!scene || !camera) return;

    /* 🎯 HUD PLANE */
    const geometry = new THREE.PlaneGeometry(120, 80);

    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.85,
      color: 0x0a1a2f,
    });

    const panel = new THREE.Mesh(geometry, material);

    panel.position.set(0, 120, -200);
    panel.rotation.x = -0.3;

    scene.add(panel);
    meshRef.current = panel;

    return () => {
      scene.remove(panel);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, camera]);

  /* 🎯 follow camera slightly (cockpit feel) */
  useEffect(() => {
    if (!meshRef.current) return;

    const animate = () => {
      meshRef.current.position.x += (camera.position.x * 0.05 - meshRef.current.position.x) * 0.05;
      requestAnimationFrame(animate);
    };

    animate();
  }, [camera]);

  return null;
}