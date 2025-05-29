import React, { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import useResponsiveDimensions from '@/app/Components/Dimensions/page';

const BubbleChart3D = forwardRef(({ importingData }, ref) => {
  const { width, height } = useResponsiveDimensions();
  const [dummyData, setDummyData] = useState([ // Initial dummy data
    { x: 5, y: 5, z: 5, size: 15, color: '#ff0000', title: "3D Bubble Chart", label: 'Apple' },
    { x: 15, y: 5, z: 10, size: 20, color: '#00ff00', title: "3D Bubble Chart", label: 'Microsoft' },
    { x: 5, y: 15, z: 8, size: 12, color: '#0000ff', title: "3D Bubble Chart", label: 'Tesla' },
    { x: 20, y: 25, z: 3, size: 18, color: '#0f0f0f', title: "3D Bubble Chart", label: 'Amazon' },
    { x: 8, y: 12, z: 15, size: 10, color: '#0f00ff', title: "3D Bubble Chart", label: 'JPMorgan' }
  ]);

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
    if (importingData && importingData.length > 0) {
      setDummyData(importingData);
    }
  }, [importingData]);

    const init = async () => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      scene.position.set(-10, -5, -3);

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(-20, 20, 20);
      camera.rotation.y = Math.PI * 0.25;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
      renderer.setSize(width, height);

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      const pointLight = new THREE.PointLight(0xffffff, 250);
      pointLight.position.set(-10, 10, 10);

      scene.add(ambientLight);
      scene.add(pointLight);

      const TextGroup = new THREE.Group();

      const loadFont = () => {
        return new Promise((resolve, reject) => {
          new FontLoader().load(
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            resolve,
            undefined,
            reject
          );
        });
      };

      const font = await loadFont();

      const createTextMesh = (text, size, x, y, z) => {
        const textGeo = new TextGeometry(text, {
          font,
          size,
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
        TextGroup.add(textMesh);
      };

      const boxSize = 2;
      let Ylabels = [], Xlabels = [], Zlabels = [], StepY, StepX, StepZ;

      const computeAxisScale = (data, axis) => {
        const values = data.map(item => item[axis]);
        const max = Math.max(...values);
        const roundedMax = Math.ceil(max / 10) * 10;
        const step = roundedMax / 10;
        const labels = [];
        for (let i = 0; i <= roundedMax; i += step) labels.push(i);
        return { labels, step };
      };

      ({ labels: Ylabels, step: StepY } = computeAxisScale(dummyData, 'y'));
      ({ labels: Xlabels, step: StepX } = computeAxisScale(dummyData, 'x'));
      ({ labels: Zlabels, step: StepZ } = computeAxisScale(dummyData, 'z'));

      const gridLines = new THREE.Group();
      const drawLines = () => {
        const createLine = (p1, p2, isMain = false) => {
          const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
          const color = isMain ? new THREE.Color('black') : new THREE.Color('#ccc');
          return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color }));
        };

        for (let i = 0; i <= 10 * boxSize; i += boxSize) {
          gridLines.add(createLine(new THREE.Vector3(i, 0, 0), new THREE.Vector3(i, 0, 10 * boxSize), i === 0));
          gridLines.add(createLine(new THREE.Vector3(0, 0, i), new THREE.Vector3(10 * boxSize, 0, i)));
          gridLines.add(createLine(new THREE.Vector3(i, 0, 0), new THREE.Vector3(i, 10 * boxSize, 0), i === 0));
          gridLines.add(createLine(new THREE.Vector3(0, i, 0), new THREE.Vector3(10 * boxSize, i, 0), i === 0));
          gridLines.add(createLine(new THREE.Vector3(10 * boxSize, 0, i), new THREE.Vector3(10 * boxSize, 10 * boxSize, i)));
          gridLines.add(createLine(new THREE.Vector3(10 * boxSize, i, 0), new THREE.Vector3(10 * boxSize, i, 10 * boxSize)));
        }
      };

      drawLines();
      scene.add(gridLines);

      Ylabels.forEach((val, i) => createTextMesh(String(val), 0.5, -0.5, i * boxSize, -0.5));
      Zlabels.slice(1).forEach((val, i) => createTextMesh(String(val), 0.5, -0.5, 0, (i + 1) * boxSize));
      Xlabels.slice(1).forEach((val, i) => createTextMesh(String(val), 0.5, (i + 1) * boxSize, 0, 10 * boxSize + 0.5));
      scene.add(TextGroup);

      const maxBubbleSize = Math.max(...dummyData.map(item => item.size));
      dummyData.forEach(data => {
        const radius = data.size / maxBubbleSize * 2;
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(data.color) });
        const sphere = new THREE.Mesh(geometry, material);

        const x = data.x * boxSize / StepX;
        const y = data.y * boxSize / StepY;
        const z = data.z * boxSize / StepZ;

        sphere.position.set(x, y, z);
        scene.add(sphere);
      });

      if (dummyData.length > 0) {
        createTextMesh(dummyData[0].title, 0.6, Xlabels.length * boxSize, Ylabels.length * boxSize, 0);
      }

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        TextGroup.children.forEach(e => e.lookAt(camera.position));
        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    };
    init();
    useEffect(() => {
      setDummyData(importingData)
      console.log("from script",importingData)
    }, [importingData,width,height])

    

  return <canvas className='md:w-[750px] sm:w-[550px] w-[400px] h-[293.3px] md:h-[550px] sm:h-[403px]' ref={canvasRef} />;
});

export default memo(BubbleChart3D, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.importingData) === JSON.stringify(nextProps.importingData);
});
