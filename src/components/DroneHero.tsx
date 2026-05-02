'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function DroneHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Drone Body (Simplistic Sci-Fi Hexagon)
    const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 6);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xc8f53e, 
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const drone = new THREE.Mesh(geometry, material);
    scene.add(drone);

    // Drone Arms/Rotors
    const armGeo = new THREE.BoxGeometry(3, 0.05, 0.1);
    const arm1 = new THREE.Mesh(armGeo, material);
    drone.add(arm1);
    
    const arm2 = new THREE.Mesh(armGeo, material);
    arm2.rotation.y = Math.PI / 2;
    drone.add(arm2);

    // Scanning Pyramid (Light Beam)
    const coneGeo = new THREE.ConeGeometry(2, 4, 4);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xc8f53e,
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
    const scanBeam = new THREE.Mesh(coneGeo, coneMat);
    scanBeam.rotation.x = Math.PI;
    scanBeam.position.y = -2.1;
    drone.add(scanBeam);

    camera.position.z = 5;
    camera.position.y = 1;

    let t = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      t += 0.01;
      
      drone.position.y = Math.sin(t) * 0.5;
      drone.rotation.y += 0.02;
      drone.rotation.x = Math.sin(t * 0.5) * 0.1;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
