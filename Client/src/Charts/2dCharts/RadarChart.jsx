"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Download, Plus, Trash } from "lucide-react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ExcelReader from "../../Input/else";
import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const RadarChart = () => {
    const chartRef = useRef();
    const [data, setData] = useState({
        labels: [],
        datasets: [],
        rawValues: [] // Store original values here
    });
    const [Headers, setHeaders] = useState(["Category", 'Player A', 'Player B']);
    const [DataLabels, setDataLabels] = useState([true, true, "#000000"]);
    const [RScale, setRScale] = useState([0, 100]);
    const [Scale, setScale] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dummyData = [
        { 'Category': 'Strength', 'Player A': 65, 'Player B': 50 },
        { 'Category': 'Speed', 'Player A': 75, 'Player B': 60 },
        { 'Category': 'Agility', 'Player A': 70, 'Player B': 80 },
        { 'Category': 'Endurance', 'Player A': 80, 'Player B': 70 },
        { 'Category': 'Flexibility', 'Player A': 60, 'Player B': 75 },
        { 'Category': 'Skill', 'Player A': 90, 'Player B': 85 },
    ];

    useEffect(() => {
        handleExcelData({
            isValid: true,
            title: "Qualities",
            data: dummyData,
            headers: "Category",
            products: ["Player A", "Player B"],
            format: "horizontal-table"
        });
    }, []);

    const normalize = (value, min, max) => {
        if (max === 0) return 0;
        return Math.ceil((value / max) * RScale[1]);
    };

    const updateDataValue = (datasetLabel, rowIndex, newValue) => {
        setData(prev => {
            const newData = { ...prev };

            // Update raw value
            newData.rawValues[datasetLabel][rowIndex] = newValue;

            // Find max value in this category (row) for normalization
            const categoryMax = Math.max(
                ...Object.values(newData.rawValues)
                    .map(values => values[rowIndex])
            );

            // Update normalized value
            const datasetIndex = newData.datasets.findIndex(d => d.label === datasetLabel);
            if (datasetIndex >= 0) {
                const normalizedValue = normalize(newValue, 0, categoryMax);
                newData.datasets[datasetIndex].data[rowIndex] = normalizedValue;
            }

            return newData;
        });
    };

    const transformDataForRadarChart = (data, categoryKey) => {
        if (!data || data.length === 0) return { labels: [], datasets: [], rawValues: [] };

        const labels = data.map(row => row[categoryKey]);
        const valueKeys = Object.keys(data[0]).filter(
            key => key !== categoryKey && key !== "__rowNum__"
        );

        // Store raw values
        const rawValues = valueKeys.map(key => ({
            key,
            values: data.map(row => {
                const raw = row[key];
                const num = typeof raw === "string" ? parseFloat(raw.replace(/[^0-9.-]/g, "")) : raw;
                return isNaN(num) ? 0 : num;
            })
        }));

        // Find max value for each category across all datasets
        const categoryMaxValues = labels.map((_, index) => {
            return Math.max(...rawValues.map(item => item.values[index]));
        });

        const datasets = valueKeys.map((key, keyIndex) => {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);

            return {
                label: key,
                data: data.map((row, index) => {
                    const raw = row[key];
                    const num = typeof raw === "string" ? parseFloat(raw.replace(/[^0-9.-]/g, "")) : raw;
                    return normalize(num, 0, categoryMaxValues[index]);
                }),
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
                pointBackgroundColor: `rgba(${r}, ${g}, ${b}, 1)`,
                borderWidth: 3,
                fill: true,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: `rgb(${r}, ${g}, ${b})`
            };
        });

        return {
            labels,
            datasets,
            rawValues: rawValues.reduce((acc, curr) => {
                acc[curr.key] = curr.values;
                return acc;
            }, {})
        };
    };

    const dataSource = useMemo(() => ({
        labels: data.labels,
        datasets: data.datasets.map((item) => ({
            label: item.label,
            data: item.data,
            fill: item.fill,
            backgroundColor: item.backgroundColor,
            borderColor: item.borderColor,
            borderWidth: item.borderWidth,
            pointBackgroundColor: item.borderColor,
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: item.backgroundColor,
        }))
    }), [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                grid: { display: DataLabels[1] ?? true },
                min: RScale[0] ?? 0,
                max: RScale[1] ?? 100,
                ticks: {
                    display: Scale ?? true,
                    beginAtZero: true,
                }
            }
        },
        layout: {
            padding: {
                left: isMobile ? 10 : 30,
                right: isMobile ? 10 : 30,
                top: isMobile ? 5 : 15,
                bottom: isMobile ? 5 : 15
            }
        },
        plugins: {
            datalabels: {
                align: 'top',
                anchor: 'top',
                color: DataLabels[2] ?? "#000",
                font: {
                    weight: 'bold',
                    size: isMobile ? 10 : 12
                },
                formatter: (value, context) => {
                    if (!DataLabels[0]) return "";
                    const datasetIndex = context.datasetIndex;
                    const dataIndex = context.dataIndex;
                    const datasetLabel = data.datasets[datasetIndex].label;
                    // Return the raw value if available, otherwise fall back to normalized value
                    return data.rawValues[datasetLabel]?.[dataIndex] ?? value;
                }
            },
            title: {
                display: true,
                text: Headers[0],
                font: {
                    size: isMobile ? 16 : 20
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const datasetLabel = context.dataset.label;
                        const rawValue = data.rawValues[datasetLabel]?.[context.dataIndex] ?? 'N/A';
                        const normalizedValue = context.raw;
                        return [
                            `${datasetLabel}: ${rawValue} (actual)`,
                            `Normalized: ${normalizedValue}`
                        ];
                    }
                }
            },
            legend: {
                position: isMobile ? 'top' : 'bottom',
                labels: {
                    boxWidth: isMobile ? 10 : 15,
                    padding: isMobile ? 5 : 10,
                    font: {
                        size: isMobile ? 10 : 12
                    }
                },
                onClick: (e) => e.stopPropagation()
            }
        },
        elements: {
            line: {
                borderWidth: 2,
            },
            point: {
                radius: isMobile ? 4 : 5,
                hoverRadius: isMobile ? 6 : 8
            }
        },
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

    const downloadChart = () => {
        const chart = chartRef?.current;
        if (chart) {
            const url = chart.toBase64Image();
            const a = document.createElement("a");
            a.href = url;
            a.download = "radar-chart.png";
            a.click();
        }
    };

    const hexToRgba = (hex, type) => {
        hex = hex.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return type === "o"
            ? `rgba(${r}, ${g}, ${b}, 0.5)`
            : `rgba(${r}, ${g}, ${b}, 1)`;
    };

    const rgbaToHex = (rgba) => {
        const rgbaValues = rgba.match(/\d+/g);
        if (!rgbaValues || rgbaValues.length < 3) return "#000000";
        const r = parseInt(rgbaValues[0]);
        const g = parseInt(rgbaValues[1]);
        const b = parseInt(rgbaValues[2]);
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    };

    const handleExcelData = (result) => {
        if (!result.isValid) return;

        const categoryKey = "Category";
        const transformedData = transformDataForRadarChart(result.data, categoryKey);

        setData(transformedData);
        setHeaders(["Chart Title", ...result.products]);

        // Calculate appropriate scale based on normalized values
        const maxNormalizedValue = Math.max(...transformedData.datasets.flatMap(d => d.data));
        const nearestMultiple = Math.ceil(maxNormalizedValue / 50) * 50;
        setRScale([0, nearestMultiple > 0 ? nearestMultiple : 100]);
    };

    const deleteRow = (index) => {
        const newData = { ...data };
        newData.labels.splice(index, 1);
        newData.datasets = newData.datasets.map(dataset => ({
            ...dataset,
            data: [...dataset.data.slice(0, index), ...dataset.data.slice(index + 1)]
        }));

        // Also update raw values
        Object.keys(newData.rawValues).forEach(key => {
            newData.rawValues[key].splice(index, 1);
        });

        setData(newData);
    };

    const addRow = () => {
        const newLabel = `New ${data.labels.length + 1}`;
        const newData = { ...data };

        newData.labels.push(newLabel);
        newData.datasets = newData.datasets.map(dataset => ({
            ...dataset,
            data: [...dataset.data, 0]
        }));

        // Add zero values for raw data
        Object.keys(newData.rawValues).forEach(key => {
            newData.rawValues[key].push(0);
        });

        setData(newData);
    };

    const addColumn = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const newHeader = `Player ${Headers.length}`;

        const newDataset = {
            label: newHeader,
            data: Array(data.labels.length).fill(0),
            backgroundColor: `rgba(${r},${g},${b}, 0.5)`,
            borderColor: `rgba(${r},${g},${b}, 1)`,
            pointBackgroundColor: `rgba(${r},${g},${b}, 1)`,
            borderWidth: 3,
            fill: true,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: `rgb(${r},${g},${b})`
        };

        setData(prev => ({
            ...prev,
            datasets: [...prev.datasets, newDataset],
            rawValues: {
                ...prev.rawValues,
                [newHeader]: Array(prev.labels.length).fill(0)
            }
        }));

        setHeaders(prev => [...prev, newHeader]);
    };

    const deleteColumn = (index) => {
        if (index <= 0 || index >= Headers.length) return;

        const newData = { ...data };
        const newHeaders = [...Headers];
        const columnKey = Headers[index];

        newData.datasets.splice(index - 1, 1);

        // Remove raw values for this column
        const { [columnKey]: _, ...remainingRawValues } = newData.rawValues;
        newData.rawValues = remainingRawValues;

        newHeaders.splice(index, 1);

        setData(newData);
        setHeaders(newHeaders);
    };

    return (
        <div className="w-full min-h-screen p-4 md:p-6 bg-gray-50">
            <h1 className="text-2xl md:text-3xl w-full text-center font-bold mb-5">RADAR CHART</h1>

            <div className="w-full flex flex-col lg:flex-row justify-center gap-4 md:gap-7 items-center">
                <div className="w-full xl:w-[60%] lg:w-[50%] flex justify-center items-center p-4 ">
                    <div className="w-full max-w-[750px] h-auto aspect-[4/3]">
                        <Radar
                            className="rounded-lg shadow-sm"
                            ref={chartRef}
                            data={dataSource}
                            options={options}
                            plugins={[customCanvasBackgroundColor]}
                        />
                    </div>
                </div>

                <div className="w-full lg:w-[40%] grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-lg shadow-md">
                    <h2 className="col-span-1 sm:col-span-2 text-lg font-semibold mb-2">Chart Settings</h2>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Show Grid Lines</label>
                        <input
                            type="checkbox"
                            checked={DataLabels[1]}
                            onChange={(e) => setDataLabels([DataLabels[0], e.target.checked, DataLabels[2]])}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Show Scale</label>
                        <input
                            type="checkbox"
                            checked={Scale}
                            onChange={(e) => setScale(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Min Value</label>
                        <input
                            type="number"
                            value={RScale[0] || 0}
                            onChange={(e) => setRScale([Number(e.target.value), RScale[1]])}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Max Value</label>
                        <input
                            type="number"
                            value={RScale[1] || 100}
                            onChange={(e) => setRScale([RScale[0], Number(e.target.value)])}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex w-full flex-col gap-1">
                        <label className="text-sm font-medium">Chart Title</label>
                        <input
                            type="text"
                            value={Headers[0]}
                            onChange={(e) => setHeaders(prev => [e.target.value, ...prev.slice(1)])}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-3 mt-2">
                        <button
                            onClick={addRow}
                            className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                        >
                            <Plus size={16} /> Add Row
                        </button>
                        <button
                            onClick={addColumn}
                            className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                        >
                            <Plus size={16} /> Add Column
                        </button>
                    </div>

                    <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-3">
                        <ExcelReader onData={handleExcelData} />
                        <button
                            onClick={downloadChart}
                            className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-green-700 transition text-sm"
                        >
                            <Download size={16} /> Download
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 w-full overflow-x-auto">
                <h2 className="w-full text-lg md:text-xl underline text-center underline-offset-2 font-bold mb-4">Data Table (Showing Actual Values)</h2>

                <div className="w-full lg:w-[60%] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header Row */}
                    <div className={`grid grid-cols-${Headers.length} bg-blue-600 text-white font-bold`}>
                        {Headers.map((item, index) => (
                            <div key={index} className={`relative py-2 px-2 md:px-4 flex justify-center items-center border-r border-blue-500`}>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                        const newHeaders = [...Headers];
                                        const newdata = { ...data };
                                        if (index > 0 && newdata.datasets[index - 1]) {
                                            newdata.datasets[index - 1].label = e.target.value;
                                        }
                                        setData(newdata);
                                        newHeaders[index] = e.target.value;
                                        setHeaders(newHeaders);
                                    }}
                                    className="text-center w-[60%] focus:outline-none bg-transparent text-white placeholder-gray-200"
                                />
                                {index > 0 && (
                                    <>
                                        <input
                                            type="color"
                                            value={data.datasets[index - 1] ? rgbaToHex(data.datasets[index - 1].backgroundColor) : '#000000'}
                                            onChange={(e) => {
                                                const newdata = { ...data };
                                                if (newdata.datasets[index - 1]) {
                                                    const hex = e.target.value;
                                                    newdata.datasets[index - 1].backgroundColor = hexToRgba(hex, "o");
                                                    newdata.datasets[index - 1].borderColor = hexToRgba(hex, "o");
                                                    newdata.datasets[index - 1].pointBackgroundColor = hexToRgba(hex, "o");
                                                    newdata.datasets[index - 1].pointHoverBorderColor = `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;
                                                }
                                                setData(newdata);
                                            }}
                                            className="w-6 h-6 ml-2 cursor-pointer"
                                        />
                                        <button
                                            onClick={() => deleteColumn(index)}
                                            className="ml-2 text-red-300 hover:text-white"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Data Rows */}
                    <div className="divide-y divide-gray-200">
                        {data.labels.map((label, rowIndex) => (
                            <div key={rowIndex} className={`grid grid-cols-${Headers.length} hover:bg-gray-50`}>
                                {/* Label Column */}
                                <div className="py-2 px-2 md:px-4 border-r border-gray-200">
                                    <input
                                        type="text"
                                        value={label || ""}
                                        onChange={(e) => {
                                            const newLabels = [...data.labels];
                                            newLabels[rowIndex] = e.target.value;
                                            setData(prev => ({
                                                ...prev,
                                                labels: newLabels
                                            }));
                                        }}
                                        className="text-center w-full focus:outline-none"
                                    />
                                </div>

                                {/* Data Columns */}
                                {Headers.slice(1).map((header, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className={`py-2 px-2 md:px-4 border-r border-gray-200 flex justify-center items-center`}
                                    >
                                        <input
                                            type="number"
                                            value={data.rawValues[header] ? data.rawValues[header][rowIndex] || 0 : 0}
                                            onChange={(e) => updateDataValue(header, rowIndex, Number(e.target.value))}

                                            className="text-center w-[80%] focus:outline-none border-b border-gray-300 focus:border-blue-500"
                                        />
                                        {colIndex === Headers.length - 2 && (
                                            <button
                                                onClick={() => deleteRow(rowIndex)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadarChart;