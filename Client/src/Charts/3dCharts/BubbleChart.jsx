"use client";
import React, { useRef, useState } from "react";
import { Download, Bookmark, Plus, Trash, Check, Info } from "lucide-react";
import ExcelReader from "../../Input/HVPDPL";
import ".styles/page.css";
import BubbleChart3D from "./scripts/BubbleScript";

const BubbleChart = () => {
    const Colors = ["#0000FF", "#FF0000", "#008000", "#FFFF00", "#800080",
        "#FFA500", "#FFC0CB", "#A52A2A", "#808080", "#00FFFF"];

    const chartRef = useRef();
    const [chartTitle, setChartTitle] = useState("Bubble Chart Example");
    const [Data, setData] = useState([ // Initial dummy data
        { x: 5, y: 5, z: 5, size: 15, color: '#ff0000', title: chartTitle, label: 'Apple' },
        { x: 15, y: 5, z: 10, size: 20, color: '#00ff00', title: chartTitle, label: 'Microsoft' },
        { x: 5, y: 15, z: 8, size: 12, color: '#0000ff', title: chartTitle, label: 'Tesla' },
        { x: 20, y: 25, z: 3, size: 18, color: '#0f0f0f', title: chartTitle, label: 'Amazon' },
        { x: 8, y: 12, z: 15, size: 10, color: '#0f00ff', title: chartTitle, label: 'JPMorgan' }
    ]);

    const [dummyData, setDummyData] = useState(
        [ // Initial dummy data
            { x: 5, y: 5, z: 5, size: 15, color: '#ff0000', title: chartTitle, label: 'Apple' },
            { x: 15, y: 5, z: 10, size: 20, color: '#00ff00', title: chartTitle, label: 'Microsoft' },
            { x: 5, y: 15, z: 8, size: 12, color: '#0000ff', title: chartTitle, label: 'Tesla' },
            { x: 20, y: 25, z: 3, size: 18, color: '#0f0f0f', title: chartTitle, label: 'Amazon' },
            { x: 8, y: 12, z: 15, size: 10, color: '#0f00ff', title: chartTitle, label: 'JPMorgan' }
        ]
    );

    const handleExcelData = ({ data }) => setData(data);

   const submit = () => {
    const updated = dummyData.map(bubble => ({
        ...bubble,
        title: chartTitle
    }));
    setData(updated);
    console.log("from submit", updated);
};


    const addBubble = () => {
        const newBubble = {
            x: Math.floor(Math.random() * 50),
            y: Math.floor(Math.random() * 50),
            z: Math.floor(Math.random() * 25),
            size: Math.floor(Math.random() * 20) + 5,
            color: Colors[dummyData.length % Colors.length],
            label: `Item ${dummyData.length + 1}`
        };
        setDummyData(prev => [...prev, newBubble]);
    };

    const deleteBubble = (index) => {
        setDummyData(prev => prev.filter((_, i) => i !== index));
    };

    const downloadChart = () => {
        chartRef.current?.downloadScreenshot();
    };

    const save = () => {
        const saveicon = document.getElementsByClassName("saveicon")[0];
        saveicon.style.fill = saveicon.style.fill === "rgb(20, 17, 168)"
            ? "rgb(255, 255, 255)"
            : "rgb(20, 17, 168)";
    };

    const displayInstructions = () => {
        const instructions = document.querySelector(".instructions");
        instructions?.classList.toggle("hidden");
        instructions?.classList.toggle("flex");
    };

    const handleBubbleChange = (index, field, value) => {
        const updatedData = [...dummyData];
        updatedData[index][field] = ["x", "y", "z", "size"].includes(field)
            ? Number(value)
            : value;
        setDummyData(updatedData);
    };

    return (
        <div className="w-[100vw] overflow-x-hidden relative pt-7 md:px-10 px-4 pb-10">
            <Info onClick={displayInstructions} className="top-5 absolute z-[100] right-5 text-gray-500 cursor-pointer" size={20} />

            {/* Instructions */}
            <div className="instructions absolute w-full h-[99vh] md:top-[45%] top-[25%] overflow-hidden z-50 hidden justify-center items-center">
                <div className="flex flex-col justify-center items-center md:w-[700px] w-[500px] h-fit py-5 px-3 bg-white/10 backdrop-blur-md rounded-xl border border-black text-black">
                    <h1 className="text-2xl font-bold underline-offset-2 underline">Instructions to User</h1>
                    <ul className="text-lg font-semibold mt-5 list-decimal px-5">
                        <li>Each bubble requires X, Y, Z coordinates, size (radius), and color</li>
                        <li>Edit values in the table to update the chart</li>
                        <li>Click Submit Data to see changes</li>
                        <li>Use the Download button to save the chart as image</li>
                    </ul>
                </div>
            </div>

            <h1 className="text-3xl w-full text-center font-bold mb-5">BUBBLE CHART</h1>

            <div className="w-full flex xl:flex-row flex-col justify-evenly gap-7 items-center h-[60%]">
                <div className="flex justify-center items-center w-[60%] h-[550px]">
                    <div className="md:w-[750px] sm:w-[550px] w-[400px] h-[293.3px] md:h-[550px] sm:h-[403px] shadow-[0_0_10px_5px_#144da8]">
                        <BubbleChart3D ref={chartRef} importingData={Data} />
                    </div>
                </div>

                <div className="xl:w-[40%] w-full flex flex-col items-center gap-3">
                    <div className="flex justify-center items-center md:w-[452px] w-[90%] flex-wrap border gap-3 border-gray-300 rounded-md p-2">
                        <label className="text-lg font-semibold" htmlFor="title">Title: </label>
                        <input
                            name="title"
                            type="text"
                            placeholder="Chart Title"
                            value={chartTitle}
                            className="w-[200px] focus:outline-none"
                            onChange={(e) => setChartTitle(e.target.value)}
                        />
                    </div>

                    <div className="w-[452px] flex flex-col justify-center items-center gap-3">
                        <div className="flex gap-4">
                            <button onClick={addBubble} className="button flex gap-2.5 text-md items-center">
                                Add Bubble <Plus size={18} />
                            </button>
                            <ExcelReader onData={handleExcelData} />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={save} className="button flex gap-2.5 text-md items-center">
                                Save <Bookmark className="saveicon" size={18} />
                            </button>
                            <button onClick={downloadChart} className="button flex gap-2.5 text-md items-center">
                                Download <Download size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 md:px-14 px-3">
                <div className="w-[80%] text-xl flex justify-between items-center mx-auto font-bold">
                    <span className="underline underline-offset-2">Data</span>
                    <button onClick={submit} className="button flex gap-2.5 text-md items-center">
                        Submit Data <Check size={18} />
                    </button>
                </div>

                <div className="w-full overflow-x-scroll">
                    <div className="min-w-[700px] lg:w-[90%] w-full mx-auto mt-6">
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(7, minmax(120px, 1fr))' }}>
                            {/* Header Row */}
                            {["Label", "X Value", "Y Value", "Z Value", "Size", "Color", "Action"].map(header => (
                                <div key={header} className="py-2 px-4 text-center font-bold bg-[#144da8] text-[#f4f3e0] border border-[#144da8]">
                                    {header}
                                </div>
                            ))}

                            {/* Data Rows */}
                            {dummyData.map((bubble, index) => (
                                <React.Fragment key={index}>
                                    <input type="text" value={bubble.label} onChange={(e) => handleBubbleChange(index, 'label', e.target.value)} className="border border-[#144da8] text-center" />
                                    <input type="number" value={bubble.x} onChange={(e) => handleBubbleChange(index, 'x', e.target.value)} className="border border-[#144da8] text-center" />
                                    <input type="number" value={bubble.y} onChange={(e) => handleBubbleChange(index, 'y', e.target.value)} className="border border-[#144da8] text-center" />
                                    <input type="number" value={bubble.z} onChange={(e) => handleBubbleChange(index, 'z', e.target.value)} className="border border-[#144da8] text-center" />
                                    <input type="number" value={bubble.size} onChange={(e) => handleBubbleChange(index, 'size', e.target.value)} className="border border-[#144da8] text-center" />
                                    <div className="border border-[#144da8] flex justify-center items-center">
                                        <input type="color" value={bubble.color} onChange={(e) => handleBubbleChange(index, 'color', e.target.value)} className="w-[50%] h-[30px]" />
                                    </div>
                                    <div className="border border-[#144da8] flex justify-center items-center">
                                        <button onClick={() => deleteBubble(index)} className="text-red-500">
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

export default BubbleChart;
