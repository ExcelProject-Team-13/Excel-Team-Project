import React from 'react'
import { Avatar, Badge, Button } from '@mantine/core';
import { FileUp, History, Settings, FileText, ChartBar, BrainCircuit, Database, MoveRight, Clock, Eye, ChartColumnBig, Download, Trash, Pencil } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: "Total Uploads",
      value: "24",
      change: "+12%",
      icon: <FileText color="#0f4736" size={24} />
    },
    {
      title: "Charts Created",
      value: "42",
      change: "+18%",
      icon: <ChartBar color="#0f4736" size={24} />
    },
    {
      title: "AI Insights",
      value: "15",
      change: "+24%",
      icon: <BrainCircuit color="#0f4736" size={24} />
    },
    {
      title: "Storage Used",
      value: "45%",
      mb: "22.5",
      icon: <Database color="#0f4736" size={24} />
    }
  ];

  return (
    <main>
      <h1 className='font-bold text-2xl sm:text-3xl mb-6 sm:mb-8'>Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">{stat.title}</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</h3>
                {stat.change && (
                  <p className="mt-1 sm:mt-2">
                    <span className="text-[#0f4736] font-semibold text-sm sm:text-base">{stat.change}</span>
                    <span className="text-gray-500 text-xs sm:text-sm"> from last month</span>
                  </p>
                )}
                {stat.mb && (
                  <p className="text-gray-500 font-semibold text-xs sm:text-sm mt-1 sm:mt-2">{stat.mb} MB of 50 MB</p>
                )}
              </div>
              <div className="bg-[#b0eacd] p-2 sm:p-3 rounded-lg">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button size="sm" sm:size="md" leftSection={<FileUp size={18} sm:size={20} />}>
            Upload New File
          </Button>

          <Button
            size="sm" sm:size="md"
            variant="light"
            leftSection={<History size={18} sm:size={20} />}
          >
            View History
          </Button>

          <Button
            size="sm" sm:size="md"
            variant="outline"
            leftSection={<Settings size={18} sm:size={20} />}
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm mt-6 sm:mt-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Recent Uploads</h2>
          <Button size="sm" sm:size="md" variant="transparent" rightSection={<MoveRight size={18} sm:size={20} />}>
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[
            {
              name: "Q2_Sales_Report.xlsx",
              size: "1.2 MB",
              analyses: "3 ANALYSES",
              date: "2023-07-15",
              starred: true
            },
            {
              name: "Marketing_Campaign_Results.xlsx",
              size: "2.8 MB",
              analyses: "5 ANALYSES",
              date: "2023-07-10",
              starred: false
            },
            {
              name: "Customer_Feedback_Survey.xlsx",
              size: "0.9 MB",
              analyses: "2 ANALYSES",
              date: "2023-07-05",
              starred: true
            },
            {
              name: "Inventory_Status_July.xlsx",
              size: "3.4 MB",
              analyses: "1 ANALYSES",
              date: "2023-07-01",
              starred: false
            }
          ].map((file) => (
            <div key={file.name} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">{file.name}</h3>

              <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                <Badge size="sm" sm:size="md" color="gray">{file.size}</Badge>
                <Badge size="sm" sm:size="md" color="blue">{file.analyses}</Badge>
                <span className='flex items-center gap-1 text-xs'><Clock size={12} sm:size={13} /> {file.date}</span>
              </div>

              <div className="flex gap-1.5 sm:gap-2">
                <Avatar color="blue" radius="sm">
                  <Eye size={20} />
                </Avatar>

                <Avatar color='green' radius="sm">
                  <ChartColumnBig size={20} />
                </Avatar>

                <Avatar color='gray' radius="sm">
                  <Download size={20} />
                </Avatar>

                <Avatar color='red' radius="sm">
                  <Trash size={20} />
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm mt-6 sm:mt-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Recent Analyses</h2>
          <Button size="sm" sm:size="md" variant="transparent" rightSection={<MoveRight size={18} sm:size={20} />}>
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[
            {
              title: "Q2 Sales by Region",
              type: "Bar Chart",
              date: "2023-07-15",
              icon: <ChartBar size={24} color='blue' />
            },
            {
              title: "Marketing Campaign ROI",
              type: "Pie Chart",
              date: "2023-07-12",
              icon: <ChartColumnBig size={24} color='green' />
            },
            {
              title: "Customer Satisfaction Trends",
              type: "Line Chart",
              date: "2023-07-08",
              icon: <ChartBar size={24} color='purple' />
            },
            {
              title: "Product Performance Comparison",
              type: "Scatter Plot",
              date: "2023-07-03",
              icon: <ChartColumnBig size={24} color='orange' />
            }
          ].map((analysis) => (
            <div key={analysis.title} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <Avatar size="sm" sm:size="md" radius="sm" color='gray'>
                  {analysis.icon}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">{analysis.title}</h3>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                    <span>{analysis.type}</span>
                    <span className='flex items-center gap-1'>
                      <Clock size={12} sm:size={13} /> {analysis.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 h-24 sm:h-32 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm sm:text-base">Chart Preview</span>
              </div>

              <div className="flex gap-1.5 sm:gap-2">
                <Avatar color="blue" radius="sm">
                  <Eye size={20} />
                </Avatar>
                <Avatar color="orange" radius="sm">
                  <Pencil size={20} />
                </Avatar>
                <Avatar color="gray" radius="sm">
                  <Download size={20} />
                </Avatar>
                <Avatar color="red" radius="sm">
                  <Trash size={20} />
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;