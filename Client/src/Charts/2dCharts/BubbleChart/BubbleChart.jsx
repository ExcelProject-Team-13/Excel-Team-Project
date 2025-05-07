"use client";
import React, { useRef, useState, useEffect } from "react";
import { Bubble } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Download, Bookmark, Plus, Trash } from "lucide-react";
import ExcelReader from "@/app/Input/page";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const BubbleChart = () => {
    const chartRef = useRef();
    const [Data, setData] = useState([]);
    const [ShowGrid, setShowGrid] = useState(true)
    const [Headers, setHeaders] = useState([])
    const [DataLabels, setDataLabels] = useState([true, "middle", "#000000"])
    const [Opacity, setOpacity] = useState(0.4)
    const [GraphHeaders, setGraphHeaders] = useState(["X", "Y", "Radius"])
    const [HoverOpacity, setHoverOpacity] = useState(1)
    const [ChartTitle, setChartTitle] = useState("Bar Chart Example")

    const dummyData = [
        { "x": 20, "y": 30, "r": 10 },
        { "x": 40, "y": 10, "r": 15 },
        { "x": 25, "y": 20, "r": 8 },
        { "x": 35, "y": 40, "r": 12 },
        { "x": 50, "y": 20, "r": 18 }
    ]

    // Setup initial data only once
    useEffect(() => {
        handleExcelData({ data: dummyData, headers: ["x", "y", "r"] });

    }, []);  // re-run if excelData changes

    // Dummy data when original data is unavailable
    const data = {
        datasets: [{
            data: Data.map(item => ({
                x: item[Headers[0]],
                y: item[Headers[1]],
                r: item[Headers[2]]
            })),
            backgroundColor: Data.map(item => item.Color),
            borderColor: Data.map(item => item.HoverColor),
            hoverBackgroundColor: Data.map(item => item.HoverColor),
        }]
    };


    const options = {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 30,  // Add 30px padding on the left
                right: 40, // Add 30px padding on the right
                top: 15,
                bottom: 15
            }
        },
        legend: { display: false },
        plugins: {
            datalabels: {
                align: DataLabels[1] ?? "top",         // center the label in the bubble
                anchor: 'top',         // anchor it at the center
                color: DataLabels[2] ?? "#000",            // label text color
                font: {
                    weight: 'bold'
                },
                formatter: function (value, context) {
                    return DataLabels[0] ? "(" + value.x + "," + value.y + ", R:" + value.r + ")" : ""; // what to show inside the bubble
                }
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                text: ChartTitle ?? 'Bubble Chart Example',
                padding: {
                    bottom: 20
                },
                font: {
                    size: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'white',
                borderWidth: 1,
                cornerRadius: 8,
                caretSize: 6,
                padding: 10
            }
        },
        scales: {
            x: {
                grid: { display: ShowGrid ?? true },
                ticks: {
                    font: {
                        weight: 'bold',
                        size: 16
                    },
                },
                beginAtZero: true
            },
            y: {
                grid: { display: ShowGrid ?? true },
                ticks: {
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                },
                beginAtZero: true
            }
        }
    };

    const customCanvasBackgroundColor = {
        id: "customCanvasBackgroundColor",
        beforeDraw: (chart) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    const handleExcelData = ({ data, headers }) => {
        let dataSource = data && data.length > 0 ? data : dummyData;

        const coloredDataSource = dataSource.map((item, index) => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return {
                ...item,
                Color: `rgba(${r}, ${g}, ${b}, ${Opacity})`,
                HoverColor: `rgba(${r}, ${g}, ${b}, 1)`
            };
        });

        let heads = (headers && headers.length > 0) ? headers : ["x", "y", "r"];
        heads.push("Color", "HoverColor");
        setData(coloredDataSource);
        setHeaders(heads);
        setChartTitle("Bubble Chart Example")
    };


    const addRow = () => {
        const newRow = { [Headers[0]]: 0, [Headers[1]]: 0, [Headers[2]]: 0, Color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Opacity})` };
        setData([...Data, newRow]);
    }
    const deleteRow = (index) => {
        const updatedData = Data.filter((_, i) => i !== index);
        setData(updatedData);
    }

    const hexToRgba = (hex, str) => {
        // Remove the hash if it exists
        hex = hex.replace("#", "");

        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);

        return str == "o" ? `rgba(${r}, ${g}, ${b}, ${Opacity})` : `rgba(${r}, ${g}, ${b}, 1)`;
    };
    function rgbToHex(r, g, b) {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    }
    function rgbaToHex(rgba) {
        // Extract r, g, b values from the rgba string
        const rgbaValues = rgba.match(/\d+/g); // Matches all numbers
        const r = parseInt(rgbaValues[0]);
        const g = parseInt(rgbaValues[1]);
        const b = parseInt(rgbaValues[2]);

        // Convert RGB to hex
        return rgbToHex(r, g, b);
    }

    // Function to download chart as PNG
    const downloadChart = () => {
        const chart = chartRef.current;
        if (chart) {
            const url = chart.toBase64Image();
            const a = document.createElement("a");
            a.href = url;
            a.download = "chart.png";
            a.click();
        }
    };

    //opacity changing function
    const updateOpacityInData = () => {
        const updatedData = Data.map(item => {
            // Extract RGB values from current Color
            const rgbaValues = item.Color.match(/\d+/g);
            const r = rgbaValues[0];
            const g = rgbaValues[1];
            const b = rgbaValues[2];

            return {
                ...item,
                Color: `rgba(${r}, ${g}, ${b}, ${Opacity})`,
                HoverColor: `rgba(${r}, ${g}, ${b}, 1)`
            };
        });

        setData(updatedData);
    };


    return (
        <div className="w-[100vw] overflow-x-hidden h-full p-6">
            <h1 className="text-3xl w-full text-center font-bold mb-5">Bubble CHART</h1>
            <div className="w-full flex justify-evenly gap-7 items-center h-[60%]">
                <div className="flex justify-center items-center w-[70%] h-[550px]"><Bubble width={750} height={550} className="rounded-[20px] shadow-[0px_0px_8px_0px_black]"
                    ref={chartRef} data={data} options={options} plugins={[customCanvasBackgroundColor]} /></div>
                <div className="w-[30%] flex flex-col flex-wrap justify-center items-start gap-3">
                    <h1 className="w-full font-semibold text-xl mb-3">Data Labels:</h1>
                    <div className="w-[200px] border flex gap-2 items-center justify-start border-[#144da8] rounded-md p-2">
                        <label htmlFor="datalabels" className=" text-lg font-semibold">Show Data Labels:</label>
                        <input type="checkbox" name="datalabels" id="" defaultChecked={true} onChange={(e) => setDataLabels([e.target.checked, DataLabels[1], DataLabels[2]])} />
                    </div>
                    <div className="w-[200px] max-w-xs border border-[#144da8] rounded-md p-2 flex items-center gap-2">
                        <label htmlFor="position" className="block text-lg font-semibold">Position</label>
                        <select id="position" name="position" onChange={(e) => { setDataLabels([DataLabels[0], String(e.target.value), DataLabels[2]]); console.log(DataLabels[1]) }} className=" block  rounded-md focus:outline-none  text-md">
                            <option value="middle" defaultValue={true}>Middle</option>
                            <option value="end">Top</option>
                            <option value="start">Bottom</option>
                        </select>
                    </div>
                    <div className="flex justify-start border border-[#144da8] rounded-md p-2 w-[200px] items-center gap-2">
                        <label htmlFor="labelsColor" className="text-lg font-semibold">Labels Color</label>
                        <input type="color" name="labelsColor" id="" onChange={(e) => setDataLabels([DataLabels[0], DataLabels[1], String(e.target.value)])} />
                    </div>
                </div>
            </div>
            <div className=" mt-6">
                <h1 className="w-[80%] text-xl underline underline-offset-2 mx-auto font-bold">Data</h1>
                <div className="w-[80%] mx-auto flex justify-center items-center gap-4">
                    <div className={`w-[50%] block mt-6`}>
                        {/* Header Row */}
                        <div className="grid grid-cols-4 bg-blue-600 text-center text-white font-bold rounded-t-md">
                            <input type="text" name="" id=""
                                value={GraphHeaders[0] ?? "X"}
                                onChange={(e) => { setGraphHeaders([e.target.value, GraphHeaders[1], GraphHeaders[2]]) }}
                                className="border-r py-2 px-4 border-white text-center w-full focus:outline-none"
                            />
                            <input type="text" name="" id=""
                                value={GraphHeaders[1] ?? "Y"}
                                onChange={(e) => { setGraphHeaders([GraphHeaders[0], e.target.value, GraphHeaders[2]]) }}
                                className="border-r py-2 px-4 border-white text-center w-full focus:outline-none"
                            />
                            <input type="text" name="" id=""
                                value={GraphHeaders[2] ?? "R"}
                                onChange={(e) => { setGraphHeaders([GraphHeaders[0], GraphHeaders[1], e.target.value,]) }}
                                className="border-r py-2 px-4 border-white text-center w-full focus:outline-none"
                            />

                            <div className="border-r py-2 px-4 border-white text-center w-full focus:outline-none">Color</div>

                        </div>

                        {/* Data Rows */}
                        {/* Data Rows - Droppable */}
                        <div>
                            {Data.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-4 border-b border-gray-300 transition"
                                >
                                    <div className="px-4 p-2 border-b border-r border-[#144da8] hover:bg-gray-100">
                                        <input
                                            type="number"
                                            className="text-center w-full focus:outline-none"
                                            value={item[Headers[0]] ?? ""}
                                            onChange={(e) => {
                                                const newValue = Number(e.target.value);
                                                const updatedData = [...Data];
                                                updatedData[index][Headers[0]] = newValue;
                                                setData(updatedData);
                                            }}
                                        />
                                    </div>

                                    <div className="px-4 flex justify-between items-center gap-2 p-2 border-b border-r border-[#144da8] hover:bg-gray-100">
                                        <input
                                            type="number"
                                            className="text-center w-full focus:outline-none"
                                            value={item[Headers[1]] ?? ""}
                                            onChange={(e) => {
                                                const newValue = Number(e.target.value);
                                                const updatedData = [...Data];
                                                updatedData[index][Headers[1]] = newValue;
                                                setData(updatedData);
                                            }}
                                        />
                                    </div>

                                    <div className="px-4 flex justify-between items-center gap-2 p-2 border-b border-r border-[#144da8] hover:bg-gray-100">
                                        <input
                                            type="number"
                                            className="text-center w-full focus:outline-none"
                                            value={item[Headers[2]] ?? ""}
                                            onChange={(e) => {
                                                const newValue = Number(e.target.value);
                                                const updatedData = [...Data];
                                                updatedData[index][Headers[2]] = newValue;
                                                setData(updatedData);
                                            }}
                                        />
                                    </div>

                                    <div className="px-4 row flex justify-center relative items-center gap-2 p-2 border-b  border-[#144da8] hover:bg-gray-100">
                                        <input
                                            type="color"
                                            className="text-center w-[50%] focus:outline-none"
                                            value={rgbaToHex(item[Headers[3]]) ?? "#ff0000"}
                                            onChange={(e) => {
                                                const newValue1 = hexToRgba(String(e.target.value), "o");
                                                const newValue2 = hexToRgba(String(e.target.value), "ho");
                                                const updatedData = [...Data];
                                                updatedData[index][Headers[3]] = newValue1;
                                                updatedData[index][Headers[4]] = newValue2;
                                                setData(updatedData);
                                            }}
                                        />
                                        <Trash className="absolute right-2 trash-icon" onClick={() => deleteRow(index)} />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className="w-[50%] flex flex-col justify-center items-center gap-3">
                        <div className="flex justify-center items-center w-[440px] flex-wrap border gap-3 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                            <label className="text-lg font-semibold" htmlFor="title">Title: </label>
                            <input name="title" type="text" placeholder="Title"
                                value={ChartTitle ?? "Bubble Chart Example"}
                                className="w-[160px] focus:outline-none"
                                onChange={(e) => {
                                    setChartTitle(e.target.value)
                                }}
                            />
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                                <label className="text-lg font-semibold" htmlFor="Opacity">Bar Opacity</label>
                                <input name="Opacity" type="number" min="0" max="1" step="0.01"
                                    value={Opacity}
                                    onChange={(e) => {
                                        setOpacity(parseFloat(e.target.value))
                                        updateOpacityInData()
                                    }}
                                    className="w-[60px] rounded-md focus:outline-none"
                                />
                            </div>
                            <div className="w-[200px] border flex gap-2 items-center justify-center border-gray-300 rounded-md p-2">
                        <label htmlFor="grid" className=" text-lg font-semibold">Show Grid:</label>
                        <input type="checkbox" name="grid" id="" defaultChecked={true} onChange={(e) => setShowGrid(e.target.checked)} />
                    </div>
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={addRow} className="button flex gap-2.5 text-md justify-center items-center" role="button">Add Row <Plus size={18} /></button>
                            <ExcelReader onData={handleExcelData} />
                        </div>
                        <div className="flex justify-center gap-4 items-center">
                            <button className="button flex gap-2.5 text-md justify-center items-center" role="button">Save <Bookmark size={18} /></button>
                            <button onClick={downloadChart} className="button flex gap-2.5 text-md justify-center items-center" role="button">Download <Download size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BubbleChart;
