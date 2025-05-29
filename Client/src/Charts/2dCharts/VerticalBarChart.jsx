"use client";
import React, { useRef, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Download, Bookmark, Plus, Trash } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExcelReader from "../../Input/HVPDPL";
import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const VerticalBarChart = () => {
    const chartRef = useRef();
    const [Data, setData] = useState([]);
    const [Headers, setHeaders] = useState([])
    const [GraphHeaders, setGraphHeaders] = useState("Value")
    const [DataLabels, setDataLabels] = useState([true, "middle", "#000000"])
    const [YScale, setYScale] = useState([0, 100])
    const [Opacity, setOpacity] = useState(0.4)
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

    useEffect(() => {
        handleExcelData({
            isValid: true,
            data: dummyData,
            headers: ["Category", "Value"],
            title: "Bar chart"
        });
    }, []);

    const data = {
        labels: Data.map(item => item[Headers[0]]),
        datasets: [{
            label: GraphHeaders,
            data: Data.map(item => item[Headers[1]]),
            backgroundColor: Data.map(item => item.Color),
            hoverBackgroundColor: Data.map(item => item.HoverColor),
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "x",
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
                color: DataLabels[2] ?? '#000',
                anchor: DataLabels[1] ?? 'middle',
                align: 'top',
                font: {
                    weight: 'bold',
                    size: 12 // Adjusted for mobile
                },
                formatter: function (value, context) {
                    return DataLabels[0] ? value : "";
                }
            },
            title: {
                display: true,
                text: ChartTitle ?? "Bar Chart Example",
                font: {
                    size: 18 // Adjusted for mobile
                },
                padding: {
                    bottom: 15
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'white',
                borderWidth: 1,
                cornerRadius: 8,
                caretSize: 6,
                padding: 10
            },
            legend: { display: false }
        },
        hover: { mode: 'nearest', intersect: true },
        scales: {
            y: {
                max: YScale[1],
                min: YScale[0],
                ticks: {
                    precision: 0,
                    font: {
                        size: 12 // Adjusted for mobile
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 12 // Adjusted for mobile
                    }
                }
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
            setYScale([0, Math.max(...dataSource.map(item => item[heads[1]]))]);
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
        <div className="w-full min-h-screen p-4 md:p-6 overflow-x-hidden">
            <h1 className="text-2xl md:text-3xl w-full text-center font-bold mb-5">BAR CHART</h1>

            <div className="w-full flex flex-col xl:flex-row justify-center items-center gap-4 md:gap-7">
                {/* Chart Container */}
                <div className="w-full lg:w-[60%] h-[400px] md:h-[500px] flex justify-center items-center">
                    <div className="lg:w-[750px] w-[90%] h-full">
                        <Bar
                            ref={chartRef}
                            data={data}
                            options={options}
                            plugins={[customCanvasBackgroundColor]}
                            className="rounded-lg md:rounded-[20px] shadow-md md:shadow-lg"
                        />
                    </div>
                </div>

                {/* Controls - Data Labels */}
                <div className="w-full xl:w-[40%] px-7 xl:px-2 flex flex-col justify-center items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <h1 className="w-full font-semibold text-lg md:text-xl mb-3">Chart Settings:</h1>
                    <div className="w-full border flex gap-2 items-center justify-between border-gray-300 rounded-md p-2">
                        <label htmlFor="datalabels" className="text-base md:text-lg font-semibold">Show Data Labels:</label>
                        <input
                            type="checkbox"
                            name="datalabels"
                            defaultChecked={true}
                            onChange={(e) => setDataLabels([e.target.checked, DataLabels[1], DataLabels[2]])}
                        />
                    </div>
                    <div className="w-full border border-gray-300 rounded-md p-2 flex items-center justify-between gap-2">
                        <label htmlFor="position" className="block text-base md:text-lg font-semibold">Position</label>
                        <select
                            id="position"
                            name="position"
                            onChange={(e) => setDataLabels([DataLabels[0], String(e.target.value), DataLabels[2]])}
                            className="block rounded-md focus:outline-none text-sm md:text-base"
                        >
                            <option value="middle" defaultValue={true}>Middle</option>
                            <option value="end">Top</option>
                            <option value="start">Bottom</option>
                        </select>
                    </div>
                    <div className="w-full border border-gray-300 rounded-md p-2 flex items-center justify-between gap-2">
                        <label htmlFor="labelsColor" className="text-base md:text-lg font-semibold">Labels Color</label>
                        <input
                            type="color"
                            name="labelsColor"
                            onChange={(e) => setDataLabels([DataLabels[0], DataLabels[1], String(e.target.value)])}
                        />
                    </div>
                    <div className="w-full flex justify-between items-center border gap-3 border-gray-300 rounded-md p-2">
                        <label className="text-base md:text-lg font-semibold" htmlFor="title">Title: </label>
                        <input
                            name="title"
                            type="text"
                            placeholder="Title"
                            value={ChartTitle ?? "Bar Chart Example"}
                            className="w-40 md:w-60 focus:outline-none border-b border-gray-300 px-2 text-sm md:text-base"
                            onChange={(e) => setChartTitle(e.target.value)}
                        />
                    </div>

                    <div className="w-full flex justify-between items-center border gap-3 border-gray-300 rounded-md p-2">
                        <h1 className="text-base md:text-lg font-semibold">Y axis:</h1>
                        <div className="flex items-center gap-2">
                            <label className="text-sm md:text-base" htmlFor="min">Min: </label>
                            <input
                                name="min"
                                type="number"
                                value={YScale[0]}
                                className="w-16 md:w-20 focus:outline-none text-sm md:text-base"
                                onChange={(e) => setYScale([Number(e.target.value), YScale[1]])}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm md:text-base" htmlFor="max">Max: </label>
                            <input
                                name="max"
                                type="number"
                                value={YScale[1]}
                                className="w-16 md:w-20 focus:outline-none text-sm md:text-base"
                                onChange={(e) => setYScale([YScale[0], Number(e.target.value)])}
                            />
                        </div>
                    </div>

                    <div className="w-full flex  justify-center gap-1 items-center">
                        <div className="w-[50%] flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                            <label className="text-base md:text-lg font-semibold" htmlFor="Opacity">Bar Opacity</label>
                            <input
                                name="Opacity"
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={Opacity}
                                onChange={(e) => {
                                    setOpacity(parseFloat(e.target.value))
                                    updateOpacityInData()
                                }}
                                className="w-16 rounded-md focus:outline-none px-2 text-sm md:text-base"
                            />
                        </div>
                        <div className="w-[50%]  flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                            <label className="text-base md:text-lg font-semibold" htmlFor="hoveropacity">Hover Opacity</label>
                            <input
                                name="hoveropacity"
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={HoverOpacity}
                                onChange={(e) => {
                                    setHoverOpacity(parseFloat(e.target.value))
                                    updateOpacityInData()
                                }}
                                className="w-16 rounded-md focus:outline-none px-2 text-sm md:text-base"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-2 w-full">
                        <div className="w-fit flex flex-wrap justify-center items-center gap-4">
                            <button
                                onClick={addRow}
                                className="w-full sm:w-48 button flex gap-2 justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            >
                                Add Row <Plus size={16} />
                            </button>
                            <ExcelReader onData={handleExcelData} />
                        </div>

                        <div className="w-fit flex flex-wrap justify-center items-center gap-4">
                            <button className="w-full sm:w-48 button flex gap-2 justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                                Save <Bookmark size={16} />
                            </button>
                            <button
                                onClick={downloadChart}
                                className="w-full sm:w-48 button flex gap-2 justify-center items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                            >
                                Download <Download size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Data Section */}
            <div className="mt-6 w-full">
                <h1 className="w-full md:w-[80%] text-xl md:text-2xl underline underline-offset-2 text-center mx-auto font-bold">Data</h1>
                <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-4 mt-4">
                    {/* Data Table */}
                    <div className="w-full lg:w-[70%] flex justify-center items-center overflow-x-auto">
                        <div className="w-[90%]">
                            {/* Header Row */}
                            <div className="grid grid-cols-3 bg-blue-600 text-center text-white font-bold rounded-t-md">
                                <input
                                    type="text"
                                    value={ChartTitle ?? Headers[0]}
                                    onChange={(e) => setChartTitle(e.target.value)}
                                    className="border-r py-2 px-2 md:px-4 border-white text-center w-full focus:outline-none text-sm md:text-base"
                                />
                                <input
                                    type="text"
                                    value={GraphHeaders ?? Headers[1]}
                                    onChange={(e) => setGraphHeaders(e.target.value)}
                                    className="border-r py-2 px-2 md:px-4 border-white text-center w-full focus:outline-none text-sm md:text-base"
                                />
                                <div className="py-2 px-2 md:px-4 text-sm md:text-base">{Headers[2]}</div>
                            </div>

                            {/* Data Rows - Droppable */}
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable" isDropDisabled={false}>
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {Data.map((item, index) => (
                                                <Draggable key={index} draggableId={String(index)} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            className="grid grid-cols-3 border-b border-gray-300 transition"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <div className="px-2 md:px-4 p-2 border-r border-gray-300 hover:bg-gray-100">
                                                                <input
                                                                    type="text"
                                                                    className="text-center w-full focus:outline-none text-sm md:text-base"
                                                                    value={item[Headers[0]] ?? ""}
                                                                    onChange={(e) => {
                                                                        const newValue = String(e.target.value);
                                                                        const updatedData = [...Data];
                                                                        updatedData[index][Headers[0]] = newValue;
                                                                        setData(updatedData);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="px-2 md:px-4 p-2 border-r border-gray-300 hover:bg-gray-100">
                                                                <input
                                                                    type="number"
                                                                    className="text-center w-full focus:outline-none text-sm md:text-base"
                                                                    value={item[Headers[1]] ?? ""}
                                                                    onChange={(e) => {
                                                                        const newValue = Number(e.target.value);
                                                                        const updatedData = [...Data];
                                                                        updatedData[index][Headers[1]] = newValue;
                                                                        setData(updatedData);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="px-2 md:px-4 p-2 hover:bg-gray-100 flex justify-center items-center gap-2 relative">
                                                                <input
                                                                    type="color"
                                                                    className="text-center w-8 h-8 focus:outline-none"
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
                                                                <Trash
                                                                    className="absolute right-2 trash-icon text-red-500 hover:text-red-700 cursor-pointer"
                                                                    size={16}
                                                                    onClick={() => deleteRow(index)}
                                                                />
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

                    {/* Controls */}

                </div>
            </div>
        </div>
    );
};

export default VerticalBarChart;