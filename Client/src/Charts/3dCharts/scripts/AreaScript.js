import React, { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import useResponsiveDimensions from '@/app/Components/Dimensions/page';

const AreaChart3D = forwardRef(({ importingData }, ref) => {
  const { width, height } = useResponsiveDimensions();
  const [dummyData, setdummyData] = useState({
    labels: ['Mar', 'Apr', 'May'],
    title: '3D Area Chart',
    series: [
      { name: 'Series 1', color: 'red', values: [205, 400, 100] },
      { name: 'Series 2', color: 'blue', values: [90, 500, 300] },
      { name: 'Series 3', color: 'yellow', values: [990, 650, 390] },
    ],
  })
  const canvasRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();

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

  useEffect(() => {
    // if (importingData) {
    setdummyData(importingData)
    // }
  }, [importingData])

  async function init() {

    // === Scene ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.position.set(-4, -4, 0);

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(-10, 6, 10);
    camera.rotateY(Math.PI * 0.25);

    // === Renderer ===
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

    // === Lights ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 250);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Create a group to hold all text
    const TextGroup = new THREE.Group();

    // Load font and create text mesh
    async function textLoader(text, size, x, y, z) {
      const loader = new FontLoader();
      try {

        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
          const textGeo = new TextGeometry(text, {
            font: font,
            size: size,
            depth: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
          });

          // Compute bounding box and center text
          textGeo.computeBoundingBox();
          const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

          const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
          const textMesh = new THREE.Mesh(textGeo, textMaterial);

          textMesh.position.set(x + centerOffset, y, z);

          TextGroup.add(textMesh);
        });
      } catch (error) {
        return
      }
    }

    let labels = [], Y, X, Z, Step;
    const boxSize = 2;

    function getYAxisScale() {
      if (!dummyData.series || dummyData.series.length === 0) return;
      const allValues = dummyData.series.flatMap(s => s.values);
      const max = Math.max(...allValues);

      //see the multiple of 100 which is greater than max
      const roundedMax = Math.ceil(max / 100) * 100;

      let step = roundedMax / 10

      const tempLabels = [];
      for (let i = 0; i <= roundedMax; i += step) {
        tempLabels.push(i);
      }

      labels = tempLabels;
      Y = roundedMax;
      X = dummyData.series.length;
      Z = dummyData.series[0].values.length;
      Step = step;
    }

    getYAxisScale();

    // === Grid Lines ===
    const gridLines = new THREE.Group();
    const gridColor = new THREE.Color(0xcccccc);

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
    // === Axis Labels ===
    async function YaxisLabels() {
      if (!labels || labels.length === 0) return;
      for (let i = 0; i < labels.length; i++) {
        await textLoader(String(labels[i]), 0.2, -0.5, i, -0.5);
      }
    }


    async function ZaxisLabels() {
      if (!dummyData.labels || dummyData.labels.length === 0) return;
      let ZLabels = dummyData.labels;
      for (let i = 0; i < ZLabels.length; i++) {
        await textLoader(String(ZLabels[i]), 0.2, -0.5, 0, i * boxSize + boxSize / 2)
      }
    }

    async function XaxisLabels() {

      if (!dummyData.series || dummyData.series.length === 0) return;
      let XLabels = dummyData.series.map(series => series.name);
      for (let i = 0; i < XLabels.length; i++) {
        await textLoader(String(XLabels[i]), 0.2, i * boxSize + boxSize / 2, 0, Z * boxSize + 0.5)
      }
    }


    await YaxisLabels();
    await ZaxisLabels();
    await XaxisLabels();

    scene.add(TextGroup)

    function createAreaGraphs(data) {
      data.series.forEach((series, row) => {
        const topPoints = [];
        const basePoints = [];
        series.values.forEach((value, col) => {
          const x = row * boxSize + boxSize / 2;
          const z = col * boxSize + boxSize / 2;
          const y = value / Step;
          const point = new THREE.Vector3(x, y, z);
          topPoints.push(point);
          basePoints.push(new THREE.Vector3(x, 0, z));
          // Create a small sphere at the point
          const sphereGeom = new THREE.SphereGeometry(0.15, 16, 16); // radius, widthSegments, heightSegments
          const sphereMat = new THREE.MeshStandardMaterial({ color: series.color });
          const sphere = new THREE.Mesh(sphereGeom, sphereMat);
          sphere.position.copy(point);
          scene.add(sphere);
        });

        // Create vertical area faces between each point and the base
        for (let i = 0; i < topPoints.length - 1; i++) {
          const p1 = topPoints[i];
          const p2 = topPoints[i + 1];
          const b1 = basePoints[i];
          const b2 = basePoints[i + 1];

          const geometry = new THREE.BufferGeometry();
          const vertices = new Float32Array([
            p1.x, p1.y, p1.z,
            b1.x, b1.y, b1.z,
            b2.x, b2.y, b2.z,

            p1.x, p1.y, p1.z,
            b2.x, b2.y, b2.z,
            p2.x, p2.y, p2.z,
          ]);

          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          geometry.computeVertexNormals();

          const material = new THREE.MeshStandardMaterial({
            color: series.color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
          });

          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
        }

        // Optionally add the original line as cylinders
        for (let i = 0; i < topPoints.length - 1; i++) {
          const start = topPoints[i];
          const end = topPoints[i + 1];
          const direction = new THREE.Vector3().subVectors(end, start);
          const length = direction.length();
          const cylinderGeom = new THREE.CylinderGeometry(0.04, 0.04, length, 8);
          const material = new THREE.MeshStandardMaterial({ color: series.color });
          const cylinder = new THREE.Mesh(cylinderGeom, material);

          const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
          cylinder.position.copy(midPoint);

          cylinder.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.clone().normalize()
          );

          scene.add(cylinder);
        }
      });
    }
    createAreaGraphs(dummyData);
    // === Creating Title ===
    if (!dummyData.title) {
      return;
    } else {
      textLoader(dummyData.title, 0.6, X * boxSize , Y / Step + 1, 0)
    }


    // === Render Loop ===
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      TextGroup.children.forEach(function (e) {
        e.lookAt(camera.position)
      })
      renderer.render(scene, camera);
    };
    animate();

    // === Responsive Resize ===
    const handleResize = () => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    // === Cleanup on unmount ===
    return () => {
      window.removeEventListener('resize', handleResize);
      btn?.removeEventListener('click', downloadScreenshot);
      renderer.dispose();
    };
  }
  init()

  return <canvas width={width} height={height} className='w-[widthpx] h-[heightpx]' ref={canvasRef} />;
});
export default memo(AreaChart3D, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.importingData) === JSON.stringify(nextProps.importingData);
});