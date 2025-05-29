"use client";
import React, { useRef, useState, useEffect } from "react";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Download, Bookmark, Plus, ArrowLeftRightIcon, Trash } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExcelReader from "../../Input/2dmixed";
import "./page.css";

ChartJS.register(...registerables);

function getRandomHexColor() {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, "0")}`;
}

const MixedChart = () => {
  const chartRef = useRef();
  const [Data, setData] = useState([]);
  const [Headers, setHeaders] = useState([]);
  const [GraphHeaders, setGraphHeaders] = useState(["bar", "line"]);
  const [ChartTitle, setChartTitle] = useState("Mixed Chart Example");
  const [PointRadius, setPointRadius] = useState(5);
  const [Tension, setTension] = useState(0.3);
  const [LineColor, setLineColor] = useState("#ff00ff");
  const [Fill, setFill] = useState([false, "#ff00ff"]);
  const [GraphColor, setGraphColor] = useState("#ffffff")
  const [BarOpacity, setBarOpacity] = useState(0.4);
  const [BarHoverOpacity, setBarHoverOpacity] = useState(1);
  const [BarColors, setBarColors] = useState([]);

  // Dummy data when original data is unavailable
  const dummyData = [
    { "Category": "2021-01-01", "bar": 65, "line": 45 },
    { "Category": "2021-02-01", "bar": 59, "line": 48 },
    { "Category": "2021-03-01", "bar": 80, "line": 40 },
    { "Category": "2021-04-01", "bar": 81, "line": 65 },
    { "Category": "2021-05-01", "bar": 56, "line": 59 },
    { "Category": "2021-06-01", "bar": 55, "line": 80 }
  ];

  // Setup initial data only once
  useEffect(() => {
    handleExcelData({
      isValid: true,  // After fixing the row count validation
      title: "Sample Data",  // Without the extension
      data: dummyData,
      headers: "Date",  // From headers[0]
      products: ["bar", "line"],  // From headers.slice(1)
      format: "horizontal-table"
    });
  }, []);

  const hexToRgba = (hex, opacity = 1) => {
    hex = hex.replace("#", "");
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const data = {
    labels: Data.map(item => item[Headers[0]]),
    datasets: [
      {
        type: 'line',
        label: GraphHeaders[0] ?? Headers[2],
        data: Data.map(item => item[Headers[2]]),
        pointBackgroundColor: Data.map(item => item[Headers[4]]),
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: Data.map(item => item[Headers[4]]),
        tension: Tension,
        borderColor: LineColor,
        fill: Fill[0],
        backgroundColor: hexToRgba(Fill[1]).replace(/rgba\(([^)]+),[^)]+\)/, 'rgba($1,0.4)'),
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: GraphHeaders[1] ?? Headers[1],
        data: Data.map(item => item[Headers[1]]),
        backgroundColor: Data.map(item => item[Headers[3]]),
        hoverBackgroundColor: Data.map(item => item[Headers[3]]),
        hoverBorderColor: Data.map(item => item[Headers[3]]),
        yAxisID: 'y1',
      }
    ]
  };

  console.log(Data)

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
    plugins: {
      title: {
        display: true,
        text: ChartTitle ?? "Mixed Chart Example",
        font: {
          size: 16, // Smaller on mobile
          weight: 'bold'
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
      legend: {
        display: false,
      }
    },
    hover: { mode: 'nearest', intersect: true },
    scales: {
      y: {
        beginAtZero: true,
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: Headers[2],
          font: {
            size: 12 // Smaller on mobile
          }
        },
        ticks: {
          font: {
            size: 10 // Smaller on mobile
          }
        }
      },
      y1: {
        beginAtZero: true,
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: Headers[1],
          font: {
            size: 12 // Smaller on mobile
          }
        },
        ticks: {
          font: {
            size: 10 // Smaller on mobile
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10 // Smaller on mobile
          }
        }
      }
    },
    elements: {
      point: {
        radius: PointRadius,
        hoverRadius: PointRadius + 3,
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
      bar: {
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    }
  };

  let customCanvasBackgroundColor = {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = GraphColor ?? "#ffffff";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

  const swapChartData = () => {
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      return newData.map(item => {
        const temp = item[Headers[2]];
        item[Headers[2]] = item[Headers[1]];
        item[Headers[1]] = temp;
        return item;
      });
    });
  };

  const handleExcelData = (result) => {
    let dataSource = data && data.length > 0 ? data : result.data;

    const coloredDataSource = dataSource.map((item) => {
      return {
        ...item,
        BarColor: item.BarColor || getRandomHexColor(),
        LineColor: item.LineColor || getRandomHexColor()
      };
    });

    let heads = (result.products && result.products.length > 0) ? ["Category", ...result.products, "BarColor", "LineColor"] : ["Date", "Value", "line", "BarColor", "LineColor"];
    setData(coloredDataSource);
    setHeaders(heads);
    setChartTitle(result.headers)
    setBarColors(coloredDataSource.map(item => item.BarColor));

  };

  const addRow = () => {
    const newRow = {
      [Headers[0]]: "AddValue",
      [Headers[1]]: 0,
      [Headers[2]]: 0,
      [Headers[3]]: getRandomHexColor(),
      [Headers[4]]: getRandomHexColor()
    };
    setData([...Data, newRow]);
  }

  const deleteRow = (index) => {
    const updatedData = Data.filter((_, i) => i !== index);
    setData(updatedData);
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
      <h1 className="text-2xl md:text-3xl w-full text-center font-bold mb-5">MIXED CHART</h1>

      {/* Chart and Controls Container */}
      <div className="w-full flex flex-col xl:flex-row justify-center items-center gap-4 md:gap-7">
        {/* Chart Container */}
        <div className="w-full lg:w-[65%] h-[400px] md:h-[500px] flex justify-center items-center">
          <div className="lg:w-[850px] w-full h-full">
            <Chart
              ref={chartRef}
              className="rounded-lg md:rounded-[20px] shadow-md md:shadow-lg"
              type='bar'
              data={data}
              options={options}
              plugins={[customCanvasBackgroundColor]}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="w-full xl:w-[40%] flex flex-col justify-center items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <h1 className="w-full font-semibold text-lg text-center md:text-xl mb-3">Chart Controls:</h1>
          <div className="w-full flex flex-wrap justify-center items-center gap-3">
            {/* Title Input */}
            <div className="md:w-[350px] w-full border flex gap-2 items-center justify-between border-gray-300 rounded-md p-2">
              <label className="text-base md:text-lg font-semibold" htmlFor="title">Title: </label>
              <input
                name="title"
                type="text"
                placeholder="Title"
                value={ChartTitle ?? "Mixed Chart Example"}
                className="w-40 md:w-60 focus:outline-none text-sm md:text-base"
                onChange={(e) => setChartTitle(e.target.value)}
              />
            </div>

            {/* Line Color */}
            <div className="md:w-[350px] w-full border flex items-center justify-between border-gray-300 rounded-md p-2">
              <label className="text-base md:text-lg font-semibold" htmlFor="LineColor">Line Color</label>
              <input
                type="color"
                name="LineColor"
                value={LineColor ?? "#0000ff"}
                onChange={(e) => setLineColor(String(e.target.value))}
              />
            </div>

            {/* Fill Controls */}
            <div className="md:w-[350px] w-full flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-1/2 border flex items-center justify-between border-gray-300 rounded-md p-2">
                <label className="text-base md:text-lg font-semibold" htmlFor="Fill">Fill</label>
                <input
                  type="checkbox"
                  name="Fill"
                  checked={Fill[0] ?? false}
                  onChange={(e) => setFill([e.target.checked, Fill[1]])}
                />
              </div>
              <div className="w-full sm:w-1/2 border flex items-center justify-between border-gray-300 rounded-md p-2">
                <label className="text-base md:text-lg font-semibold" htmlFor="FillColor">Fill Color</label>
                <input
                  type="color"
                  name="FillColor"
                  value={Fill[1]}
                  onChange={(e) => setFill([Fill[0], String(e.target.value)])}
                />
              </div>
            </div>

            {/* Graph Background */}
            <div className="md:w-[350px] w-full border flex items-center justify-between border-gray-300 rounded-md p-2">
              <label className="text-base md:text-lg font-semibold" htmlFor="GraphColor">Graph Background</label>
              <input
                type="color"
                name="GraphColor"
                value={GraphColor}
                onChange={(e) => { setGraphColor(String(e.target.value)) }}
              />
            </div>

            {/* Point Radius */}
            <div className="md:w-[350px] w-full border flex items-center justify-between border-gray-300 rounded-md p-2">
              <label className="text-base md:text-lg font-semibold" htmlFor="pointradius">Point Radius</label>
              <input
                name="pointradius"
                type="number"
                min="2"
                max="10"
                step="0.5"
                value={PointRadius}
                onChange={(e) => setPointRadius(parseFloat(e.target.value))}
                className="w-20 rounded-md focus:outline-none px-2 text-sm md:text-base"
              />
            </div>

            {/* Tension */}
            <div className="md:w-[350px] w-full border flex items-center justify-between border-gray-300 rounded-md p-2">
              <label className="text-base md:text-lg font-semibold" htmlFor="tension">Tension</label>
              <input
                name="tension"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={Tension}
                onChange={(e) => setTension(parseFloat(e.target.value))}
                className="w-20 rounded-md focus:outline-none px-2 text-sm md:text-base"
              />
            </div>

            {/* Bar Opacity Controls */}
            <div className=" flex flex-wrap items-center justify-center w-full gap-3">
              <div className="md:w-[350px] w-full border flex items-center justify-between border-gray-300 rounded-md p-2">
                <label className="text-base md:text-lg font-semibold" htmlFor="barOpacity">Bar Opacity</label>
                <input
                  name="barOpacity"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={BarOpacity}
                  onChange={(e) => setBarOpacity(parseFloat(e.target.value))}
                  className="w-20 rounded-md focus:outline-none px-2 text-sm md:text-base"
                />
              </div>
              <div className="md:w-[350px] w-full  border flex items-center justify-between border-gray-300 rounded-md p-2">
                <label className="text-base md:text-lg font-semibold" htmlFor="barHoverOpacity">Hover Opacity</label>
                <input
                  name="barHoverOpacity"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={BarHoverOpacity}
                  onChange={(e) => setBarHoverOpacity(parseFloat(e.target.value))}
                  className="w-20 rounded-md focus:outline-none px-2 text-sm md:text-base"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:w-[350px] w-full flex flex-wrap  justify-center items-center sm:flex-row gap-3 mt-2">
              <button
                onClick={addRow}
                className="w-full button flex gap-2 justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm md:text-base"
              >
                Add Row <Plus size={16} />
              </button>
              <button
                onClick={swapChartData}
                className="w-full button flex gap-2 justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm md:text-base"
              >
                Swap Data <ArrowLeftRightIcon size={16} />
              </button>
            </div>

            <div className="md:w-[350px] w-full flex flex-wrap justify-center items-center sm:flex-row gap-3">
              <button
                className="w-full button flex gap-2 justify-center items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition text-sm md:text-base"
              >
                Save <Bookmark size={16} />
              </button>
              <button
                onClick={downloadChart}
                className="w-full button flex gap-2 justify-center items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition text-sm md:text-base"
              >
                Download <Download size={16} />
              </button>
            </div>

            <div className="md:w-[350px] w-full flex justify-center">
              <ExcelReader onData={handleExcelData} />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="w-full flex justify-center items-center mt-6 md:mt-8">
        <div className="w-full md:w-[90%] mx-auto flex flex-col justify-center items-center gap-4">
          <h1 className="w-full md:w-[80%] text-xl underline underline-offset-2 text-center mx-auto font-bold">Chart Data</h1>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-5 bg-blue-600 text-center text-white font-bold rounded-t-md">
                <div className="border-r py-2 px-2 md:px-4 border-white">{ChartTitle ?? Headers[0]}</div>
                <input
                  type="text"
                  value={GraphHeaders[0] ?? Headers[2]}
                  onChange={(e) => setGraphHeaders([e.target.value, GraphHeaders[1]])}
                  className="border-r py-2 px-2 md:px-4 border-white text-center w-full focus:outline-none text-sm md:text-base"
                />
                <input
                  type="text"
                  value={GraphHeaders[1] ?? Headers[1]}
                  onChange={(e) => setGraphHeaders([GraphHeaders[0], e.target.value])}
                  className="border-r py-2 px-2 md:px-4 border-white text-center w-full focus:outline-none text-sm md:text-base"
                />
                <div className="border-r py-2 px-2 md:px-4 border-white">Bar Color</div>
                <div className="border-r py-2 px-2 md:px-4 border-white">Line Color</div>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" isDropDisabled={false}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {Data.map((item, index) => (
                        <Draggable key={index} draggableId={String(index)} index={index}>
                          {(provided) => (
                            <div
                              className="grid grid-cols-5 border-b border-gray-300 transition"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {/* Date */}
                              <div className="px-2 md:px-4 p-2 border-r hover:bg-gray-100">
                                <input
                                  type="text"
                                  className="text-center w-full focus:outline-none text-sm md:text-base"
                                  value={item[Headers[0]] ?? ""}
                                  onChange={(e) => {
                                    const updatedData = [...Data];
                                    updatedData[index][Headers[0]] = String(e.target.value);
                                    setData(updatedData);
                                  }}
                                />
                              </div>


                              {/* Bar Value */}
                              <div className="px-2 md:px-4 p-2 border-r hover:bg-gray-100">
                                <input
                                  type="number"
                                  className="text-center w-full focus:outline-none text-sm md:text-base"
                                  value={item[Headers[1]] ?? ""}
                                  onChange={(e) => {
                                    const updatedData = [...Data];
                                    updatedData[index][Headers[1]] = Number(e.target.value);
                                    setData(updatedData);
                                  }}
                                />
                              </div>
                              {/* Line Value */}
                              <div className="px-2 md:px-4 p-2 border-r hover:bg-gray-100">
                                <input
                                  type="number"
                                  className="text-center w-full focus:outline-none text-sm md:text-base"
                                  value={item[Headers[2]] ?? ""}
                                  onChange={(e) => {
                                    const updatedData = [...Data];
                                    updatedData[index][Headers[2]] = Number(e.target.value);
                                    setData(updatedData);
                                  }}
                                />
                              </div>

                              {/* Bar Color with Delete */}
                              <div className="px-2 md:px-4 p-2 border-r hover:bg-gray-100 flex justify-center items-center gap-2">
                                <input
                                  type="color"
                                  className="text-center w-8 h-8 focus:outline-none"
                                  value={item[Headers[3]]}
                                  onChange={(e) => {
                                    const updatedData = [...Data];
                                    updatedData[index][Headers[3]] = String(e.target.value);
                                    setData(updatedData);

                                    const updatedColors = [...BarColors];
                                    updatedColors[index] = String(e.target.value);
                                    setBarColors(updatedColors);
                                  }}
                                />
                              </div>
                              {/* Line Color */}
                              <div className="px-2 md:px-4 p-2 relative  hover:bg-gray-100 flex justify-center items-center">
                                <input
                                  type="color"
                                  className="text-center w-8 h-8 focus:outline-none"
                                  value={item[Headers[4]]}
                                  onChange={(e) => {
                                    const updatedData = [...Data];
                                    updatedData[index][Headers[4]] = String(e.target.value);
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
        </div>
      </div>
    </div>
  );
};

export default MixedChart;