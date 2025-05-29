"use client";
import React, { useRef, useState, useEffect } from "react";
import { Download, Bookmark, Plus, Trash, Check, Info } from "lucide-react";
import ExcelReader from "../../Input/HVPDPL";
import ".styles/page.css";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import useResponsiveDimensions from "@/app/Components/Dimensions/page";

const PolarAreaChart3D = () => {
    const { width, height } = useResponsiveDimensions();
    // array of colors 
    let Colors = ["#0000FF", "#FF0000", "#008000", "#FFFF00", "#800080", "#FFA500", "#FFC0CB", "#A52A2A", "#808080", "#00FFFF"];
    const [Headers, setHeaders] = useState(["Category", "Value"]);
    const [Data, setData] = useState([
        { "Category": "A", "Value": 40, "color": "#0000FF" },
        { "Category": "B", "Value": 50, "color": "#FF0000" },
        { "Category": "C", "Value": 60, "color": "#008000" },
        { "Category": "D", "Value": 70, "color": "#FFFF00" },
        { "Category": "E", "Value": 80, "color": "#800080" },
        { "Category": "F", "Value": 90, "color": "#FFA500" }
    ]);
    const [dummyData, setdummyData] = useState([
        { "Category": "A", "Value": 40, "color": "#0000FF" },
        { "Category": "B", "Value": 50, "color": "#FF0000" },
        { "Category": "C", "Value": 60, "color": "#008000" },
        { "Category": "D", "Value": 70, "color": "#FFFF00" },
        { "Category": "E", "Value": 80, "color": "#800080" },
        { "Category": "F", "Value": 90, "color": "#FFA500" }
    ]);
    const [chartTitle, setChartTitle] = useState("Polar Area Chart")

    const canvasRef = useRef();
    const rendererRef = useRef();
    const sceneRef = useRef();
    const cameraRef = useRef();


    async function init() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.position.set(0, 0, 2);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 20, 0);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
        });
        renderer.setSize(width, height);
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 350);
        pointLight.position.set(-10, 10, 10);
        scene.add(pointLight);

        function textLoader(text, size, x, y, z) {
            return new Promise((resolve, reject) => {
                const loader = new FontLoader();
                loader.load(
                    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
                    (font) => {
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
                        textMesh.rotation.x = -Math.PI * 0.5;
                        resolve(textMesh);
                    },
                    undefined,
                    (err) => reject(err)
                );
            });
        }


        let labels = []
        let Step;
        function getYAxisScale(data) {
            const maxValue = Math.max(...data.map(d => d[Headers[1]]));

            //find the nearest multiple of 10 above the max value
            const finalMax = Math.ceil(maxValue / 10) * 10;


            // Step 4: Generate 11 labels from 0 to finalMax
            const labels = [];
            const step = finalMax / 10;
            for (let i = 0; i <= 10; i++) {
                labels.push(i * step);
            }
            Step = step
            return labels;
        }


        labels = getYAxisScale(Data)

        // Concentric rings in XZ plane
        const numCircles = 10;
        const ringMaterial = new LineMaterial({
            color: "#ccc",
            linewidth: 1,
            vertexColors: false,
        });
        ringMaterial.resolution.set(window.innerWidth, window.innerHeight); // Required

        for (let i = 1; i <= numCircles; i++) {
            const radius = i;
            const segments = 64;
            const positions = [];

            for (let j = 0; j <= segments; j++) {
                const angle = (j / segments) * Math.PI * 2;
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);
                positions.push(x, 0, z);
            }

            const geometry = new LineGeometry();
            geometry.setPositions(positions);
            const circle = new Line2(geometry, ringMaterial);
            scene.add(circle);
        }

        //a ansyncronus function to create text mesh 
        async function Labelmaker() {
            for (let i = 0; i < labels.length; i++) {
                const element = labels[i];
                const textMesh = await textLoader(String(element), 0.5, i, 0.05, 0);
                scene.add(textMesh);
            }
        }
        Labelmaker();


        const chart = new THREE.Group();
        async function ChartMaker() {
            const total = Data.length;
            const depth = 0.2;
            let startAngle = 0;

            for (let i = 0; i < Data.length; i++) {
                const slice = Data[i];
                const anglePerSlice = (Math.PI * 2) / total;
                const endAngle = startAngle + anglePerSlice;
                const radius = slice[Headers[1]] / Step;

                const shape = new THREE.Shape();
                shape.moveTo(0, 0);
                for (let a = startAngle; a <= endAngle; a += 0.01) {
                    shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
                }
                shape.lineTo(0, 0);

                const extrudeSettings = {
                    depth: depth,
                    bevelEnabled: false,
                };

                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                const material = new THREE.MeshStandardMaterial({
                    color: slice.color || '#888',
                    opacity:0.6, 
                    side: THREE.DoubleSide,
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.x = -Math.PI / 2;
                chart.add(mesh);

                // Label
                const midAngle = (startAngle + endAngle) / 2;
                const labelRadius = radius * 1.1;
                const x = Math.cos(-midAngle) * labelRadius;
                const z = Math.sin(-midAngle) * labelRadius;
                const y = depth + 0.2;

                const label = `${slice[Headers[0]]} (${Number(slice[Headers[1]]).toFixed(1)})`;
                const textMesh = await textLoader(label, 0.6, x, y, z);
                chart.add(textMesh);

                // Update startAngle for the next slice
                startAngle = endAngle;
            }
        }
        
        scene.add(chart);
        ChartMaker();
        try {
            const titleMesh = await textLoader(chartTitle, 1.2, 0, 0, -12);
            scene.add(titleMesh);
        } catch (err) {
            console.error("Title text failed to load", err);
        }

        const handleResize = () => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }

    useEffect(() => {
        init();
    }, [Data, width, height]);

    const handleExcelData = ({ data, headers }) => {
        // Add default colors if not present in imported data
        const dataWithColors = data.map((item, index) => ({
            ...item,
            color: item.color || Colors[index % Colors.length]
        }));
        setHeaders(headers)
        setData(dataWithColors);
        setdummyData(dataWithColors);
    };

    const submit = () => {
        setData([...dummyData]);
    }

    const addRow = () => {
        const newRow = {
            [Headers[0]]: `${Headers[0]} ${dummyData.length + 1}`,
            [Headers[1]]: 0,
            color: Colors[dummyData.length % Colors.length]
        };
        setdummyData([...dummyData, newRow]);
    }

    const deleteRow = (index) => {
        const updatedData = dummyData.filter((_, i) => i !== index);
        setdummyData(updatedData);
    }


    const downloadChart = () => {
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
    };

    const save = () => {
        let saveicon = document.getElementsByClassName("saveicon")[0];
        saveicon.style.fill = saveicon.style.fill === "rgb(20, 17, 168)" ? "rgb(255, 255, 255)" : "rgb(20, 17, 168)";
    }

    const displayInstructions = () => {
        const instructions = document.querySelector(".instructions");
        instructions.classList.toggle("hidden");
        instructions.classList.toggle("flex");
    }

    return (
        <div className="w-[100vw] overflow-x-hidden relative pt-7 md:px-10 px-4 pb-10">
            <Info onClick={displayInstructions} className="top-5 absolute z-[100] right-5 text-gray-500 cursor-pointer" size={20} />
            <div className="instructions absolute w-full md:top-[45%] top-[25%] overflow-hidden z-50 hidden justify-center items-center">
                <div className="flex flex-col justify-center items-center md:w-[700px] w-[500px] h-fit py-5 px-3 bg-white/10 backdrop-blur-md rounded-xl border border-black p-6 text-black">
                    <h1 className="text-2xl font-bold underline-offset-2 underline">Instructions to User </h1>
                    <ul className="text-lg font-semibold mt-5 list-decimal px-5">
                        <li>Import the Data similar to the Default one</li>
                        <li>if you don't have similar one just Edit the Data in the Default one</li>
                        <li>Click Submit Data to see the Changes</li>
                        <li>After the Changes adjust the Chart so You can see the Full Chart and Click Download Button Or Save</li>
                    </ul>
                </div>
            </div>
            <h1 className="text-3xl w-full text-center font-bold mb-5">Polar Area Chart</h1>
            <div className="w-full flex xl:flex-row flex-col justify-evenly gap-7 items-center h-[60%]">
                <div className="flex justify-center items-center xl:w-[60%] w-full h-[550px]">
                    <div className="md:w-[750px] sm:w-[550px] w-[400px] h-[293.3px] md:h-[550px] sm:h-[403px] shadow-[0_0_10px_5px_#144da8] "><canvas ref={canvasRef} /></div>
                </div>
                <div className="xl:w-[40%] w-full flex flex-col flex-wrap justify-center items-center gap-3">
                    <div className="flex justify-center items-center md:w-[452px] w-[90%]  flex-wrap border gap-3 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                        <label className="text-lg font-semibold" htmlFor="title">Title: </label>
                        <input
                            name="title"
                            type="text"
                            placeholder="Title"
                            value={chartTitle}
                            className="w-[200px] focus:outline-none"
                            onChange={(e) => setChartTitle(e.target.value)}
                        />
                    </div>
                    <div className="w-[452px] flex flex-col justify-center items-center gap-3">
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={addRow} className="button flex gap-2.5 text-md justify-center items-center" role="button">Add Row <Plus size={18} /></button>
                            <ExcelReader onData={handleExcelData} />
                        </div>
                        <div className="flex justify-center gap-4 items-center">
                            <button onClick={save} className="button flex gap-2.5 text-md justify-center items-center" role="button">Save <Bookmark className="saveicon" size={18} /></button>
                            <button onClick={downloadChart} className="button flex gap-2.5 text-md justify-center items-center" role="button">Download <Download size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 md:px-14 px-3">
                <div className="w-[80%] text-xl flex justify-between items-center mx-auto font-bold">
                    <span className="underline underline-offset-2">Data</span>
                    <button onClick={submit} className="button flex gap-2.5 text-md justify-center items-center" role="button">Submit Data <Check size={18} /></button>
                </div>
                <div className="w-full overflow-x-scroll">
                    <div className="min-w-[700px] lg:w-[50%] w-full mx-auto mt-6">
                        <div
                            className={`grid`}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${1 + Headers.length}, minmax(120px, 1fr))`,
                            }}
                        >
                            {/* Headers */}
                            {Headers.map((label, index) => (
                                <div key={index} className="relative flex justify-center items-center bg-[#144da8] border border-y-[#144da8] border-white">
                                    <input
                                        type="text"
                                        value={label}
                                        onChange={(e) => {
                                            const updatedHeaders = [...Headers];
                                            updatedHeaders[index] = e.target.value;
                                            setHeaders(updatedHeaders);
                                        }}
                                        className="text-[#f4f3e0] font-bold text-center bg-transparent"
                                        placeholder={`Label ${index + 1}`}
                                    />
                                </div>
                            ))}
                            <div className="py-2 px-4 text-center font-bold bg-[#144da8] text-[#f4f3e0] border border-[#144da8] border-l-white">
                                Color
                            </div>

                            {/* Data Rows */}
                            {dummyData.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    {/* Row Data Cells */}
                                    {Headers.map((header, colIndex) => (
                                        <input
                                            key={colIndex}
                                            type={typeof row[header] === "number" ? "number" : "text"}
                                            value={row[header]}
                                            onChange={(e) => {
                                                const updatedData = [...dummyData];
                                                const value = typeof row[header] === "number"
                                                    ? parseInt(e.target.value) || 0
                                                    : e.target.value;
                                                updatedData[rowIndex][header] = value;
                                                setdummyData(updatedData);
                                            }}
                                            className="border border-[#144da8] text-center p-2"
                                        />
                                    ))}

                                    {/* Color Input */}
                                    <div className="relative border flex justify-center items-center border-[#144da8]">
                                        <input
                                            type="color"
                                            value={row.color || Colors[rowIndex % Colors.length]}
                                            onChange={(e) => {
                                                const updatedData = [...dummyData];
                                                updatedData[rowIndex].color = e.target.value;
                                                setdummyData(updatedData);
                                            }}
                                            className="border w-[50%] h-[30px] border-white"
                                        />
                                        <button
                                            onClick={() => deleteRow(rowIndex)}
                                            className="absolute w-[30px] h-[30px] top-1 md:right-2 right-0 text-red-500"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolarAreaChart3D;