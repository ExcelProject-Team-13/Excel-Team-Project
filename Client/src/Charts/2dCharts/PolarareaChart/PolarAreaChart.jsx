"use client";
import React, { useRef, useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Download, Bookmark, Plus, Trash } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExcelReader from "@/app/Input/page";
import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const PieChart = () => {
    const chartRef = useRef();
    const [Data, setData] = useState([]);
    const [Headers, setHeaders] = useState([])
    const [GraphHeaders, setGraphHeaders] = useState("Value")
    const [DataLabels, setDataLabels] = useState([true, "#000000"])
    const [GridLines, setGridLines] = useState(true)
    const [offset, setoffset] = useState(5)
    const [RScale, setRScale] = useState([0, 100])
    const [Opacity, setOpacity] = useState(0.4)
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
        handleExcelData({ data: dummyData, headers: ["Category", "Value"] });

    }, []);  // re-run if excelData changes

    const data = {
        labels: Data.map(item => item[Headers[0]]),
        datasets: [{
            label: GraphHeaders,
            data: Data.map(item => item[Headers[1]]),
            backgroundColor: Data.map(item => item.Color),
            hoverBackgroundColor: Data.map(item => item.HoverColor),
            offset: offset ?? 5,
            hoverOffset:offset+10 ?? 40
        }]
    };



    const options = {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 30,
                right: 30,
                top: 15,
                bottom: 15
            }
        },
        scales: {
            r: {
                max: RScale[1] ?? 100, min: RScale[0] ?? 0, ticks: { stepSize: 10 },
                grid: { display: GridLines }
            }
        },
        plugins: {
            datalabels: {
                achor: "end",
                align: 'end',
                color: DataLabels[1] ?? '#000',
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];  // Get the label (name) for the slice
                    const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);  // Calculate the total from the dataset
                    const percentage = ((value / total) * 100).toFixed(2);  // Calculate the percentage
                    return DataLabels[0] ? `${label}: ${value} \n(${percentage}%)` : "";  // Format as "name: value (percentage)"
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

        let heads = (headers && headers.length > 0) ? headers : ["Category", "Value"];
        heads.push("Color", "HoverColor");
        setData(coloredDataSource);
        setHeaders(heads);
        setChartTitle(heads[0])
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
        // Remove the hash if it exists
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
            const url = chart.toBase64Image(); // Get chart image in base64 format
            const a = document.createElement("a");
            a.href = url;
            a.download = "chart.png"; // Specify the file name
            a.click(); // Trigger the download
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

    // Drag and Drop handler
    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        const items = Array.from(Data);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        setData(items);
    };





    return (
        <div className="w-[100vw] overflow-x-hidden h-full p-6">
            <h1 className="text-3xl w-full text-center font-bold mb-5">PolarArea CHART</h1>
            <div className="w-full flex justify-evenly gap-7 items-center h-[60%]">
                <div className="flex justify-center items-center w-[750px] h-[550px]"><PolarArea className="rounded-[20px] shadow-[0px_0px_8px_0px_black]"
                    width={750} height={550} ref={chartRef} data={data} options={options} plugins={[customCanvasBackgroundColor]} /></div>
                <div className="w-[30%] flex flex-col flex-wrap justify-center items-start gap-3">
                    <h1 className="w-full font-semibold text-xl mb-3">Data Labels:</h1>
                    <div className="w-[200px] border flex gap-2 items-center justify-start border-[#144da8] rounded-md p-2">
                        <label htmlFor="datalabels" className=" text-lg font-semibold">Show Data Labels:</label>
                        <input type="checkbox" name="datalabels" id="" defaultChecked={true} onChange={(e) => setDataLabels([e.target.checked, DataLabels[1]])} />
                    </div>

                    <div className="flex justify-start border border-[#144da8] rounded-md p-2 w-[200px] items-center gap-2">
                        <label htmlFor="labelsColor" className="text-lg font-semibold">Labels Color</label>
                        <input type="color" name="labelsColor" id="" value={DataLabels[1]} onChange={(e) => setDataLabels([DataLabels[0], String(e.target.value)])} />
                    </div>
                    <div className="w-[200px] border flex gap-2 items-center justify-start border-[#144da8] rounded-md p-2">
                        <label htmlFor="datalabels" className=" text-lg font-semibold">Show Grid Labels:</label>
                        <input type="checkbox" name="datalabels" id="" defaultChecked={true} onChange={(e) => setGridLines(e.target.checked)} />
                    </div>
                </div>
            </div>
            <div className=" mt-6">
                <h1 className="w-[80%] text-xl underline underline-offset-2 mx-auto font-bold">Data</h1>
                <div className="w-[80%] mx-auto flex justify-center items-center gap-4">
                    <div className={`w-[50%] block mt-6`}>
                        {/* Header Row */}
                        <div className="grid grid-cols-3 bg-[#144da8] text-center text-[#f4f3e0] font-bold rounded-t-md">
                            <input type="text" name="" id=""
                                value={ChartTitle ?? Headers[0]}
                                onChange={(e) => { setChartTitle(e.target.value) }}
                                className="border-r py-2 px-4 border-white text-center w-full focus:outline-none"
                            />
                            <input type="text" name="" id=""
                                value={GraphHeaders ?? Headers[1]}
                                onChange={(e) => { setGraphHeaders(e.target.value) }}
                                className="border-r py-2 px-4 border-white text-center w-full focus:outline-none"
                            />
                            <div className="py-2 px-4">{Headers[2]}</div>
                        </div>
                        {/* Data Rows */}
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
                                                        <div className="px-4 p-2 border-b border-r border-[#144da8] hover:bg-gray-100">
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
                                                        <div className="px-4  flex justify-between border-b border-r border-[#144da8] items-center gap-2 p-2 hover:bg-gray-100">
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
                                                        <div className="px-4 border-b border-[#144da8] relative row flex justify-center items-center gap-2 p-2 hover:bg-gray-100">
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
                                                            <Trash className="absolute right-7 trash-icon" onClick={() => deleteRow(index)} />
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
                    <div className="w-[50%] flex flex-col justify-center items-center gap-3">
                        <div className="flex justify-center items-center w-[452px] flex-wrap border gap-3 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                            <label className="text-lg font-semibold" htmlFor="title">Title: </label>
                            <input name="title" type="text" placeholder="Title"
                                value={ChartTitle ?? "Bar Chart Example"}
                                className="w-[80px] focus:outline-none"
                                onChange={(e) => {
                                    setChartTitle(e.target.value)
                                }}
                            />
                        </div>
                        <div className="flex justify-center items-center w-[452px] flex-wrap border gap-3 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                            <h1 className="w-[100px] text-xl font-semibold">Axis:</h1>
                            <div className="w-[100px] ">
                                <label className="text-lg font-semibold" htmlFor="min">Min: </label>
                                <input name="min" type="number"
                                    value={RScale[0]}
                                    className="w-[50px] focus:outline-none"
                                    onChange={(e) => { setRScale([Number(e.target.value), RScale[1]]) }}
                                />
                            </div>
                            <div className="w-[100px] ">
                                <label className="text-lg font-semibold" htmlFor="max">Max: </label>
                                <input name="max" type="number"
                                    value={RScale[1]}
                                    className="w-[50px] focus:outline-none"
                                    onChange={(e) => { setRScale([RScale[0], Number(e.target.value)]) }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-4">

                            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                                <label className="text-lg font-semibold" htmlFor="Opacity">Chart Opacity</label>
                                <input name="Opacity" type="number" min="0" max="1" step="0.01"
                                    value={Opacity}
                                    onChange={(e) => {
                                        setOpacity(parseFloat(e.target.value))
                                        updateOpacityInData()
                                    }}
                                    className="w-[60px] rounded-md focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                                <label className="text-lg font-semibold" htmlFor="offset">Offset</label>
                                <input name="offset" type="number" min="0" max="100" step="5"
                                    value={offset}
                                    onChange={(e) => {
                                        setoffset(parseFloat(e.target.value))
                                        updateOpacityInData()
                                    }}
                                    className="w-[60px] rounded-md focus:outline-none"
                                />
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

export default PieChart;
