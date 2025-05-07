"use client";
import React, { useRef, useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Download, Bookmark, Plus, Trash } from "lucide-react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ExcelReader from "@/app/Input/page";
import "./page.css";

ChartJS.register(...registerables, ChartDataLabels);

const RadarChart = () => {
    const chartRef = useRef();
    const [data, setData] = useState({
        labels: [],
        datasets: []
    });
    const [Headers, setHeaders] = useState(["Category", 'Player A', 'Player B']);
    const [DataLabels, setDataLabels] = useState([true, true, "#000000"])
    const [RScale, setRScale] = useState([0, 100])
    const [Scale, setScale] = useState(true)


    const dummyData = [
        { 'Category': 'Strength', 'Player A': 65, 'Player B': 50 },
        { 'Category': 'Speed', 'Player A': 75, 'Player B': 60 },
        { 'Category': 'Agility', 'Player A': 70, 'Player B': 80 },
        { 'Category': 'Endurance', 'Player A': 80, 'Player B': 70 },
        { 'Category': 'Flexibility', 'Player A': 60, 'Player B': 75 },
        { 'Category': 'Skill', 'Player A': 90, 'Player B': 85 },
    ];

    // Setup initial data
    useEffect(() => {
        handleExcelData({ data: dummyData, headers: ["Category", "Player A", "Player B"] });
    }, []);

    const transformDataForRadarChart = (data, categoryKey) => {
        if (!data || data.length === 0) return { labels: [], datasets: [] };

        const labels = data.map(row => row[categoryKey]);

        // Find all keys except the category key and __rowNum__
        const valueKeys = Object.keys(data[0]).filter(
            key => key !== categoryKey && key !== "__rowNum__"
        );

        const datasets = valueKeys.map(key => {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);

            return {
                label: key,
                data: data.map(row => row[key]),
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
        };
    };

    const dataSource = {
        labels: data.labels, // Assuming data.labels is an array with your labels (e.g., ['Jan', 'Feb', 'Mar', ...])
        datasets: data.datasets.map((item, index) => ({
            label: item.label, // Dataset label
            data: item.data,   // Dataset data array
            fill: item.fill,   // Dataset fill property
            backgroundColor: item.backgroundColor, // Background color for the dataset
            borderColor: item.borderColor,         // Border color for the dataset
            borderWidth: item.borderWidth,         // Border width for the dataset
            pointBackgroundColor: item.borderColor, // Point background color
            pointBorderColor: "#fff", // Point border color
            pointHoverBackgroundColor: "#fff", // Point hover background color
            pointHoverBorderColor: item.backgroundColor, // Point hover border color
        }))
    };

    const options = {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            r: {
                grid: { display: DataLabels[1] ?? true },
                min: RScale[0] ?? 0,  // 👈 This sets the minimum value to zero
                max: RScale[1] ?? 100,  // 👈 This sets the maximum value to zero
                ticks: {
                    display:Scale??true,
                    beginAtZero: true, // (optional) ensures ticks start at zero
                }
            }
        },
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
                align: 'top',         // center the label in the bubble
                anchor: 'top',
                color: DataLabels[2] ?? "#000",
                font: {
                    weight: 'bold'
                },
                formatter: (value, context) => DataLabels[0] ? value : ""   // Show the actual value
            },
            title: {
                display: true,
                text: Headers[0],
                font: {
                    size: 20
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'white',
                borderWidth: 1,
                cornerRadius: 6,
                caretSize: 6,
            },
            legend: {
                position: 'bottom',
                onClick: (e) => e.stopPropagation() // Disable legend click behavior
            }
        },
        elements: {
            line: {
                borderWidth: 2,
            },
            point: {
                radius: 5,
                hoverRadius: 8
            }
        },
        onClick: (e, elements) => { if (elements.length === 0) return; },
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
        const chart = chartRef.current;
        if (chart) {
            const url = chart.toBase64Image();
            const a = document.createElement("a");
            a.href = url;
            a.download = "chart.png";
            a.click();
        }
    };

    const hexToRgba = (hex, type) => {
        hex = hex.replace("#", "");
        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);
        return type === "o"
            ? `rgba(${r}, ${g}, ${b}, 0.5)`
            : `rgba(${r}, ${g}, ${b}, 1)`;
    };

    const rgbToHex = (r, g, b) => {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    };

    const rgbaToHex = (rgba) => {
        const rgbaValues = rgba.match(/\d+/g);
        const r = parseInt(rgbaValues[0]);
        const g = parseInt(rgbaValues[1]);
        const b = parseInt(rgbaValues[2]);
        return rgbToHex(r, g, b);
    };

    const handleExcelData = ({ data, headers }) => {
        if (!data || data.length === 0) return;

        const categoryKey = headers[0];
        const transformedData = transformDataForRadarChart(data, categoryKey);

        setData(transformedData);
        setHeaders(headers);
    };


    const deleteRow = (index) => {
        const newData = { ...data };
        newData.labels.splice(index, 1);
        newData.datasets = newData.datasets.map(dataset => ({
            ...dataset,
            data: [...dataset.data.slice(0, index), ...dataset.data.slice(index + 1)]
        }));
        setData(newData);
    };

    const addRow = () => {
        const newLabel = `New ${data.labels.length + 1}`;
        const newData = { ...data };

        newData.labels.push(newLabel);
        newData.datasets = newData.datasets.map(dataset => ({
            ...dataset,
            data: [...dataset.data, 0] // Default value for new row
        }));

        setData(newData);
    };

    const addColumn = () => {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        const newHeader = "New Column"; // Dynamic header name
        const newDataset = {
            label: newHeader,
            data: Array(data.labels.length).fill(0), // Default to 0 for each row
            backgroundColor: `rgba(${r},${g},${b}, 0.5)`,
            borderColor: `rgba(${r},${g},${b}, 1)`,
            pointBackgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
            borderWidth: 3,
            fill: true,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'black'
        };

        // Add the new dataset
        setData(prev => ({
            ...prev,
            datasets: [...prev.datasets, newDataset]
        }));

        // Add the new header
        setHeaders(prev => [...prev, newHeader]);
    };

    const deleteColumn = (index) => {
        if (index === 0) return; // Don't delete the category column

        const newData = { ...data };
        const newHeaders = [...Headers];

        // Remove the dataset corresponding to the column
        newData.datasets.splice(index - 1, 1);

        // Remove the header
        newHeaders.splice(index, 1);

        setData(newData);
        setHeaders(newHeaders);
    };


    return (
        <div className="w-[100vw] overflow-x-hidden h-full p-6">
            <h1 className="text-3xl w-full text-center font-bold mb-5">RADAR CHART</h1>
            <div className="w-full flex justify-evenly gap-7 items-center h-[60%]">
                <div className="flex justify-center items-center">
                    <Radar
                        width={750}
                        height={550}
                        className="rounded-[20px] shadow-[0px_0px_8px_0px_black]"
                        ref={chartRef}
                        data={dataSource}
                        options={options}
                        plugins={[customCanvasBackgroundColor]}
                    />
                </div>
                <div className="w-[30%] flex flex-col justify-center items-center gap-3">
                        <div className="flex justify-center items-center w-[452px] flex-wrap border gap-3 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                            <label className="text-lg font-semibold" htmlFor="title">Title: </label>
                            <input name="title" type="text" placeholder="Title"
                                className="w-[80px] focus:outline-none"
                                value={Headers[0]}
                                onChange={(e) => setHeaders(prev => {
                                    const updated = [...prev];
                                    updated[0] = e.target.value;
                                    return updated;
                                })}
                            />
                        </div>
                    <div className="flex justify-center items-center gap-4">
                        <div className="w-[220px] border border-gray-300 flex gap-2 items-center justify-center rounded-md p-2">
                            <label htmlFor="datalabels" className=" text-lg font-semibold">Show Grid Labels:</label>
                            <input type="checkbox" name="datalabels" id="" defaultChecked={true} onChange={(e) => setDataLabels([DataLabels[0],e.target.checked,DataLabels[2]])} />
                        </div>
                        <div className="w-[220px] border border-gray-300 flex gap-2 items-center justify-center rounded-md p-2">
                            <label htmlFor="scale" className=" text-lg font-semibold">Show Scale:</label>
                            <input type="checkbox" name="scale" id="" defaultChecked={true} onChange={(e) => setScale(e.target.checked)} />
                        </div>
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
                        <button
                            onClick={addRow}
                            className="button flex gap-2.5 text-md justify-center items-center"
                            role="button"
                        >
                            Add Row <Plus size={18} />
                        </button>
                        <button
                            onClick={addColumn}
                            className="button flex gap-2.5 text-md justify-center items-center"
                            role="button"
                        >
                            Add Column <Plus size={18} />
                        </button>
                    </div>
                    <div className="flex justify-center gap-4 items-center">
                        <button className="button flex gap-2.5 text-md justify-center items-center" role="button">
                            Save <Bookmark size={18} />
                        </button>
                        <button
                            onClick={downloadChart}
                            className="button flex gap-2.5 text-md justify-center items-center"
                            role="button"
                        >
                            Download <Download size={18} />
                        </button>
                    </div>
                    <ExcelReader onData={handleExcelData} />
                </div>
            </div>
            <div className="mt-6">
                <h1 className="w-[80%] text-xl underline text-center underline-offset-2 mx-auto font-bold">Data</h1>
                <div className="w-[80%] mx-auto flex justify-center items-center gap-4">
                    <div className="w-fit block mt-6">
                        <div className="flex bg-blue-600 text-center text-white font-bold   rounded-t-md">
                            {Headers.map((item, index) => (
                                <div key={index} className="flex row relative border-r py-2 px-6 justify-center items-center w-[300px]">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => {
                                            const newHeaders = [...Headers];
                                            const newdata = { ...data }
                                            data.datasets[index - 1].label = e.target.value
                                            setData(newdata)
                                            newHeaders[index] = e.target.value;
                                            setHeaders(newHeaders);
                                        }}
                                        className="text-center w-[60%] focus:outline-none"
                                    />
                                    {(index > 0 && data.datasets.length > 0) && (<>
                                        <input type="color"
                                            value={rgbaToHex(data.datasets[index - 1].backgroundColor)}
                                            className="w-[30px]"
                                            onChange={(e) => {
                                                const newdata = { ...data }
                                                newdata.datasets[index - 1].backgroundColor = hexToRgba(String(e.target.value), "o")
                                                newdata.datasets[index - 1].borderColor = hexToRgba(String(e.target.value), "ho")
                                                setData(newdata)
                                            }}
                                        />
                                        <Trash
                                            size={18}
                                            onClick={() => deleteColumn(index)}
                                            className="trash-icon w-[20%] absolute right-0 cursor-pointer hover:scale-110 transition-all duration-75 ease-in-out"
                                        />
                                    </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div>
                            {data.labels.map((label, index) => (
                                <div key={index} className="flex  border-r-gray-300 transition">
                                    {/* Label input */}
                                    <div className="px-4 w-[300px] p-2  border-b border-r-gray-700 hover:bg-gray-100">
                                        <input
                                            type="text"
                                            className="text-center w-full focus:outline-none"
                                            value={label}
                                            onChange={(e) => {
                                                const newLabels = [...data.labels];
                                                newLabels[index] = e.target.value;
                                                setData(prev => ({
                                                    ...prev,
                                                    labels: newLabels
                                                }));
                                            }}
                                        />
                                    </div>

                                    {/* Dataset values */}
                                    {Headers.slice(1).map((item, i) => (
                                        <div
                                            key={i}
                                            className="row px-4 w-[300px] relative border-l border-b border-l-gray-700 flex justify-center items-center gap-2 p-2 hover:bg-gray-100"
                                        >
                                            <input
                                                type="number"
                                                className={`text-center ${i === Headers.length - 2 ? "w-[60%]" : "w-[100%]"} focus:outline-none`}
                                                value={data.datasets[i]?.data[index] || 0}
                                                onChange={(e) => {
                                                    let newData = { ...data }; // clone the data object properly
                                                    newData.datasets = newData.datasets.map((dataset, datasetIndex) => {
                                                        if (datasetIndex === i) {
                                                            const newDatasetData = [...dataset.data];
                                                            newDatasetData[index] = Number(e.target.value);
                                                            return { ...dataset, data: newDatasetData };
                                                        }
                                                        return dataset;
                                                    });
                                                    setData(newData);
                                                }}
                                            />
                                            {/* Trash Icon only on last column */}
                                            {i === Headers.length - 2 && (
                                                <Trash
                                                    size={18}
                                                    onClick={() => deleteRow(index)}
                                                    className="trash-icon w-[20%] absolute right-0 cursor-pointer hover:scale-110 transition-all duration-75 ease-in-out"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default RadarChart;