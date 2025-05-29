"use client";
import React, { useRef, useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Download, Bookmark, Plus, Trash } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExcelReader from "../../Input/HVPDPL";
import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const PolarAreaChart = () => {
    const chartRef = useRef();
    const [Data, setData] = useState([]);
    const [Headers, setHeaders] = useState(['Category','value'])
    const [GraphHeaders, setGraphHeaders] = useState("Value")
    const [DataLabels, setDataLabels] = useState([true, "#000000"])
    const [GridLines, setGridLines] = useState(true)
    const [offset, setoffset] = useState(5)
    const [RScale, setRScale] = useState([0, 100])
    const [Opacity, setOpacity] = useState(0.4)
    const [ChartTitle, setChartTitle] = useState('Polar Area Chart')
    const [chartSize, setChartSize] = useState({ width: 600, height: 400 });

    const dummyData = [
        { "Category": "A", "Value": 40 },
        { "Category": "B", "Value": 50 },
        { "Category": "C", "Value": 60 },
        { "Category": "D", "Value": 70 },
        { "Category": "E", "Value": 80 },
        { "Category": "F", "Value": 90 }
    ];

    // Setup initial data only once
    useEffect(() => {
        // Setup initial data
        handleExcelData({
            isValid:true,
            data:dummyData,
            headers: ["Category", "Value"],
            title:"polar chart"
        });

        // Only run this on client side
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                if (window.innerWidth < 768) {
                    setChartSize({ width: 350, height: 300 });
                } else if (window.innerWidth < 1024) {
                    setChartSize({ width: 500, height: 400 });
                } else {
                    setChartSize({ width: 600, height: 400 });
                }
            };

            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);
    const data = {
        labels: Data.map(item => item[Headers[0]]),
        datasets: [{
            label: GraphHeaders,
            data: Data.map(item => item[Headers[1]]),
            backgroundColor: Data.map(item => item.Color),
            hoverBackgroundColor: Data.map(item => item.HoverColor),
            offset: offset ?? 5,
            hoverOffset: offset + 10 ?? 40
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 15,
                bottom: 15
            }
        },
        scales: {
            r: {
                max: RScale[1] ?? 100,
                min: RScale[0] ?? 0,
                ticks: { stepSize: Number((RScale[1]-RScale[0])/10) },
                grid: { display: GridLines }
            }
        },
        plugins: {
            datalabels: {
                anchor: "end",
                align: 'end',
                color: DataLabels[1] ?? '#000',
                font: {
                    size: 12
                },
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(2);
                    return DataLabels[0] ? `${label}: ${value} \n(${percentage}%)` : "";
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'white',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
                },
            },
            title: {
                display: true,
                text: ChartTitle ,
                font: {
                    size: 20
                }
            },
            legend: {
                position: typeof window !== 'undefined' && window.innerWidth < 768 ? 'top' : 'bottom',
                labels: {
                    boxWidth: 15,
                    padding: 10,
                    font: {
                        size: 12
                    }
                },
                onClick: (e, elements) => { if (elements.length === 0) return; },
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

    const handleExcelData = (result ) => {
        console.log(result)
        if (result.isValid==true){

            let dataSource = result.data && result.data.length > 0 ? result.data : dummyData;
            
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

            
            let heads = (result.headers && result.headers.length > 0) ? result.headers : ["Category", "Value"];
            heads.push("Color", "HoverColor");
            setData(coloredDataSource);
            setHeaders(heads);
            setChartTitle(result.title)
            setRScale([0, Math.max(...dataSource.map(item => item[heads[1]]))]);
        }else{
            alert("Invalid data format. Please upload a valid Excel file.");
        }
    };

    const addRow = () => {
        const newRow = { [Headers[0]]: "", [Headers[1]]: 0, Color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Opacity})` };
        setData([...Data, newRow]);
    }

    const deleteRow = (index) => {
        const updatedData = Data.filter((_, i) => i !== index);
        setData(updatedData);
    }

    const hexToRgba = (hex, str) => {
        hex = hex.replace("#", "");
        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);
        return str == "o" ? `rgba(${r}, ${g}, ${b}, ${Opacity})` : `rgba(${r}, ${g}, ${b},1)`;
    };

    function rgbToHex(r, g, b) {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    }

    function rgbaToHex(rgba) {
        const rgbaValues = rgba.match(/\d+/g);
        const r = parseInt(rgbaValues[0]);
        const g = parseInt(rgbaValues[1]);
        const b = parseInt(rgbaValues[2]);
        return rgbToHex(r, g, b);
    }

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

    const updateOpacityInData = () => {
        const updatedData = Data.map(item => {
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

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;
        const items = Array.from(Data);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        setData(items);
    };

    return (
        <div className="w-full min-h-screen p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl w-full text-center font-bold mb-5">POLAR AREA CHART</h1>

            <div className="w-full flex flex-col xl:flex-row justify-evenly gap-4 md:gap-7 items-center">
                {/* Chart Container */}
                <div className="w-full xl:w-[60%] flex justify-center items-center">
                    <div className="w-full max-w-[750px] h-auto aspect-[4/3]">
                        <PolarArea
                            className="rounded-[20px] shadow-lg"
                            ref={chartRef}
                            data={data}
                            options={options}
                            plugins={[customCanvasBackgroundColor]}
                        />
                    </div>
                </div>

                {/* Chart Controls */}
                <div className="w-full xl:w-[40%]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                        <h2 className="col-span-full text-xl font-semibold text-center mb-2">Chart Settings</h2>

                        {/* Control Group 1 */}
                        <div className="flex flex-col gap-4 p-3 bg-white rounded-md border border-gray-200">
                            <div className="flex items-center justify-between">
                                <label className="text-sm md:text-base font-medium">Show Data Labels:</label>
                                <input
                                    type="checkbox"
                                    checked={DataLabels[0]}
                                    onChange={(e) => setDataLabels([e.target.checked, DataLabels[1]])}
                                    className="h-5 w-5"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm md:text-base font-medium">Labels Color:</label>
                                <input
                                    type="color"
                                    value={DataLabels[1]}
                                    onChange={(e) => setDataLabels([DataLabels[0], e.target.value])}
                                    className="h-8 w-8"
                                />
                            </div>
                        </div>

                        {/* Control Group 2 */}
                        <div className="flex flex-col gap-4 p-3 bg-white rounded-md border border-gray-200">
                            <div className="flex items-center justify-between">
                                <label className="text-sm md:text-base font-medium">Show Grid Lines:</label>
                                <input
                                    type="checkbox"
                                    checked={GridLines}
                                    onChange={(e) => setGridLines(e.target.checked)}
                                    className="h-5 w-5"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm md:text-base font-medium">Chart Title:</label>
                                <input
                                    type="text"
                                    value={ChartTitle ||""}
                                    onChange={(e) => setChartTitle(e.target.value)}
                                    className="w-28 md:w-36 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Control Group 3 */}
                        <div className="flex flex-col gap-4 p-3 bg-white rounded-md border border-gray-200 sm:col-span-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm md:text-base font-medium mb-1">Min Value:</label>
                                    <input
                                        type="number"
                                        value={RScale[0]}
                                        onChange={(e) => setRScale([Number(e.target.value), RScale[1]])}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base font-medium mb-1">Max Value:</label>
                                    <input
                                        type="number"
                                        value={RScale[1]}
                                        onChange={(e) => setRScale([RScale[0], Number(e.target.value)])}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Control Group 4 */}
                        <div className="flex flex-col gap-4 p-3 bg-white rounded-md border border-gray-200 sm:col-span-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm md:text-base font-medium mb-1">Opacity:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={Opacity}
                                        onChange={(e) => {
                                            setOpacity(parseFloat(e.target.value));
                                            updateOpacityInData();
                                        }}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base font-medium mb-1">Offset:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={offset}
                                        onChange={(e) => setoffset(parseFloat(e.target.value))}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                            <button
                                onClick={addRow}
                                className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                <Plus size={16} /> Add Row
                            </button>
                            <ExcelReader onData={handleExcelData} className="w-full" />
                            <button className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-gray-700 transition">
                                <Bookmark size={16} /> Save
                            </button>
                            <button
                                onClick={downloadChart}
                                className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-green-700 transition"
                            >
                                <Download size={16} /> Download
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Data Section */}
            <div className="mt-6 w-full px-5">
                <h1 className="w-full text-lg md:text-xl underline underline-offset-2 text-center font-bold mb-4">Data Management</h1>

                <div className="flex justify-center items-center gap-4 w-full">
                    {/* Data Table */}
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[600px]">
                            {/* Header Row */}
                            <div className="grid grid-cols-3 bg-[#144da8] text-center text-white font-bold rounded-t-md">
                                <input
                                    type="text"
                                    value={Headers[0]}
                                    onChange={(e) => setHeaders([e.target.value, Headers[1]])}
                                    className="border-r py-2 px-2 border-white text-center w-full focus:outline-none bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={Headers[1]}
                                    onChange={(e) => setHeaders([Headers[0], e.target.value])}
                                    className="border-r py-2 px-2 border-white text-center w-full focus:outline-none bg-transparent"
                                />
                                <div className="py-2 px-2">Color</div>
                            </div>

                            {/* Data Rows */}
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {Data.map((item, index) => (
                                                <Draggable key={index} draggableId={String(index)} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            className="grid grid-cols-3 border-b border-gray-300 transition hover:bg-gray-50"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <div className="p-2 border-r border-[#144da8]">
                                                                <input
                                                                    type="text"
                                                                    className="text-center w-full focus:outline-none"
                                                                    value={item[Headers[0]] ?? ""}
                                                                    onChange={(e) => {
                                                                        const updatedData = [...Data];
                                                                        updatedData[index][Headers[0]] = e.target.value;
                                                                        setData(updatedData);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="p-2 border-r border-[#144da8]">
                                                                <input
                                                                    type="number"
                                                                    className="text-center w-full focus:outline-none"
                                                                    value={item[Headers[1]] ?? ""}
                                                                    onChange={(e) => {
                                                                        const updatedData = [...Data];
                                                                        updatedData[index][Headers[1]] = Number(e.target.value);
                                                                        setData(updatedData);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="p-2 flex justify-center items-center gap-2 relative">
                                                                <input
                                                                    type="color"
                                                                    className="w-8 h-8 cursor-pointer"
                                                                    value={rgbaToHex(item[Headers[2]])}
                                                                    onChange={(e) => {
                                                                        const updatedData = [...Data];
                                                                        updatedData[index][Headers[2]] = hexToRgba(e.target.value, "o");
                                                                        updatedData[index][Headers[3]] = hexToRgba(e.target.value, "ho");
                                                                        setData(updatedData);
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={() => deleteRow(index)}
                                                                    className="absolute right-2 text-red-600 hover:text-red-800"
                                                                >
                                                                    <Trash size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolarAreaChart;