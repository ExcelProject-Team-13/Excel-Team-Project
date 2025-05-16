import { Button, Tabs, TextInput } from '@mantine/core';
import { ChartBar, Clock, FileUp, Search, Filter, SortAsc } from 'lucide-react';

const History = () => {
  return (
    <main>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">History</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <TextInput
            placeholder="Search history..."
            leftSection={<Search size={16} />}
            className="flex-1 sm:w-64"
          />
          <div className="flex gap-2">
            <Button variant="light" leftSection={<Filter size={16} />}>
              Filter
            </Button>
            <Button variant="light" leftSection={<SortAsc size={16} />}>
              Sort
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">All Activities</Tabs.Tab>
          <Tabs.Tab value="uploads" leftSection={<FileUp size={16} />}>
            Uploads
          </Tabs.Tab>
          <Tabs.Tab value="analyses" leftSection={<ChartBar size={16} />}>
            Analyses
          </Tabs.Tab>
        </Tabs.List>

        <div className="mt-6">
          <Tabs.Panel value="all">
            {/* Existing Activity Timeline */}
            <div className="space-y-4">
              {[
                {
                  type: 'upload',
                  title: 'Sales_Report_Q2.xlsx',
                  date: '2 hours ago',
                  size: '1.2 MB',
                  icon: <FileUp size={20} />
                },
                {
                  type: 'analysis',
                  title: 'Revenue Analysis',
                  date: '5 hours ago',
                  chartType: 'Bar Chart',
                  icon: <ChartBar size={20} />
                },
                {
                  type: 'upload',
                  title: 'Marketing_Data.xlsx',
                  date: '1 day ago',
                  size: '2.8 MB',
                  icon: <FileUp size={20} />
                },
                {
                  type: 'analysis',
                  title: 'Customer Trends',
                  date: '2 days ago',
                  chartType: 'Line Chart',
                  icon: <ChartBar size={20} />
                }
              ].map((activity, index) => (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-[#e6f0ed] p-2 rounded-lg">
                    {activity.icon}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                      <h3 className="font-semibold text-sm sm:text-base">{activity.title}</h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <Clock size={12} sm:size={14} />
                        <span>{activity.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-0">
                      {activity.size && (
                        <span className="text-xs sm:text-sm text-gray-600">Size: {activity.size}</span>
                      )}
                      {activity.chartType && (
                        <span className="text-xs sm:text-sm text-gray-600">Type: {activity.chartType}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="light" size="xs" sm:size="sm" className="flex-1 sm:flex-initial">View</Button>
                    <Button variant="light" size="xs" sm:size="sm" color="red" className="flex-1 sm:flex-initial">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="uploads">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Sales_Report_Q2.xlsx',
                  date: '2 hours ago',
                  size: '1.2 MB',
                  sheets: 3,
                  status: 'Processed'
                },
                {
                  title: 'Marketing_Data.xlsx',
                  date: '1 day ago',
                  size: '2.8 MB',
                  sheets: 5,
                  status: 'Processing'
                },
                {
                  title: 'Inventory_List.xlsx',
                  date: '3 days ago',
                  size: '1.5 MB',
                  sheets: 2,
                  status: 'Failed'
                }
              ].map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#e6f0ed] p-2 rounded-lg">
                        <FileUp size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{file.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Clock size={12} />
                          <span>{file.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span>{file.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sheets:</span>
                      <span>{file.sheets}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`${
                        file.status === 'Processed' ? 'text-green-600' :
                        file.status === 'Processing' ? 'text-blue-600' :
                        'text-red-600'
                      }`}>{file.status}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="light" size="xs" fullWidth>Download</Button>
                    <Button variant="light" size="xs" color="red" fullWidth>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="analyses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Revenue Analysis',
                  date: '5 hours ago',
                  chartType: 'Bar Chart',
                  source: 'Sales_Report_Q2.xlsx',
                  insights: 'Showing 15% growth in Q2'
                },
                {
                  title: 'Customer Trends',
                  date: '2 days ago',
                  chartType: 'Line Chart',
                  source: 'Marketing_Data.xlsx',
                  insights: 'Customer satisfaction increased'
                },
                {
                  title: 'Product Performance',
                  date: '4 days ago',
                  chartType: 'Pie Chart',
                  source: 'Inventory_List.xlsx',
                  insights: 'Product A leads sales'
                }
              ].map((analysis, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-[#e6f0ed] p-2 rounded-lg">
                      <ChartBar size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{analysis.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock size={12} />
                        <span>{analysis.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 h-40 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Chart Preview</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Chart Type:</span>
                      <span>{analysis.chartType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Source:</span>
                      <span>{analysis.source}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Key Insight: </span>
                      <span>{analysis.insights}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="light" size="xs" fullWidth>View</Button>
                    <Button variant="light" size="xs" fullWidth>Edit</Button>
                    <Button variant="light" size="xs" color="red" fullWidth>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Panel>
        </div>
      </Tabs>
    </main>
  );
};

export default History;