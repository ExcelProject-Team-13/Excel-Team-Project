"use client";
import React, { useRef, useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Download, Bookmark, Plus, Trash } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExcelReader from "../../Input/HVPDPL";
import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const PieChart = () => {
    const chartRef = useRef();
    const [Data, setData] = useState([]);
    const [Headers, setHeaders] = useState([])
    const [Opacity, setOpacity] = useState(0.4)
    const [GraphHeaders, setGraphHeaders] = useState("Value")
    const [DataLabels, setDataLabels] = useState([true, "#000000"])
    const [offset, setoffset] = useState(5)
    const [HoverOpacity, setHoverOpacity] = useState(1)
    const [ChartTitle, setChartTitle] = useState("Bar Chart Example")

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
        handleExcelData({
            isValid: true,
            data: dummyData,
            headers: ["Category", "Value"],
            title: "Doughnut chart"
        });
    }, []);

    const data = {
        labels: Data.map(item => item[Headers[0]]),
        datasets: [{
            label: GraphHeaders,
            data: Data.map(item => item[Headers[1]]),
            backgroundColor: Data.map(item => item.Color),
            hoverBackgroundColor: Data.map(item => item.HoverColor),
            offset: offset ?? 5,
            hoverOffset: 40
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 30,
                right: 30,
                top: 15,
                bottom: 15
            }
        },
        plugins: {
            datalabels: {
                color: DataLabels[1] ?? '#000',
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
                text: ChartTitle ?? 'Pie Chart Example',
                font: { size: 20 }
            },
            legend: {
                position: 'bottom',
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

    const handleExcelData = (result) => {
        console.log(result)
        if (result.isValid == true) {

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
        } else {
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
        return str == "o" ? `rgba(${r}, ${g}, ${b}, ${Opacity})` : `rgba(${r}, ${g}, ${b}, ${HoverOpacity})`;
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
                HoverColor: `rgba(${r}, ${g}, ${b}, ${HoverOpacity})`
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
            <h1 className="text-2xl md:text-3xl w-full text-center font-bold mb-5">PIE CHART</h1>

            {/* Chart and Controls Section */}
            <div className="w-full flex flex-col xl:flex-row justify-between gap-4 md:gap-7 items-center">
                {/* Chart Container */}
                <div className="w-full xl:w-[70%] h-auto flex justify-center items-center">
                    <div className="w-full max-w-[750px] h-[400px] md:h-[550px]">
                        <Pie
                            className="rounded-[20px] shadow-[0px_0px_8px_0px_black] w-full h-full"
                            ref={chartRef}
                            data={data}
                            options={options}
                            plugins={[customCanvasBackgroundColor]}
                        />
                    </div>
                </div>

                <div className="w-full xl:w-[30%] bg-gray-50 rounded-lg p-4">
                    <h1 className="w-full font-semibold text-xl mb-3">Chart Settings</h1>

                    {/* Grid layout for controls */}
                    <div className="flex flex-col justify-center items-center gap-4">
                        {/* Data Labels Section */}
                        <div className="w-full flex gap-2 justify-center items-center">
                            <div className="flex w-[50%] border p-2 rounded items-center justify-between">
                                <label className="text-lg font-medium">Title:</label>
                                <input
                                    type="text"
                                    value={ChartTitle ?? "Pie Chart Example"}
                                    onChange={(e) => setChartTitle(e.target.value)}
                                    className="w-[70%] border-b text-center focus:outline-none"
                                />
                            </div>
                            <div className="flex w-[50%] border rounded p-2 items-center justify-between">
                                <label className="text-lg font-medium">Offset:</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={70}
                                    step={5}
                                    value={offset ?? 5}
                                    onChange={(e) => setoffset(Number(e.target.value))}
                                    className="w-20  focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </div>
                        <div className="w-full flex gap-2 justify-center items-center">
                            <div className="flex border p-2 w-[50%] rounded-md items-center justify-between">
                                <label htmlFor="datalabels" className="text-lg font-medium">Show Labels:</label>
                                <input
                                    type="checkbox"
                                    name="datalabels"
                                    defaultChecked={true}
                                    onChange={(e) => setDataLabels([e.target.checked, DataLabels[1]])}
                                />
                            </div>
                            <div className="flex border p-2 w-[50%] rounded-md items-center justify-between">
                                <label htmlFor="labelsColor" className="text-lg font-medium">Label Color:</label>
                                <input
                                    type="color"
                                    name="labelsColor"
                                    value={DataLabels[1]}
                                    onChange={(e) => setDataLabels([DataLabels[0], String(e.target.value)])}
                                />
                            </div>
                        </div>
                        {/* Chart Settings Section */}
                        <div className="w-full flex gap-2 justify-center items-center">
                            <div className="flex w-[50%] border rounded p-2 items-center justify-between">
                                <label className="text-lg font-medium">Pie Opacity:</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={Opacity}
                                    onChange={(e) => {
                                        setOpacity(parseFloat(e.target.value));
                                        updateOpacityInData();
                                    }}
                                    className="w-20 text-center border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="flex w-[50%] items-center border rounded p-2 justify-between">
                                <label className="text-lg font-medium">Hover Opacity:</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={HoverOpacity}
                                    onChange={(e) => {
                                        setHoverOpacity(parseFloat(e.target.value));
                                        updateOpacityInData();
                                    }}
                                    className="w-20 text-center border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center items-center flex-wrap gap-3">
                            <button
                                onClick={addRow}
                                className="button flex gap-2 justify-center items-center py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Add Row <Plus size={18} />
                            </button>
                            <ExcelReader onData={handleExcelData} className="w-full" />
                            <button className="button flex gap-2 justify-center items-center py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition">
                                Save <Bookmark size={18} />
                            </button>
                            <button
                                onClick={downloadChart}
                                className="button flex gap-2 justify-center items-center py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                            >
                                Download <Download size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Data Section */}
            <div className="mt-6 w-full">
                <h1 className="w-full md:w-[80%] text-xl underline underline-offset-2 mx-auto font-bold">Data</h1>
                <div className="w-full  flex flex-wrap-reverse justify-center items-evenly gap-4">
                    {/* Data Table */}
                    <div className="w-full lg:w-[50%] mt-6 overflow-x-auto">
                        {/* Header Row */}
                        <div className="grid grid-cols-3 bg-[#144da8] text-center text-[#f4f3e0] font-bold rounded-t-md min-w-[400px]">
                            <input
                                type="text"
                                value={ChartTitle ?? Headers[0]}
                                onChange={(e) => { setChartTitle(e.target.value) }}
                                className="border-r py-2 px-2 md:px-4 border-white text-center w-full focus:outline-none"
                            />
                            <input
                                type="text"
                                value={GraphHeaders ?? Headers[1]}
                                onChange={(e) => { setGraphHeaders(e.target.value) }}
                                className="border-r py-2 px-2 md:px-4 border-white text-center w-full focus:outline-none"
                            />
                            <div className="py-2 px-2 md:px-4">{Headers[2]}</div>
                        </div>

                        {/* Data Rows - Droppable */}
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable" isDropDisabled={false}>
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="min-w-[400px]">
                                        {Data.map((item, index) => (
                                            <Draggable key={index} draggableId={String(index)} index={index}>
                                                {(provided) => (
                                                    <div
                                                        className="grid grid-cols-3 border-b border-gray-300 transition"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className="px-2 md:px-4 p-2 border-b border-r border-[#144da8] hover:bg-gray-100">
                                                            <input
                                                                type="text"
                                                                className="text-center w-full focus:outline-none"
                                                                value={item[Headers[0]] ?? ""}
                                                                onChange={(e) => {
                                                                    const newValue = String(e.target.value);
                                                                    const updatedData = [...Data];
                                                                    updatedData[index][Headers[0]] = newValue;
                                                                    setData(updatedData);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="px-2 md:px-4 border-b border-r border-[#144da8] flex justify-between items-center gap-2 p-2 hover:bg-gray-100">
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
                                                        <div className="px-2 md:px-4 border-b relative border-[#144da8] row flex justify-center items-center gap-2 p-2 hover:bg-gray-100">
                                                            <input
                                                                type="color"
                                                                className="text-center w-[50%] focus:outline-none"
                                                                value={rgbaToHex(item[Headers[2]]) ?? "#ff0000"}
                                                                onChange={(e) => {
                                                                    const newValue1 = hexToRgba(String(e.target.value), "o");
                                                                    const newValue2 = hexToRgba(String(e.target.value), "ho");
                                                                    const updatedData = [...Data];
                                                                    updatedData[index][Headers[2]] = newValue1;
                                                                    updatedData[index][Headers[3]] = newValue2;
                                                                    setData(updatedData);
                                                                }}
                                                            />
                                                            <Trash className="trash-icon absolute right-2 md:right-7" onClick={() => deleteRow(index)} />
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
    );
};

export default PieChart;