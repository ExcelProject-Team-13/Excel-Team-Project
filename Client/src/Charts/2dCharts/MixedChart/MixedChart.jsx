"use client";
import React, { useRef, useState, useEffect } from "react";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Download, Bookmark, Plus, ArrowLeftRightIcon, Trash } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExcelReader from "@/app/Input/page";
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
  const [GraphHeaders, setGraphHeaders] = useState(["lineValue", "BarValue"]);
  const [ChartTitle, setChartTitle] = useState("Mixed Chart Example");
  const [PointRadius, setPointRadius] = useState(5);
  const [Tension, setTension] = useState(0.3);
  const [LineColor, setLineColor] = useState("#ff00ff");
  const [Fill, setFill] = useState([false, "#ffffff"]);
  const [GraphColor, setGraphColor] = useState("#fff")
  const [BarOpacity, setBarOpacity] = useState(0.4);
  const [BarHoverOpacity, setBarHoverOpacity] = useState(1);

  // Dummy data when original data is unavailable
  const dummyData = [
    { "Date": "2021-01-01", "LineValue": 65, "BarValue": 45, "LineColor": getRandomHexColor(), "BarColor": getRandomHexColor() },
    { "Date": "2021-02-01", "LineValue": 59, "BarValue": 48, "LineColor": getRandomHexColor(), "BarColor": getRandomHexColor() },
    { "Date": "2021-03-01", "LineValue": 80, "BarValue": 40, "LineColor": getRandomHexColor(), "BarColor": getRandomHexColor() },
    { "Date": "2021-04-01", "LineValue": 81, "BarValue": 65, "LineColor": getRandomHexColor(), "BarColor": getRandomHexColor() },
    { "Date": "2021-05-01", "LineValue": 56, "BarValue": 59, "LineColor": getRandomHexColor(), "BarColor": getRandomHexColor() },
    { "Date": "2021-06-01", "LineValue": 55, "BarValue": 80, "LineColor": getRandomHexColor(), "BarColor": getRandomHexColor() }
  ];

  // Setup initial data only once
  useEffect(() => {
    handleExcelData({ data: dummyData, headers: ["Date", "LineValue", "BarValue", "LineColor", "BarColor"] });
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
        label: GraphHeaders[0] ?? Headers[1],
        data: Data.map(item => item[Headers[1]]),
        pointBackgroundColor: Data.map(item => item[Headers[3]] || getRandomHexColor()),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: Data.map(item => item[Headers[3]] || getRandomHexColor()),
        tension: Tension,
        borderColor: LineColor,
        fill: Fill[0],
        backgroundColor: hexToRgba(Fill[1]).replace(/rgba\(([^)]+),[^)]+\)/, 'rgba($1,0.4)'),
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: GraphHeaders[1] ?? Headers[2],
        data: Data.map(item => item[Headers[2]]),
        backgroundColor: Data.map(item => hexToRgba(item[Headers[4]] || getRandomHexColor(), BarOpacity)),
        hoverBackgroundColor: Data.map(item => hexToRgba(item[Headers[4]] || getRandomHexColor(), BarHoverOpacity)),
        hoverBorderColor: Data.map(item => hexToRgba(item[Headers[4]] || getRandomHexColor())),
        yAxisID: 'y1',
      }
    ]
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
      title: {
        display: true,
        text: ChartTitle ?? "Mixed Chart Example",
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
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
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
          text: Headers[1]
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
          text: Headers[2]
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
      ctx.fillStyle = GraphColor ?? "#fff";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };


  const swapChartData = () => {
    setData(prevData => {
      // Create a deep copy of the data
      const newData = JSON.parse(JSON.stringify(prevData));

      // Swap the values between line and bar data columns
      return newData.map(item => {
        const temp = item[Headers[1]];
        item[Headers[1]] = item[Headers[2]];
        item[Headers[2]] = temp;
        return item;
      });
    });
  };

  const handleExcelData = ({ data, headers }) => {
    let dataSource = data && data.length > 0 ? data : dummyData;

    const coloredDataSource = dataSource.map((item) => {
      return {
        ...item,
        LineColor: item.LineColor || getRandomHexColor(),
        BarColor: item.BarColor || getRandomHexColor()
      };
    });

    let heads = (headers && headers.length > 0) ? headers : ["Date", "Value", "BarValue", "LineColor", "BarColor"];
    setData(coloredDataSource);
    setHeaders(heads);
    setChartTitle(heads[0])
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

  function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
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
    <div className="w-[100vw] overflow-x-hidden h-[100vh] p-6">
      <h1 className="text-3xl w-full text-center font-bold mb-5">MIXED CHART</h1>
      <div className="w-full flex justify-center gap-7 items-center h-[60%]">
        <div className="flex justify-center items-center w-[50%] h-[550px]">
          <div className="w-[750px] h-[550px]">
            <Chart
              ref={chartRef}
              className="rounded-[20px] shadow-[0px_0px_8px_0px_black]"
              type='bar'
              data={data}
              options={options}
              plugins={[customCanvasBackgroundColor]}
            />
          </div>
        </div>
        <div className="w-[50%] flex flex-col px-7 justify-center h-full items-center gap-3">
          <div className="flex w-[70%] justify-center flex-wrap items-center gap-4">
            <div className="flex justify-center items-center w-[220px] flex-wrap border gap-3 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="title">Title: </label>
              <input name="title" type="text" placeholder="Title"
                value={ChartTitle ?? "Mixed Chart Example"}
                className="w-[80px] focus:outline-none"
                onChange={(e) => setChartTitle(e.target.value)}
              />
            </div>

            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="LineColor">Line Color</label>
              <input type="color" name="LineColor"
                value={LineColor ?? "#0000ff"}
                onChange={(e) => setLineColor(String(e.target.value))}
              />
            </div>

            <div className="flex justify-center gap-4 items-center w-[220px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="Fill">Fill</label>
              <input type="checkbox" name="Fill"
                checked={Fill[0] ?? false}
                onChange={(e) => setFill([e.target.checked, Fill[1]])}
              />
            </div>

            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="FillColor">FillColor</label>
              <input type="color" name="FillColor"
                value={Fill[1]}
                onChange={(e) => setFill([Fill[0], String(e.target.value)])}
              />
            </div>
            <div className="flex justify-evenly items-center w-[452px] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="GraphColor">Graph BackGround</label>
              <input type="color" name="GraphColor"
                value={GraphColor}
                onChange={(e) => { setGraphColor(String(e.target.value)) }}
              />
            </div>

            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="pointradius">Point Radius</label>
              <input name="pointradius" placeholder="5" type="number" min="2" max="10" step="0.5"
                value={PointRadius}
                onChange={(e) => setPointRadius(parseFloat(e.target.value))}
                className="w-[40px] rounded-md focus:outline-none"
              />
            </div>

            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="tension">Tension</label>
              <input name="tension" placeholder="Tension" type="number" min="0" max="1" step="0.01"
                value={Tension}
                onChange={(e) => setTension(parseFloat(e.target.value))}
                className="w-[60px] rounded-md focus:outline-none"
              />
            </div>

            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="barOpacity">Bar Opacity</label>
              <input name="barOpacity" type="number" min="0" max="1" step="0.01"
                value={BarOpacity}
                onChange={(e) => setBarOpacity(parseFloat(e.target.value))}
                className="w-[60px] rounded-md focus:outline-none"
              />
            </div>

            <div className="flex justify-evenly items-center w-[220px] border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-[#144da8]">
              <label className="text-lg font-semibold" htmlFor="barHoverOpacity">Hover Opacity</label>
              <input name="barHoverOpacity" type="number" min="0" max="1" step="0.01"
                value={BarHoverOpacity}
                onChange={(e) => setBarHoverOpacity(parseFloat(e.target.value))}
                className="w-[60px] rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-4">
            <button onClick={addRow} className="button flex gap-2.5 text-md justify-center items-center" role="button">
              Add Row <Plus size={18} />
            </button>
            <button onClick={swapChartData} className="button flex gap-1 text-md justify-center items-center" role="button">
              Swap Data <ArrowLeftRightIcon size={18} />
            </button>
          </div>
          <div className="flex justify-center items-center gap-4">
            <button className="button flex gap-2.5 text-md justify-center items-center" role="button">
              Save <Bookmark size={18} />
            </button>
            <button onClick={downloadChart} className="button flex gap-2.5 text-md justify-center items-center" role="button">
              Download <Download size={18} />
            </button>
          </div>

          <div className="flex justify-center gap-4 items-center">
            <ExcelReader onData={handleExcelData} />

          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-8">
        <div className="w-[90%] mx-auto flex flex-col justify-center items-center gap-4">
          <h1 className="w-[80%] text-xl underline underline-offset-2 mx-auto font-bold">Chart Data</h1>
          <div className="w-full block mt-6 overflow-x-auto">
            <div className="grid grid-cols-5 bg-[#144da8] text-center text-white font-bold  rounded-t-md">
              <div className="border-r py-2 px-4 border-white">{ChartTitle ?? Headers[0]}</div>
              <input type="text" name="" id=""
                value={GraphHeaders[0] ?? Headers[1]}
                onChange={(e) => {
                  setGraphHeaders([e.target.value, GraphHeaders[1]])
                }}
                className="border-r py-2 px-4 border-white text-center w-full focus:outline-none"
              />
              <input type="text" name="" id=""
                value={GraphHeaders[1] ?? Headers[2]}
                onChange={(e) => {
                  setGraphHeaders([GraphHeaders[0], e.target.value])
                }}
                className="border-r py-2 px-4 border-white text-center w-full focus:outline-none"
              />
              <div className="border-r py-2 px-4 border-white ">Line Color</div>
              <div className="border-r py-2 px-4 border-white ">Bar Color</div>
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
                            <div className="px-4 p-2  border-r hover:bg-gray-100">
                              <input
                                type="text"
                                className="text-center w-full focus:outline-none"
                                value={item[Headers[0]] ?? ""}
                                onChange={(e) => {
                                  const updatedData = [...Data];
                                  updatedData[index][Headers[0]] = String(e.target.value);
                                  setData(updatedData);
                                }}
                              />
                            </div>

                            <div className="px-4 flex  border-r justify-between items-center gap-2 p-2 hover:bg-gray-100">
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

                            <div className="px-4 flex  border-r justify-between items-center gap-2 p-2 hover:bg-gray-100">
                              <input
                                type="number"
                                className="text-center w-full focus:outline-none"
                                value={item[Headers[2]] ?? ""}
                                onChange={(e) => {
                                  const updatedData = [...Data];
                                  updatedData[index][Headers[2]] = Number(e.target.value);
                                  setData(updatedData);
                                }}
                              />
                            </div>

                            <div className="px-4 row flex border-r justify-center items-center gap-2 p-2 hover:bg-gray-100">
                              <input
                                type="color"
                                className="text-center w-[40%] focus:outline-none"
                                value={item[Headers[3]] || getRandomHexColor()}
                                onChange={(e) => {
                                  const updatedData = [...Data];
                                  updatedData[index][Headers[3]] = String(e.target.value);
                                  setData(updatedData);
                                }}
                              />
                            </div>

                            <div className="px-4  relative flex justify-center items-center gap-2 p-2 hover:bg-gray-100">
                              <input
                                type="color"
                                className="text-center w-[40%] focus:outline-none"
                                value={item[Headers[4]] || getRandomHexColor()}
                                onChange={(e) => {
                                  const updatedData = [...Data];
                                  updatedData[index][Headers[4]] = String(e.target.value);
                                  setData(updatedData);
                                }}
                              />
                              <Trash className="absolute right-6 trash-icon" onClick={() => deleteRow(index)} />
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

export default MixedChart;