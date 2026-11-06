import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for mouse parallax
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Holographic Torus Knot (Futuristic Hardware Core)
    const torusGeometry = new THREE.TorusKnotGeometry(1.6, 0.35, 128, 32, 2, 3);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: true,
      wireframeLinewidth: 1.5,
      emissive: 0x7928ca,
      emissiveIntensity: 0.3,
    });
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    mainGroup.add(torusKnot);

    // 2. Inner Glowing Core Sphere
    const coreGeometry = new THREE.IcosahedronGeometry(0.9, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerCore = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(innerCore);

    // 3. Cyber Particles Cloud (Neon purple & cyan)
    const particleCount = 400;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const purpleColor = new THREE.Color(0xa855f7);
    const cyanColor = new THREE.Color(0x00e5ff);

    for (let i = 0; i < particleCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const radius = THREE.MathUtils.randFloat(2.5, 4.8);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = i % 2 === 0 ? purpleColor : cyanColor;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00e5ff, 3, 50);
    cyanPointLight.position.set(5, 5, 5);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, 3, 50);
    purplePointLight.position.set(-5, -5, 5);
    scene.add(purplePointLight);

    // Mouse Parallax Interaction
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetX = mouseX * 0.4;
      targetY = mouseY * 0.4;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation
      torusKnot.rotation.x = elapsedTime * 0.15;
      torusKnot.rotation.y = elapsedTime * 0.25;

      innerCore.rotation.x = -elapsedTime * 0.3;
      innerCore.rotation.y = -elapsedTime * 0.2;

      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = elapsedTime * 0.03;

      // Mouse parallax smooth dampening
      mainGroup.rotation.y += (targetX - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (-targetY - mainGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[480px] lg:min-h-[580px] flex items-center justify-center pointer-events-none"
    />
  );
}
