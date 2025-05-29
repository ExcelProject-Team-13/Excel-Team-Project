"use client";
import React, { useRef, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Download, Bookmark, Plus, Trash } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExcelReader from "../../Input/HVPDPL";
import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const LineChart = () => {
    const chartRef = useRef();
    const [Data, setData] = useState([]);
    const [Headers, setHeaders] = useState([])
    const [ChartTitle, setChartTitle] = useState("Bar Chart Example")
    const [GraphHeaders, setGraphHeaders] = useState("Value")
    const [DataLabels, setDataLabels] = useState([true, "middle", "#000000"])
    const [PointRadius, setPointRadius] = useState(5)
    const [Tension, setTension] = useState(0.3)
    const [LineColor, setLineColor] = useState("#0000ff")
    const [Fill, setFill] = useState([false, "#ff00ff"])

    // Dummy data when original data is unavailable
    const dummyData = [
        { "Date": "2021-01-01", "Value": 65 },
        { "Date": "2021-02-01", "Value": 59 },
        { "Date": "2021-03-01", "Value": 80 },
        { "Date": "2021-04-01", "Value": 81 },
        { "Date": "2021-05-01", "Value": 56 },
        { "Date": "2021-06-01", "Value": 55 }
    ];

    // Setup initial data only once
    useEffect(() => {
        handleExcelData({
            isValid: true,
            data: dummyData,
            headers: ["Date", "Value"],
            title: "polar chart"
        });
    }, []);  // re-run if excelData changes

    const hexToRgba = (hex) => {
        // Remove the hash if it exists
        hex = hex.replace("#", "");

        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, 1)`;
    };

    const data = {
        labels: Data.map(item => item[Headers[0]]),
        datasets: [{
            label: GraphHeaders,
            data: Data.map(item => item[Headers[1]]),
            hoverBackgroundColor: Data.map(item => item.HoverColor),
            pointBackgroundColor: Data.map(item => item.Color),
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: Data.map(item => item.Color),
            tension: Tension,
            borderColor: LineColor,
            fill: Fill[0],
            backgroundColor: hexToRgba(Fill[1]).replace(/rgba\(([^)]+),[^)]+\)/, 'rgba($1,0.4)'),
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 30,  // Add 30px padding on the left
                right: 30, // Add 30px padding on the right
                top: 15,
                bottom: 15
            }
        },
        plugins: [ChartDataLabels],
        plugins: {
            datalabels: {
                color: DataLabels[2] ?? '#000',
                anchor: DataLabels[1] ?? 'middle',
                align: 'top',
                font: {
                    weight: 'bold'
                },
                formatter: function (value, context) {
                    return DataLabels[0] ? value : ""; // You can customize this
                }
            },
            title: {
                display: true,
                text: ChartTitle ?? "Line Chart Example",
                font: { size: 20 }
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
        scales: { y: { beginAtZero: true } },
        elements: {
            point: {
                radius: PointRadius,
                hoverRadius: PointRadius + 3,
                borderWidth: 2,
                hoverBorderWidth: 3,
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
                    Color: `rgba(${r}, ${g}, ${b},1)`,
                };
            });


            let heads = (result.headers && result.headers.length > 0) ? result.headers : ["Category", "Value"];
            heads.push("Color", "HoverColor");
            setData(coloredDataSource);
            setHeaders(heads);
            setChartTitle(result.title)
            // setYScale([0, Math.max(...dataSource.map(item => item[heads[1]]))]);
        } else {
            alert("Invalid data format. Please upload a valid Excel file.");
        }
    };

    const addRow = () => {
        const newRow = { [Headers[0]]: "", [Headers[1]]: 0, Color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)` };
        setData([...Data, newRow]);
    }
    const deleteRow = (index) => {
        const updatedData = Data.filter((_, i) => i !== index);
        setData(updatedData);
    }


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
            <h1 className="text-3xl w-full text-center font-bold mb-5">Line CHART</h1>
            <div className="w-full flex xl:flex-row flex-col justify-evenly gap-7 items-center h-[60%]">
                <div className="flex justify-center items-center lg:w-[750px] w-full h-[550px]">
                    <div className="rounded-[20px] lg:w-[750px] w-full h-full shadow-[0px_0px_8px_0px_black]">
                        <Line
                            ref={chartRef} data={data} options={options} plugins={[customCanvasBackgroundColor]} />
                    </div>
                </div>
                <div className="w-full xl:w-[40%]">
                    <h1 className="w-full font-semibold text-xl text-center mb-6">Chart Settings:</h1>

                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {/* Row 1 */}
                        <div className="border flex gap-2 items-center justify-between border-gray-300 rounded-md p-3">
                            <label htmlFor="datalabels" className="text-lg font-semibold">Show Data Labels:</label>
                            <input type="checkbox" name="datalabels" defaultChecked={true}
                                onChange={(e) => setDataLabels([e.target.checked, DataLabels[1], DataLabels[2]])}
                            />
                        </div>

                        <div className="border border-gray-300 rounded-md p-3 flex flex-wrap items-center justify-center gap-2">
                            <label htmlFor="position" className="text-lg font-semibold">Position</label>
                            <select id="position" name="position"
                                onChange={(e) => { setDataLabels([DataLabels[0], String(e.target.value), DataLabels[2]]); console.log(DataLabels[1]) }}
                                className="block rounded-md focus:outline-none text-md"
                            >
                                <option value="middle" defaultValue={true}>Middle</option>
                                <option value="end">Top</option>
                                <option value="start">Bottom</option>
                            </select>
                        </div>

                        <div className="border border-gray-300 rounded-md p-3 flex flex-wrap  items-center gap-2 justify-center">
                            <label htmlFor="labelsColor" className="text-lg font-semibold">Labels Color</label>
                            <input type="color" name="labelsColor"
                                onChange={(e) => setDataLabels([DataLabels[0], DataLabels[1], String(e.target.value)])}
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="flex items-center justify-center flex-wrap border border-gray-300 rounded-md p-3">
                            <label className="text-lg font-semibold" htmlFor="title">Title:</label>
                            <input name="title" type="text" placeholder="Title"
                                value={ChartTitle ?? "Line Chart Example"}
                                className="w-32 focus:outline-none text-center"
                                onChange={(e) => setChartTitle(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-center flex-wrap border border-gray-300 gap-2 rounded-md p-3">
                            <label className="text-lg font-semibold" htmlFor="LineColor">Line Color</label>
                            <input type="color" name="LineColor"
                                value={LineColor ?? "#0000ff"}
                                onChange={(e) => setLineColor(String(e.target.value))}
                            />
                        </div>

                        <div className="flex items-center justify-center flex-wrap gap-4 border border-gray-300 rounded-md p-3">
                            <label className="text-lg font-semibold" htmlFor="Fill">Fill</label>
                            <input type="checkbox" name="Fill"
                                value={Fill[0] ?? false}
                                onChange={(e) => setFill([e.target.checked, Fill[1]])}
                            />
                        </div>

                        {/* Row 3 - Fill Color, Point Radius, Tension */}
                        <div className="flex items-center justify-center flex-wrap gap-2 border border-gray-300 rounded-md p-3">
                            <label className="text-lg font-semibold" htmlFor="FillColor">Fill Color</label>
                            <input type="color" name="FillColor"
                                value={Fill[1]}
                                onChange={(e) => setFill([Fill[0], String(e.target.value)])}
                            />
                        </div>

                        <div className="flex items-center justify-center flex-wrap gap-2 border border-gray-300 rounded-md p-3">
                            <label className="text-lg font-semibold" htmlFor="pointradius">Point Radius</label>
                            <input name="pointradius" type="number" min="2" max="10" step="0.5"
                                value={PointRadius}
                                onChange={(e) => setPointRadius(parseFloat(e.target.value))}
                                className="w-16 rounded-md focus:outline-none text-center"
                            />
                        </div>

                        <div className="flex items-center justify-center flex-wrap gap-2 border border-gray-300 rounded-md p-3">
                            <label className="text-lg font-semibold" htmlFor="tension">Tension</label>
                            <input name="tension" type="number" min="0" max="1" step="0.01"
                                value={Tension}
                                onChange={(e) => setTension(parseFloat(e.target.value))}
                                className="w-16 rounded-md focus:outline-none text-center"
                            />
                        </div>

                        {/* Row 4 - Buttons */}
                    </div>
                    <div className="w-full flex flex-wrap justify-center items-center gap-3">
                        <div className="w-fit mt-3 flex flex-wrap justify-between gap-4">
                            <button onClick={addRow} className="button flex-1 flex gap-2 text-md justify-center items-center p-3" role="button">
                                Add Row <Plus size={18} />
                            </button>
                            <div className="flex-1">
                                <ExcelReader onData={handleExcelData} />
                            </div>
                        </div>

                        {/* Row 5 - Buttons */}
                        <div className="w-fit mt-3 flex flex-wrap justify-between gap-4">
                            <button className="button flex-1 flex gap-2 text-md justify-center items-center p-3" role="button">
                                Save <Bookmark size={18} />
                            </button>
                            <button onClick={downloadChart} className="button flex-1 flex gap-2 text-md justify-center items-center p-3" role="button">
                                Download <Download size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-7 mt-6">
                <h1 className="w-[80%] text-3xl mb-7 underline text-center underline-offset-2 mx-auto font-bold">Data</h1>
                <div className="w-full mx-auto flex lg:flex-row flex-col-reverse justify-center items-center gap-4">
                    <div className={`lg:w-[70%] w-[90%] block mt-6`}>
                        {/* Header Row */}
                        <div className="grid grid-cols-3 bg-blue-600 text-center text-white font-bold rounded-t-md">
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
                                                        <div className="px-4 p-2  border-r border-b border-[#144da8] hover:bg-gray-100">
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
                                                        <div className="px-4 p-2  border-r border-b border-[#144da8] hover:bg-gray-100">
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
                                                        <div className="relative flex justify-center items-center row px-4 p-2  border-b border-[#144da8] hover:bg-gray-100">
                                                            <input
                                                                type="color"
                                                                className="text-center w-[50%] focus:outline-none"
                                                                value={rgbaToHex(item[Headers[2]]) ?? "#ff0000"}
                                                                onChange={(e) => {
                                                                    const newValue = hexToRgba(String(e.target.value));
                                                                    const updatedData = [...Data];
                                                                    updatedData[index][Headers[2]] = newValue;
                                                                    setData(updatedData);
                                                                }}
                                                            />
                                                            <Trash className="absolute right-7 text-red-600 trash-icon" onClick={() => deleteRow(index)} />
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

export default LineChart;
