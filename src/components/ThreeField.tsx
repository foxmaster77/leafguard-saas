'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeField() {
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

    // Field Grid
    const size = 20;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(size, divisions, 0xc8f53e, 0x1a240a);
    scene.add(gridHelper);

    // "Crops" - Points/Particles
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 400;
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      const x = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 18;
      const y = Math.random() * 0.2;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Randomize health colors (Green to Yellow/Red)
      const health = Math.random();
      if (health > 0.8) {
        colors[i * 3] = 0.78; // Lime R
        colors[i * 3 + 1] = 0.96; // Lime G
        colors[i * 3 + 2] = 0.24; // Lime B
      } else if (health > 0.4) {
        colors[i * 3] = 0.9; 
        colors[i * 3 + 1] = 0.8; 
        colors[i * 3 + 2] = 0.1;
      } else {
        colors[i * 3] = 1.0; 
        colors[i * 3 + 1] = 0.3; 
        colors[i * 3 + 2] = 0.3;
      }
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Scanning Beam
    const beamGeometry = new THREE.BoxGeometry(20, 0.05, 0.5);
    const beamMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xc8f53e, 
      transparent: true, 
      opacity: 0.3 
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    scene.add(beam);

    camera.position.set(10, 8, 10);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate points slowly
      points.rotation.y += 0.001;
      
      // Move scanning beam
      beam.position.z = Math.sin(Date.now() * 0.001) * 9;
      
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
