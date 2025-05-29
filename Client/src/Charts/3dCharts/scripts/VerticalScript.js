import React, { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import useResponsiveDimensions from '@/app/Components/Dimensions/page';

const BarChart3D = forwardRef(({ importingData }, ref) => {
  const { width, height } = useResponsiveDimensions();
  const canvasRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const animationRef = useRef();

  useImperativeHandle(ref, () => ({
    downloadScreenshot: () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        const imgData = rendererRef.current.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'threejs-screenshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  }));

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (controlsRef.current) {
      controlsRef.current.dispose();
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
    }
    window.removeEventListener('resize', handleResize);
  };

  const handleResize = () => {
    if (cameraRef.current && rendererRef.current) {
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    }
  };

  const init = async () => {
    cleanup(); // Clean up previous scene

    // === Basic Setup ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.position.set(-5, -4, 0);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(-10, 6, 10);
    camera.rotateY(Math.PI * 0.25);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(width, height);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // === Controls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // === Lights ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 250);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Create a group to hold all text
    const textGroup = new THREE.Group();

    // Load font and create text mesh
    const loadFont = async () => {
      return new Promise((resolve) => {
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
          resolve(font);
        }, undefined, () => resolve(null));
      });
    };

    const createText = async (font, text, size, x, y, z) => {
      const textGeo = new TextGeometry(text, {
        font: font,
        size: size,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      textGeo.computeBoundingBox();
      const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeo, textMaterial);
      textMesh.position.set(x + centerOffset, y, z);
      return textMesh;
    };

    if (!importingData) return;

    // === Global Dimensions ===
    const boxSize = 2;
    const allValues = importingData.series.flatMap(s => s.values);
    const max = Math.max(...allValues);
    const roundedMax = Math.ceil(max / 100) * 100;
    const step = roundedMax / 10;
    const labels = [];
    for (let i = 0; i <= roundedMax; i += step) {
      labels.push(i);
    }

    const Y = roundedMax;
    const X = importingData.series[0].values.length;
    const Z = importingData.series.length;
    const Step = step;

    // === Grid Lines ===
    const gridLines = new THREE.Group();
    const gridColor = new THREE.Color(0xcccccc);

    // Create grid lines (same as before)
    // +X,+Z plane → Vertical and Horizontal lines
    for (let x = 0; x <= X * boxSize; x += boxSize) {
      const points = [new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, 0, Z * boxSize)];
      gridLines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: gridColor })));
    }
    for (let z = 0; z <= Z * boxSize; z += boxSize) {
      const points = [new THREE.Vector3(0, 0, z), new THREE.Vector3(X * boxSize, 0, z)];
      gridLines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: gridColor })));
    }

    // +X,+Y plane
    for (let x = 0; x <= X * boxSize; x += boxSize) {
      const points = [new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, (Y / Step), 0)];
      gridLines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: gridColor })));
    }
    for (let y = 0; y <= ((Y / Step) * boxSize) + 1; y += boxSize) {
      const points = [new THREE.Vector3(0, y / boxSize, 0), new THREE.Vector3(X * boxSize, y / boxSize, 0)];
      gridLines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: gridColor })));
    }

    // +Z,+Y plane
    for (let z = 0; z <= Z * boxSize; z += boxSize) {
      const points = [new THREE.Vector3(X * boxSize, 0, z), new THREE.Vector3(X * boxSize, (Y / Step), z)];
      gridLines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: gridColor })));
    }
    for (let y = 0; y <= ((Y / Step) * boxSize) + 1; y += boxSize) {
      const points = [new THREE.Vector3(X * boxSize, y / boxSize, 0), new THREE.Vector3(X * boxSize, y / boxSize, Z * boxSize)];
      gridLines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: gridColor })));
    }



    scene.add(gridLines);

    // Load font once
    const font = await loadFont();
    if (!font) return;

    // Create axis labels
    for (let i = 0; i < labels.length; i++) {
      const textMesh = await createText(font, String(labels[i]), 0.2, -0.5, i, -0.5);
      textGroup.add(textMesh);
    }

    for (let i = 0; i < importingData.series.length; i++) {
      const textMesh = await createText(font, importingData.series[i].name, 0.2, -0.5, 0, i * boxSize + boxSize / 2);
      textGroup.add(textMesh);
    }

    for (let i = 0; i < importingData.labels.length; i++) {
      const textMesh = await createText(font, importingData.labels[i], 0.2, i * boxSize + boxSize / 2, 0, Z * boxSize + 0.5);
      textGroup.add(textMesh);
    }

    scene.add(textGroup);

    // Create bars
    for (let row = 0; row < importingData.series.length; row++) {
      const { values, color } = importingData.series[row];
      for (let col = 0; col < values.length; col++) {
        const value = values[col];
        const geometry = new THREE.BoxGeometry(1, value / Step, 1);
        const material = new THREE.MeshStandardMaterial({ color });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(col * boxSize + boxSize / 2, value / (2 * Step), row * boxSize + boxSize / 2);
        scene.add(bar);
      }
    }

    // Create title if exists
    let titleMesh;
    if (importingData.title) {
      titleMesh = await createText(font, importingData.title, 0.6, X * boxSize, Y / Step + 1, 0);
      scene.add(titleMesh);
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      controls.update();
      textGroup.children.forEach(child => {
        child.lookAt(camera.position);
      });
      if (titleMesh) {
        titleMesh.lookAt(camera.position)
      }
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', handleResize);
  };

  useEffect(() => {
    if (importingData) {
      init();
    }
    return cleanup;
  }, [importingData, width, height]);

  return <canvas className='md:w-[750px] sm:w-[550px] w-[400px] h-[293.3px] md:h-[550px] sm:h-[403px]' ref={canvasRef} />;
});

export default memo(BarChart3D);