import { Button, Divider, FileInput, Tabs, Select, TextInput, ColorInput, Switch } from '@mantine/core';
import { ChartBar, Check, Clock, FileUp, LineChart, PieChart, Scale3d, ScatterChart } from 'lucide-react';
import { useState } from 'react'

const Upload = () => {

  const [activeTab, setActiveTab] = useState('upload');

  return (
    <main>
      <h1 className='font-bold text-2xl sm:text-3xl mb-4 sm:mb-6'>Upload & Analyze</h1>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List className="overflow-x-auto">
          <Tabs.Tab value="upload" leftSection={<FileUp size={14} sm:size={16} />}>
            Upload File
          </Tabs.Tab>
          <Tabs.Tab value="configure" leftSection={<ChartBar size={14} sm:size={16} />}>
            Configure Analysis
          </Tabs.Tab>
          <Tabs.Tab value="results" leftSection={<Clock size={14} sm:size={16} />}>
            View Results
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Upload Section */}
      {activeTab === 'upload' &&
        <div className='mt-6 sm:mt-8 border rounded-lg border-gray-300 p-4 sm:p-6 md:p-10'>
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="p-4 sm:p-5 size-16 sm:size-22 bg-[#b0eacd] rounded-lg mb-4 sm:mb-5 flex justify-center items-center">
              <FileUp size={24} sm:size={32} color="#0f4736" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Upload Excel File</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-xl text-center px-2">
              Upload your Excel file (.xls or .xlsx) to analyze and visualize your data
              with interactive charts
            </p>
          </div>

          <FileInput
            size='md' sm:size='lg'
            rightSection={<FileUp size={16} sm:size={20} />}
            placeholder="Click to select or drop Excel file"
            rightSectionPointerEvents="none"
            mt="md"
            className="max-w-full"
          />

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mt-4 sm:mt-6">
            <Button
              size="sm"
              className="sm:w-auto w-full"
            >
              Upload & Process File
            </Button>
            <Button
              variant="light"
              size="sm"
              className="sm:w-auto w-full"
            >
              Clear
            </Button>
          </div>

          <Divider my="md" sm:my="lg" label="Supported Features" labelPosition="center" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {[
              {
                title: "Excel Formats",
                description: ".xlsx, .xls files supported",
                icon: <Check color='green' size={18} sm:size={20} />
              },
              {
                title: "Large Files",
                description: "Up to 50MB file size",
                icon: <Check color='green' size={18} sm:size={20} />
              },
              {
                title: "Multiple Sheets",
                description: "Analyze data from any sheet",
                icon: <Check color='green' size={18} sm:size={20} />
              }
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                <div className="bg-[#b0eacd] p-1.5 sm:p-2 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">{feature.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>}

      {/* Configure Section */}
      {activeTab === 'configure' &&
        <div className='mt-6 sm:mt-8 border rounded-lg border-gray-300 p-4 sm:p-6 md:p-10'>
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="p-4 sm:p-5 size-16 sm:size-22 bg-[#b0eacd] rounded-lg mb-4 sm:mb-5 flex justify-center items-center">
              <ChartBar size={24} sm:size={32} color="#0f4736" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Configure Your Analysis</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-xl text-center px-2">
              Select the type of analysis and customize chart options to visualize your data
            </p>
          </div>

          <div className="space-y-6">
            {/* Chart Type Selection */}
            <div>
              <h3 className="font-semibold mb-3">Select Chart Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { name: 'Bar Chart', icon: <ChartBar size={20} /> },
                  { name: 'Line Chart', icon: <LineChart size={20} /> },
                  { name: 'Pie Chart', icon: <PieChart size={20} /> },
                  { name: 'Scatter Plot', icon: <ScatterChart size={20} /> },
                  { name: '3D Chart', icon: <Scale3d size={20} /> }
                ].map((chart) => (
                  <Button
                    key={chart.name}
                    variant="light"
                    leftSection={chart.icon}
                    className="justify-start"
                  >
                    {chart.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Data Selection */}
            <div>
              <h3 className="font-semibold mb-3">Select Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Sheet"
                  placeholder="Choose sheet"
                  data={['Sheet1', 'Sheet2', 'Sheet3']}
                />
                <Select
                  label="Data Range"
                  placeholder="Select range"
                  data={['A1:D10', 'E1:H15', 'Custom']}
                />
                <Select
                  label="X-Axis"
                  placeholder="Select column for X-axis"
                  data={['Column A', 'Column B', 'Column C']}
                />
                <Select
                  label="Y-Axis"
                  placeholder="Select column for Y-axis"
                  data={['Column A', 'Column B', 'Column C']}
                />
              </div>
            </div>

            {/* Chart Options */}
            <div>
              <h3 className="font-semibold mb-3">Chart Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Chart Title"
                  placeholder="Enter chart title"
                />
                <ColorInput
                  label="Chart Color"
                  placeholder="Pick color"
                />
                <Switch label="Show Legend" defaultChecked />
                <Switch label="Show Grid Lines" defaultChecked />
              </div>
            </div>

            {/* Preview & Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-gray-50 h-64 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-gray-400">Chart Preview</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="light">Reset</Button>
                <Button>Generate Chart</Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Results Section */}
      {activeTab === 'results' &&
        <div className='mt-6 sm:mt-8 border rounded-lg border-gray-300 p-4 sm:p-6 md:p-10'>
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="p-4 sm:p-5 size-16 sm:size-22 bg-[#b0eacd] rounded-lg mb-4 sm:mb-5 flex justify-center items-center">
              <Clock size={24} color="#0f4736" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Analysis Results</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-xl text-center px-2">
              View and interact with your generated charts and insights
            </p>
          </div>

          <div className="space-y-6">
            {/* Generated Charts */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Generated Charts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="bg-gray-50 h-48 sm:h-64 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
                    <span className="text-gray-400 text-sm sm:text-base">Chart 1</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center">
                    <h4 className="font-semibold text-sm sm:text-base">Sales Distribution</h4>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="light" size="xs" sm:size="sm" className="flex-1 sm:flex-initial">Edit</Button>
                      <Button variant="light" size="xs" sm:size="sm" className="flex-1 sm:flex-initial">Download</Button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="bg-gray-50 h-48 sm:h-64 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
                    <span className="text-gray-400 text-sm sm:text-base">Chart 2</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center">
                    <h4 className="font-semibold text-sm sm:text-base">Revenue Trends</h4>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="light" size="xs" sm:size="sm" className="flex-1 sm:flex-initial">Edit</Button>
                      <Button variant="light" size="xs" sm:size="sm" className="flex-1 sm:flex-initial">Download</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Key Insights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-sm sm:text-base mb-2">Trend Analysis</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Sales show a positive trend with 15% growth in Q2 compared to Q1.</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-sm sm:text-base mb-2">Distribution Pattern</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Product A accounts for 45% of total sales across all regions.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end pt-4 sm:pt-6 border-t border-gray-200">
              <Button variant="light" size="sm" className="w-full sm:w-auto">Export Report</Button>
              <Button size="sm" className="w-full sm:w-auto">Share Results</Button>
            </div>
          </div>
        </div>
      }

    </main>
  )
}

export default Upload
