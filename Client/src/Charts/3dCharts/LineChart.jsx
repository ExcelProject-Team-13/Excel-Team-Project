"use client";
import React, { useRef, useState, useEffect } from "react";
import { Download, Bookmark, Plus, Trash, Info, Check } from "lucide-react";
import ExcelReader from "../../Input/HVPDPL";
import ".styles/page.css";
import LineChart3D from "./scripts/LineScript"


const LineChart = () => {
    let Colors = ["#0000FF", "#FF0000", "#008000", "#FFFF00", "#800080", "#FFA500", "#FFC0CB", "#A52A2A", "#808080", "#00FFFF"]
    const chartRef = useRef();
    const [Data, setData] = useState({
        labels: ['Mar', 'Apr', 'May'],
        title: "Line Chart Example",
        series: [
            { name: 'Series 1', color: '#ff0000', values: [205, 400, 100] },
            { name: 'Series 2', color: '#0000ff', values: [90, 500, 300] },
            { name: 'Series 3', color: '#ffff00', values: [100, 650, 390] },
        ],
    });
    const [dummyData, setdummyData] = useState({
        labels: ['Mar', 'Apr', 'May'],
        title: "Line Chart Example",
        series: [
            { name: 'Series 1', color: '#ff0000', values: [205, 400, 100] },
            { name: 'Series 2', color: '#0000ff', values: [90, 500, 300] },
            { name: 'Series 3', color: '#ffff00', values: [100, 650, 390] },
        ],
    });


    const handleExcelData = ({ data }) => {
        setData(data);
        // setChartTitle(heads[0])
    };
    const submit = () => {
        setData(dummyData)
        console.log(dummyData, Data)
    }

    const addRow = () => {
        const newRow = {
            name: `Series ${dummyData.series.length + 1}`,
            color: Colors[dummyData.series.length % Colors.length],
            values: Array(dummyData.labels.length).fill(0),
        };
        setdummyData((prevData) => ({
            ...prevData,
            series: [...prevData.series, newRow],
        }));
        console.log(Data)
    }
    const deleteRow = (index) => {
        const updatedSeries = dummyData.series.filter((_, i) => i !== index);
        setdummyData((prevData) => ({
            ...prevData,
            series: updatedSeries,
        }));
    }
    const deleteCol = (index) => {
        const updatedLabels = dummyData.labels.filter((_, i) => i !== index);
        const updatedSeries = dummyData.series.map((row) => {
            const updatedValues = row.values.filter((_, i) => i !== index);
            return {
                ...row,
                values: updatedValues,
            };
        });
        setdummyData((prevData) => ({
            ...prevData,
            labels: updatedLabels,
            series: updatedSeries,
        }));
    }

    const addcolumn = () => {
        const newColumn = Array(dummyData.series.length).fill(0);
        setdummyData((prevData) => ({
            ...prevData,
            labels: [...prevData.labels, `Label ${prevData.labels.length + 1}`],
            series: prevData.series.map((row, index) => ({
                ...row,
                values: [...row.values, newColumn[index]],
            })),
        }));
    }

    // Function to download chart as PNG
    const downloadChart = () => {
        if (chartRef.current) {
            chartRef.current.downloadScreenshot();
        }
    };
    const save = () => {
        let saveicon = document.getElementsByClassName("saveicon")[0]
        saveicon.style.fill == "rgb(20, 17, 168)" ? saveicon.style.fill = "rgb(255, 255, 255)" : saveicon.style.fill = "rgb(20, 17, 168)"
        console.log(saveicon.style.fill)
    }

    const displayInstructions = () => {
        const instructions = document.querySelector(".instructions");
        //if instructions has class names hidden make it flex else hidden
        if (instructions.classList.contains("hidden")) {
            instructions.classList.remove("hidden");
            instructions.classList.add("flex");
        } else {
            instructions.classList.remove("flex");
            instructions.classList.add("hidden");
        }
    }



    return (
        <div className="w-[100vw] overflow-x-hidden relative pt-7 md:px-10 px-4 pb-10">
            <Info onClick={displayInstructions} className="top-5 absolute z-[100] right-5 text-gray-500 cursor-pointer" size={20} />
            {/* giving user instructions on how to use the chart */}
            <div className="instructions absolute w-full md:top-[45%] top-[25%] overflow-hidden z-50 hidden justify-center items-center ">
                <div className="flex flex-col justify-center items-center md:w-[700px] w-[500px] h-fit py-5 px-3 bg-white/10 backdrop-blur-md rounded-xl border border-black p-6 text-black">
                    <h1 className="text-2xl font-bold underline-offset-2 underline">Instructions to User </h1>
                    <ul className="text-lg font-semibold mt-5 list-decimal px-5">
                        <li>Import the Data similar to the Default one</li>
                        <li>if you don't have similar one just Edit the Data in the Default one</li>
                        <li>Click Submit Data to see the Changes</li>
                        <li>After the Changes adjust the Chart so You can see the Full Chart and Click Download Button Or Save</li>
                    </ul>
                </div>
            </div>
            <h1 className="text-3xl w-full text-center font-bold mb-5">Line CHART</h1>
            <div className="w-full flex xl:flex-row flex-col justify-evenly gap-7 items-center h-[60%]">
                <div className="flex justify-center items-center w-[60%] h-[550px]">
                    <div className="md:w-[750px] sm:w-[550px] w-[400px] h-[293.3px] md:h-[550px] sm:h-[403px] shadow-[0_0_10px_5px_#144da8] "><LineChart3D ref={chartRef} importingData={Data} /></div>
                </div>
                <div className="xl:w-[40%] w-full flex flex-col flex-wrap justify-center items-center gap-3">
                    <div className="flex justify-center items-center md:w-[452px] w-[90%] flex-wrap border gap-3 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
                        <label className="text-lg font-semibold" htmlFor="title">Title: </label>
                        <input name="title" type="text" placeholder="Title"
                            value={dummyData.title ?? "Line Chart"}
                            className="w-[200px] focus:outline-none"
                            onChange={(e) => {
                                setdummyData({ ...dummyData, title: e.target.value });
                            }}
                        />
                    </div>
                    <div className="w-[452px] flex flex-col justify-center items-center gap-3">
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={addRow} className="button flex gap-2.5 text-md justify-center items-center" role="button">Add Row <Plus size={18} /></button>
                            <button onClick={addcolumn} className="button flex gap-2.5 text-md justify-center items-center" role="button">Add Col <Plus size={18} /></button>
                        </div>
                        <div className="flex justify-center gap-4 items-center">
                            <button onClick={save} className="button flex gap-2.5 text-md justify-center items-center" role="button">Save <Bookmark className="saveicon" size={18} /></button>
                            <button onClick={downloadChart} className="button flex gap-2.5 text-md justify-center items-center" role="button">Download <Download size={18} /></button>
                        </div>
                        <div className="flex justify-center w-[300px] gap-4 items-center">
                            <ExcelReader onData={handleExcelData} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 md:px-14 px-3">
                <div className="w-[80%]  text-xl flex justify-between items-center mx-auto font-bold">
                    <span className="underline underline-offset-2">Data</span>
                    <button onClick={submit} className="button flex gap-2.5 text-md justify-center items-center" role="button">Submit Data <Check size={18} /></button>
                </div>
                <div className="w-full overflow-x-scroll">
                    <div className="min-w-[700px] lg:w-[90%] w-full mx-auto mt-6">
                        {/* Grid Container */}
                        <div
                            className={`grid`}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${2 + dummyData.labels.length}, minmax(120px, 1fr))`,
                            }}
                        >

                            <input
                                type="text"
                                value={dummyData.title}
                                onChange={(e) => setdummyData({ ...dummyData, title: e.target.value })}
                                className="py-2 px-4 text-center font-bold bg-[#144da8] text-[#f4f3e0] border border-[#144da8] border-r-white"
                                placeholder="Chart Title"
                            />
                            {dummyData.labels.map((label, index) => (
                                <div key={index} className="relative flex justify-center items-center bg-[#144da8] border border-y-[#144da8] border-white">
                                    <input
                                        key={index}
                                        type="text"
                                        value={label}
                                        onChange={(e) => {
                                            const updatedLabels = [...dummyData.labels];
                                            updatedLabels[index] = e.target.value;
                                            setdummyData({ ...dummyData, labels: updatedLabels });
                                        }}
                                        className=" text-[#f4f3e0] font-bold text-center "
                                        placeholder={`Label ${index + 1}`}
                                    />
                                    <button
                                        onClick={() => deleteCol(index)}
                                        className="absolute w-[30px] h-[30px] top-1 right-2 text-white"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                value="Color"
                                readOnly
                                className="py-2 px-4 text-center font-bold bg-[#144da8] text-[#f4f3e0] border border-[#144da8] border-l-white"
                            />

                            {/* Data Rows */}
                            {dummyData.series.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    {/* Row Name Cell */}
                                    <input
                                        type="text"
                                        key={rowIndex}
                                        value={row.name}
                                        onChange={(e) => {
                                            const updatedSeries = [...dummyData.series];
                                            updatedSeries[rowIndex].name = e.target.value;
                                            setdummyData({ ...dummyData, series: updatedSeries });
                                        }}
                                        className="border border-[#144da8] text-center"
                                        placeholder="Row Name"
                                    />
                                    {/* Row Values */}
                                    {row.values.map((value, colIndex) => (
                                        <input
                                            type="number"
                                            key={colIndex}
                                            value={value ?? 0}
                                            onChange={(e) => {
                                                const updatedSeries = [...dummyData.series];
                                                const value = parseInt(e.target.value) || 0;
                                                updatedSeries[rowIndex].values[colIndex] = value;
                                                setdummyData({ ...dummyData, series: updatedSeries });
                                            }}

                                            className="w-full py-2 px-2 border border-[#144da8] text-center"
                                            placeholder="0"
                                        />

                                    ))}
                                    {/* add a input box for color */}
                                    <div className="relative border flex justify-center items-center border-[#144da8]">
                                        <input
                                            type="color"
                                            value={row.color}
                                            onChange={(e) => {
                                                const updatedSeries = [...dummyData.series];
                                                updatedSeries[rowIndex].color = e.target.value;
                                                setdummyData({ ...dummyData, series: updatedSeries });
                                            }}
                                            className="border w-[50%] h-[30px]  border-white text-center"
                                            placeholder="Color"
                                        />
                                        <button
                                            onClick={() => deleteRow(rowIndex)}
                                            className="absolute w-[30px] h-[30px] top-1 md:right-2 right-[-4px] text-red-500"
                                        >
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

export default LineChart;
