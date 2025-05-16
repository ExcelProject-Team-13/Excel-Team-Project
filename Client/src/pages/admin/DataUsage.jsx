import { Paper, Text, SegmentedControl, Button, Table } from '@mantine/core';
import { FileSpreadsheet, ChartBar, Database, Settings, TrendingUp } from 'lucide-react';

const DataUsage = () => {
  const userStorageData = [
    { user: 'David Wilson', email: 'david.w@example.com', storage: '32.8 MB', limit: '50 MB', usage: 65 },
    { user: 'Robert Garcia', email: 'robert.g@example.com', storage: '22.5 MB', limit: '50 MB', usage: 45 },
    { user: 'Michael Chen', email: 'm.chen@example.com', storage: '18.7 MB', limit: '50 MB', usage: 37 },
    { user: 'Jennifer Lee', email: 'jennifer.l@example.com', storage: '15.3 MB', limit: '50 MB', usage: 30 },
    { user: 'John Smith', email: 'john.s@example.com', storage: '12.5 MB', limit: '50 MB', usage: 25 },
    { user: 'Thomas Brown', email: 'thomas.b@example.com', storage: '9.8 MB', limit: '50 MB', usage: 19 },
    { user: 'Sarah Johnson', email: 'sarah.j@example.com', storage: '8.2 MB', limit: '50 MB', usage: 16 },
    { user: 'Emma Rodriguez', email: 'emma.r@example.com', storage: '5.1 MB', limit: '50 MB', usage: 10 },
    { user: 'Lisa Thompson', email: 'lisa.t@example.com', storage: '4.2 MB', limit: '50 MB', usage: 8 },
    { user: 'Maria Martinez', email: 'maria.m@example.com', storage: '0 MB', limit: '50 MB', usage: 0 }
  ];

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Usage</h1>
        <SegmentedControl
          data={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' }
          ]}
          defaultValue="month"
        />
      </div>

      {/* System Storage Overview */}
      <Paper shadow="sm" p="md">
        <h2 className="text-lg font-bold mb-4">System Storage Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storage Ring */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-32 h-32 -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e6e6e6" strokeWidth="16" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#0f4736"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 * (1 - 0.43)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">43%</span>
              </div>
            </div>
            <div>
              <Text fw={500}>Total Storage</Text>
              <Text size="sm" c="dimmed">215 GB / 500 GB</Text>
              <Text size="sm" c="dimmed">Healthy usage</Text>
            </div>
          </div>

          {/* Storage by Type */}
          <div>
            <Text fw={500} mb="xs">Storage by Type</Text>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <Text size="sm">Excel Files</Text>
                  <Text size="sm">65%</Text>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[#0f4736] rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Text size="sm">Generated Charts</Text>
                  <Text size="sm">25%</Text>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[#0f4736] rounded-full opacity-75" style={{ width: '25%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Text size="sm">System & Other</Text>
                  <Text size="sm">10%</Text>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[#0f4736] rounded-full opacity-50" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Usage Trends */}
          <div>
            <Text fw={500} mb="xs">Usage Trends</Text>
            <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
              <TrendingUp color="#0f4736" />
              <Text size="sm" ml="xs">Storage Usage Trend</Text>
            </div>
            <Text size="sm" c="green" mt="xs">+2.5% per month</Text>
          </div>
        </div>
      </Paper>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Paper shadow="sm" p="md">
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet color="#0f4736" />
            <Text fw={500}>File Upload Statistics</Text>
          </div>
          <div className="flex items-center gap-8 mb-4">
            <div>
              <Text size="xl" fw={700}>1254</Text>
              <Text size="sm" c="dimmed">Total Excel files uploaded</Text>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 h-32 mb-4">
            {/* Upload Frequency Chart Placeholder */}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <Text c="dimmed">Average File Size</Text>
              <Text fw={500}>5.8 MB</Text>
            </div>
            <div>
              <Text c="dimmed">Uploads This month</Text>
              <Text fw={500}>124</Text>
            </div>
            <div>
              <Text c="dimmed">Growth</Text>
              <Text fw={500} color="green">+12.5%</Text>
            </div>
          </div>
        </Paper>

        <Paper shadow="sm" p="md">
          <div className="flex items-center gap-2 mb-4">
            <ChartBar color="#0f4736" />
            <Text fw={500}>Analysis Statistics</Text>
          </div>
          <div className="flex items-center gap-8 mb-4">
            <div>
              <Text size="xl" fw={700}>2876</Text>
              <Text size="sm" c="dimmed">Total Charts generated</Text>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 h-32 mb-4">
            {/* Chart Types Distribution Placeholder */}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <Text c="dimmed">Most Popular</Text>
              <Text fw={500}>Bar Charts</Text>
            </div>
            <div>
              <Text c="dimmed">Analysis This month</Text>
              <Text fw={500}>267</Text>
            </div>
            <div>
              <Text c="dimmed">Growth</Text>
              <Text fw={500} color="green">+8.3%</Text>
            </div>
          </div>
        </Paper>
      </div>

      {/* User Storage Usage */}
      <Paper shadow="sm" p="md">
        <div className="flex justify-between items-center mb-4">
          <Text fw={500}>User Storage Usage</Text>
          <Button variant="light">Export Report</Button>
        </div>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Storage Used</Table.Th>
              <Table.Th>Storage Limit</Table.Th>
              <Table.Th>Usage</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {userStorageData.map((user, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{user.user}</Text>
                    <Text size="sm" c="dimmed">{user.email}</Text>
                  </div>
                </Table.Td>
                <Table.Td>{user.storage}</Table.Td>
                <Table.Td>{user.limit}</Table.Td>
                <Table.Td>
                  <div className="space-y-1">
                    <Text size="sm">{user.usage}%</Text>
                    <div className="h-2 bg-gray-100 rounded-full w-32">
                      <div
                        className="h-2 bg-[#0f4736] rounded-full"
                        style={{ width: `${user.usage}%` }}
                      />
                    </div>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </main>
  );
};

export default DataUsage;