"use client";
import React, { useRef, useState, useEffect } from "react";
import { Bubble } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Download, Bookmark, Plus, Trash } from "lucide-react";
import ExcelReader from "../../Input/2dbubble";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const BubbleChart = () => {
    const chartRef = useRef();
    const [chartData, setChartData] = useState([]);
    const [showGrid, setShowGrid] = useState(true);
    const [headers, setHeaders] = useState(["Label", "X", "Y", "Radius"]);
    const [dataLabels, setDataLabels] = useState([true, "top", "#000000"]);
    const [opacity, setOpacity] = useState(0.4);
    const [chartTitle, setChartTitle] = useState("Bubble Chart");
    const [saved, setSaved] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize with sample data
    useEffect(() => {
        handleExcelData({
            isValid: true,
            title: "Sample Data",
            headers: ["Label", "X", "Y", "Radius"],
            data: [
                { label: "Point A", x: 12, y: 18, radius: 5 },
                { label: "Point B", x: 8, y: 22, radius: 7 },
                { label: "Point C", x: 15, y: 15, radius: 10 },
                { label: "Point D", x: 20, y: 10, radius: 8 },
                { label: "Point E", x: 25, y: 30, radius: 12 }
            ],
            format: "point-data"
        });
    }, []);

    // Process Excel data
    const handleExcelData = (result) => {
        console.log(result)
        if (!result.isValid) return;

        // Add colors to each data point
        const coloredData = result.data.map((item, index) => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return {
                ...item,
                color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
                hoverColor: `rgba(${r}, ${g}, ${b}, 1)`
            };
        });

        setChartData(coloredData);
        setHeaders(result.headers || ["Label", "X", "Y", "Radius"]);
        setChartTitle(result.title || "Bubble Chart");
    };

    const updateOpacityInData = () => {
        const updatedData = chartData.map(item => {
            const rgbaValues = item.color.match(/\d+/g); // ✅ Fix property name
            const r = rgbaValues[0];
            const g = rgbaValues[1];
            const b = rgbaValues[2];
            return {
                ...item,
                color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
                hoverColor: `rgba(${r}, ${g}, ${b}, 1)` // 1 for full opacity on hover
            };
        });
        setChartData(updatedData); // ✅ Also fix: was 'setData' which is not defined
    };


    // Chart data configuration
    const data = {
        datasets: [{
            label: 'Bubble Dataset',
            data: chartData.map(item => ({
                x: item.x,
                y: item.y,
                r: item.radius,
                label: item.label
            })),
            backgroundColor: chartData.map(item => item.color),
            opacity: opacity,
            borderColor: chartData.map(item => item.hoverColor),
            hoverBackgroundColor: chartData.map(item => item.hoverColor),
        }]
    };

    // Chart options
    const options = {
        responsive: true,
        layout: {
            padding: {
                left: isMobile ? 10 : 30,
                right: isMobile ? 10 : 30,
                top: isMobile ? 5 : 45,
                bottom: isMobile ? 5 : 15
            }
        },
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: chartTitle ?? "Bubble Chart Example",
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            legend: { display: false },
            datalabels: {
                display: dataLabels[0],
                align: dataLabels[1],
                color: dataLabels[2],
                formatter: (value, context) => {
                    const point = context.dataset.data[context.dataIndex];
                    return `${point.label} (${point.x}, ${point.y}, ${point.r})`;
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const point = context.dataset.data[context.dataIndex];
                        return `${point.label} (${point.x}, ${point.y}, ${point.r})`;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: showGrid } },
            y: { grid: { display: showGrid } }
        }
    };

    // Add new data point
    const addRow = () => {
        const newPoint = {
            label: `Point ${String.fromCharCode(65 + chartData.length)}`,
            x: 0,
            y: 0,
            radius: 5,
            color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${opacity})`,
            hoverColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`
        };
        setChartData([...chartData, newPoint]);
    };

    // Delete data point
    const deleteRow = (index) => {
        setChartData(chartData.filter((_, i) => i !== index));
    };

    // Download chart as image
    const downloadChart = () => {
        if (chartRef.current) {
            const url = chartRef.current.toBase64Image();
            const a = document.createElement('a');
            a.href = url;
            a.download = `${chartTitle || 'bubble-chart'}.png`;
            a.click();
        }
    };
    let customCanvasBackgroundColor = {
        id: "customCanvasBackgroundColor",
        beforeDraw: (chart) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    }
    return (
        <div className="w-full min-h-screen p-4" >
            <h1 className="text-2xl font-bold text-center mb-6">Bubble Chart</h1>

            <div className="flex flex-col lg:flex-row justify-evenly h-full items-center gap-6">
                {/* Chart Area */}
                <div className="w-full lg:w-[750px] h-[550px] bg-white rounded-lg shadow">
                    <Bubble
                        ref={chartRef}
                        data={data}
                        options={options}
                        plugins={[customCanvasBackgroundColor]}

                    />
                </div>

                {/* Controls */}
                <div className="w-full lg:w-1/3 space-y-4">
                    <div className="bg-white p-4 rounded-lg space-y-4">
                        <h2 className="font-semibold text-lg">Chart Settings</h2>

                        <div className="flex items-center justify-between">
                            <label>Show Data Labels</label>
                            <input
                                type="checkbox"
                                checked={dataLabels[0]}
                                onChange={(e) => setDataLabels([e.target.checked, ...dataLabels.slice(1)])}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Labels Position</label>
                            <select
                                value={dataLabels[1]}
                                onChange={(e) => setDataLabels([dataLabels[0], e.target.value, dataLabels[2]])}
                                className="border rounded px-2 py-1"
                            >
                                <option value="top">Top</option>
                                <option value="middle">Middle</option>
                                <option value="bottom">Bottom</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Labels Color</label>
                            <input
                                type="color"
                                value={dataLabels[2]}
                                onChange={(e) => setDataLabels([dataLabels[0], dataLabels[1], e.target.value])}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Chart Title</label>
                            <input
                                type="text"
                                value={chartTitle}
                                onChange={(e) => setChartTitle(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Bubble Opacity</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={opacity}
                                onChange={(e) => {
                                    setOpacity(parseFloat(e.target.value))
                                    updateOpacityInData()
                                }}
                                className="w-24"
                            />
                            <span>{opacity.toFixed(1)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Show Grid</label>
                            <input
                                type="checkbox"
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                            />
                        </div>

                        <div className="flex gap-2 pt-2 w-full justify-center items-center">
                            <button
                                onClick={addRow}
                                className="w-full sm:w-48 button flex gap-2 justify-center items-center px-4 py-2  text-white rounded-md transition"
                            >
                                <Plus size={16} /> Add Point
                            </button>
                            <ExcelReader onData={handleExcelData} />
                        </div>

                        <div className="flex gap-2 w-full justify-center items-center">
                            <button
                                onClick={() => setSaved(!saved)}
                                className="w-full sm:w-48 button flex gap-2 justify-center items-center px-4 py-2  text-white rounded-md transition"
                            >
                                <Bookmark size={16} fill={saved ? "white" : "none"} /> Save
                            </button>
                            <button
                                onClick={downloadChart}
                                className="w-full sm:w-48 button flex gap-2 justify-center items-center px-4 py-2  text-white rounded-md transition"
                            >
                                <Download size={16} /> Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="mt-8" >
                <h2 className="text-xl w-full text-center font-semibold mb-4">Data Points</h2>
                <div className="overflow-x-auto w-[100%] px-3 flex justify-center items-center">
                    <table className=" w-full lg:w-[70%] bg-white border">
                        <thead>
                            <tr className="bg-white">
                                {headers.map((header, index) => (
                                    <th key={index} className="py-2 px-4 border">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="py-2 px-4 border">
                                        <input
                                            type="text"
                                            value={row.label}
                                            onChange={(e) => {
                                                const newData = [...chartData];
                                                newData[rowIndex].label = e.target.value;
                                                setChartData(newData);
                                            }}
                                            className="w-full px-2 py-1 text-center rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <input
                                            type="number"
                                            value={row.x}
                                            onChange={(e) => {
                                                const newData = [...chartData];
                                                newData[rowIndex].x = Number(e.target.value);
                                                setChartData(newData);
                                            }}
                                            className="w-full px-2 py-1 text-center rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <input
                                            type="number"
                                            value={row.y}
                                            onChange={(e) => {
                                                const newData = [...chartData];
                                                newData[rowIndex].y = Number(e.target.value);
                                                setChartData(newData);
                                            }}
                                            className="w-full px-2 py-1 text-center rounded"
                                        />
                                    </td>
                                    <td className="py-2  border relative">
                                        <input
                                            type="number"
                                            value={row.radius}
                                            onChange={(e) => {
                                                const newData = [...chartData];
                                                newData[rowIndex].radius = Number(e.target.value);
                                                setChartData(newData);
                                            }}
                                            className="w-[90%] px-2 py-1 text-center rounded"
                                        />
                                        <Trash size={18} onClick={() => deleteRow(rowIndex)} className="right-[15px] cursor-pointer z-20 top-[15px] absolute" />
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >
        </div >
    );
};

export default BubbleChart;