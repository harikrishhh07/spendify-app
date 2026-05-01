import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DashboardThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050505, 0);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 8;

    // Create animated particles representing financial flow
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 80;
    const posArray = new Float32Array(particlesCnt * 3);

    for (let i = 0; i < particlesCnt * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 8;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xC9A96E,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create cursor-interactive expanding/contracting geometry
    const cursorGeometry = new THREE.IcosahedronGeometry(0.5, 4);
    const cursorMaterial = new THREE.MeshPhongMaterial({
      color: 0xC9A96E,
      transparent: true,
      opacity: 0.4,
      emissive: 0xC9A96E,
      emissiveIntensity: 0.3,
      wireframe: false,
    });
    const cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
    cursorMesh.position.z = 0;
    cursorMesh.baseScale = 0.5;
    scene.add(cursorMesh);

    // Create secondary cursor-tracking orb with trailing effect
    const orbGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const orbMaterial = new THREE.MeshPhongMaterial({
      color: 0x5DCAA5,
      transparent: true,
      opacity: 0.5,
      emissive: 0x5DCAA5,
      emissiveIntensity: 0.4,
    });
    const cursorOrb = new THREE.Mesh(orbGeometry, orbMaterial);
    cursorOrb.position.z = -1;
    scene.add(cursorOrb);

    // Create rotating rings (torus) for growth visualization
    const torusGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0xE24B4A, // Red
      transparent: true,
      opacity: 0.3,
      emissive: 0xE24B4A,
      emissiveIntensity: 0.2,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = Math.PI / 4;
    torus.rotation.z = Math.PI / 6;
    scene.add(torus);

    // Create second rotating ring
    const torusGeometry2 = new THREE.TorusGeometry(3, 0.08, 16, 100);
    const torusMaterial2 = new THREE.MeshPhongMaterial({
      color: 0x5DCAA5, // Teal
      transparent: true,
      opacity: 0.25,
      emissive: 0x5DCAA5,
      emissiveIntensity: 0.1,
    });
    const torus2 = new THREE.Mesh(torusGeometry2, torusMaterial2);
    torus2.rotation.x = Math.PI / 3;
    torus2.rotation.z = -Math.PI / 4;
    scene.add(torus2);

    // Create floating spheres representing data points
    const spheres = [];
    const sphereCount = 4;
    for (let i = 0; i < sphereCount; i++) {
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      const color = [0xC9A96E, 0x5DCAA5, 0xE24B4A, 0xC9A96E][i];
      const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.3,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        Math.cos((i / sphereCount) * Math.PI * 2) * 4,
        Math.sin((i / sphereCount) * Math.PI * 2) * 2,
        Math.cos((i / sphereCount) * Math.PI * 2) * 2
      );
      sphere.orbitRadius = 4;
      sphere.orbitSpeed = 0.005 + i * 0.002;
      sphere.orbitAngle = (i / sphereCount) * Math.PI * 2;
      spheres.push(sphere);
      scene.add(sphere);
    }

    // Add lighting
    const light1 = new THREE.PointLight(0xC9A96E, 1, 100);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x5DCAA5, 0.8, 80);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles slowly
      particles.rotation.x += 0.00008;
      particles.rotation.y += 0.00012;

      // Cursor-interactive expanding geometry
      const targetScaleX = 0.5 + Math.abs(mouseX) * 0.8;
      const targetScaleY = 0.5 + Math.abs(mouseY) * 0.8;
      const targetScaleZ = 0.5 + (Math.abs(mouseX) + Math.abs(mouseY)) * 0.4;
      
      cursorMesh.scale.x += (targetScaleX - cursorMesh.scale.x) * 0.1;
      cursorMesh.scale.y += (targetScaleY - cursorMesh.scale.y) * 0.1;
      cursorMesh.scale.z += (targetScaleZ - cursorMesh.scale.z) * 0.1;
      
      // Move cursor mesh to follow mouse
      cursorMesh.position.x = mouseX * 3;
      cursorMesh.position.y = mouseY * 3;
      cursorMesh.rotation.x += 0.008;
      cursorMesh.rotation.y += 0.012;
      
      // Secondary orb trails the primary mesh
      cursorOrb.position.x += (cursorMesh.position.x - cursorOrb.position.x) * 0.15;
      cursorOrb.position.y += (cursorMesh.position.y - cursorOrb.position.y) * 0.15;
      cursorOrb.rotation.x += 0.005;
      cursorOrb.rotation.y += 0.007;
      
      // Scale orb based on cursor intensity
      const cursorIntensity = (Math.abs(mouseX) + Math.abs(mouseY)) * 0.5;
      cursorOrb.scale.set(0.3 + cursorIntensity, 0.3 + cursorIntensity, 0.3 + cursorIntensity);

      // Rotate torus rings
      torus.rotation.x += 0.005;
      torus.rotation.y += 0.003;
      torus.rotation.z += 0.002;

      torus2.rotation.x -= 0.006;
      torus2.rotation.y -= 0.004;
      torus2.rotation.z += 0.003;

      // Animate orbiting spheres
      spheres.forEach((sphere) => {
        sphere.orbitAngle += sphere.orbitSpeed;
        sphere.position.x = Math.cos(sphere.orbitAngle) * sphere.orbitRadius;
        sphere.position.y = Math.sin(sphere.orbitAngle) * 2;
        sphere.position.z = Math.sin(sphere.orbitAngle * 0.5) * sphere.orbitRadius;
        
        // Rotate sphere
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.008;
      });

      // Camera follows mouse slightly for interactive effect
      camera.position.x = mouseX * 0.5;
      camera.position.y = mouseY * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}
