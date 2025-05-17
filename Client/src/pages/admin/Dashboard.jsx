import { Paper, Text, SegmentedControl, Button, Table, ActionIcon, RingProgress } from '@mantine/core';
import { Users, FileUp, ChartBar, Brain, Eye, UserX, Database, Settings, Cog, MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const navigate = useNavigate();

  return (
    <main className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <SegmentedControl
          data={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' },
          ]}
          defaultValue="week"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Paper shadow="sm" p="md" className="relative">
          <Text c="dimmed" size="sm">Total Users</Text>
          <Text size="xl" fw={700} className="mt-1">128</Text>
          <Text size="sm" c="dimmed"><span className="text-[#0f4736] font-semibold">+8% </span>from last week</Text>
          <div className="absolute top-4 right-4 bg-[#e6f0ed] p-2 rounded-lg">
            <Users size={20} color="#0f4736" />
          </div>
        </Paper>

        <Paper shadow="sm" p="md" className="relative">
          <Text c="dimmed" size="sm">Total Uploads</Text>
          <Text size="xl" fw={700} className="mt-1">1254</Text>
          <Text size="sm" c="dimmed"><span className="text-[#0f4736] font-semibold">+12% </span> from last week</Text>
          <div className="absolute top-4 right-4 bg-[#e6f0ed] p-2 rounded-lg">
            <FileUp size={20} color="#0f4736" />
          </div>
        </Paper>

        <Paper shadow="sm" p="md" className="relative">
          <Text c="dimmed" size="sm">Total Analyses</Text>
          <Text size="xl" fw={700} className="mt-1">2876</Text>
          <Text size="sm" c="dimmed"><span className="text-[#0f4736] font-semibold">+15% </span> from last week</Text>
          <div className="absolute top-4 right-4 bg-[#e6f0ed] p-2 rounded-lg">
            <ChartBar size={20} color="#0f4736" />
          </div>
        </Paper>

        <Paper shadow="sm" p="md" className="relative">
          <Text c="dimmed" size="sm">AI Requests</Text>
          <Text size="xl" fw={700} className="mt-1">845</Text>
          <Text size="sm" c="dimmed"><span className="text-red-600 font-semibold">-3% </span> from last week</Text>
          <div className="absolute top-4 right-4 bg-[#e6f0ed] p-2 rounded-lg">
            <Brain size={20} color="#0f4736" />
          </div>
        </Paper>
      </div>

      {/* System Storage */}
      <Paper shadow="sm" p="md">
        <h2 className="text-xl font-bold mb-6">System Storage</h2>
        <div className="flex gap-8">
          <div className="relative size-32">
            <RingProgress
             thickness={9}
             roundCaps
              sections={[{ value: 40, color: '#0f4736' }]}
              label={
                <Text fw={700} ta="center" size="xl">
                  40%
                </Text>
              }
            />
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <Text fw={500}>Storage Usage</Text>
              <Text size="sm" c="dimmed">215 GB used of 500 GB total</Text>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <Text size="sm">Excel Files</Text>
                  <Text size="sm">65%</Text>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[#0f4736] rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <Text size="sm">Generated Charts</Text>
                  <Text size="sm">25%</Text>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[#0f4736] opacity-75 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <Text size="sm">System & Other</Text>
                  <Text size="sm">10%</Text>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[#0f4736] opacity-50 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Paper>

      {/* Activity and Feature Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <Paper shadow="sm" p="md">
          <h2 className="text-xl font-bold mb-4">User Activity</h2>
          <div className="bg-gray-50 h-40 rounded-lg mb-4">
            {/* Placeholder for User Activity Chart */}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Text size="sm" c="dimmed">Active Users</Text>
              <Text fw={500}>87 of 128 (68%)</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">Avg. Session</Text>
              <Text fw={500}>12 minutes</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">Retention</Text>
              <Text fw={500}>78%</Text>
            </div>
          </div>
        </Paper>

        <Paper shadow="sm" p="md">
          <h2 className="text-xl font-bold mb-4">Feature Usage</h2>
          <div className="bg-gray-50 h-40 rounded-lg mb-4">
            {/* Placeholder for Feature Usage Chart */}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Text size="sm" c="dimmed">2D Charts</Text>
              <Text fw={500}>64%</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">3D Charts</Text>
              <Text fw={500}>28%</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">AI Insights</Text>
              <Text fw={500}>8%</Text>
            </div>
          </div>
        </Paper>
      </div>

      {/* Recent Users */}
      <Paper shadow="sm" p="md" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Users</h2>
          <Button variant="transparent" rightSection={<MoveRight size={18} sm:size={20} />} size="sm">View All Users</Button>
        </div>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Join Date</Table.Th>
              <Table.Th>Uploads</Table.Th>
              <Table.Th>Analyses</Table.Th>
              <Table.Th>Storage Used</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[
              {
                name: 'John Smith',
                email: 'john.smith@example.com',
                joinDate: '2023-07-15',
                uploads: 12,
                analyses: 24,
                storage: '12.5 MB'
              },
              {
                name: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                joinDate: '2023-07-10',
                uploads: 8,
                analyses: 15,
                storage: '8.2 MB'
              },
              {
                name: 'Michael Chen',
                email: 'm.chen@example.com',
                joinDate: '2023-07-05',
                uploads: 15,
                analyses: 32,
                storage: '18.7 MB'
              },
              {
                name: 'Emma Rodriguez',
                email: 'emma.r@example.com',
                joinDate: '2023-07-01',
                uploads: 5,
                analyses: 10,
                storage: '5.1 MB'
              }
            ].map((user, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{user.name}</Text>
                    <Text size="sm" c="dimmed">{user.email}</Text>
                  </div>
                </Table.Td>
                <Table.Td>{user.joinDate}</Table.Td>
                <Table.Td>{user.uploads}</Table.Td>
                <Table.Td>{user.analyses}</Table.Td>
                <Table.Td>{user.storage}</Table.Td>
                <Table.Td>
                  <div className="flex gap-2">
                    <ActionIcon variant="light" color="blue">
                      <Eye size={16} />
                    </ActionIcon>
                    <ActionIcon variant="light" color="red">
                      <UserX size={16} />
                    </ActionIcon>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Admin Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
        leftSection={<Users size={16} />} 
        variant="filled"
        onClick={() => navigate('/admin/users')}
        >
          Manage Users
        </Button>
        <Button 
        leftSection={<Database size={16} />} 
        variant="light"
        onClick={() => navigate('/admin/data-usage')}
        >
          Data Usage
        </Button>
        <Button 
        leftSection={<Cog size={16} />} 
        variant="light"
        onClick={() => navigate('/admin/system-setting')}
        >
          System Settings
        </Button>
      </div>
    </main>
  );
};

export default Dashboard;