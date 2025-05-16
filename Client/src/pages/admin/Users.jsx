import { Button, TextInput, Table, Badge, ActionIcon, Checkbox, SegmentedControl } from '@mantine/core';
import { Search, UserPlus, Eye, PenSquare, MoreVertical, Filter } from 'lucide-react';

const Users = () => {
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      joinDate: '2023-07-15',
      lastActive: '2023-07-20',
      storage: '12.5 MB',
      storagePercentage: 25
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'ACTIVE',
      joinedDate: '2024-01-16',
      storage: '36.5 MB',
      storagePercentage: 66
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'User',
      status: 'INACTIVE',
      joinedDate: '2024-01-17',
      storage: '12.5 MB',
      storagePercentage: 25
    }
  ];

  return (
    <main>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button leftSection={<UserPlus size={16} />}>
          Add User
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <TextInput
            placeholder="Search users..."
            leftSection={<Search size={16} />}
            className="flex-1"
          />
          <Button variant="outline" leftSection={<Filter size={16} />}>
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <SegmentedControl
            data={[
              { label: 'All Users', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Suspended', value: 'suspended' },
              { label: 'Pending', value: 'pending' },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <Table.Thead>
              <Table.Tr>
                <Table.Th><Checkbox /></Table.Th>
                <Table.Th>User</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Join Date</Table.Th>
                <Table.Th>Last Active</Table.Th>
                <Table.Th>Storage</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td><Checkbox /></Table.Td>
                  <Table.Td>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                    variant="dot"
                      color={user.role === 'ADMIN' ? '#0f4736' : 'blue'}
                    >
                      {user.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                    variant="dot" 
                      color={
                        user.status === 'ACTIVE' ? 'green' :
                        user.status === 'INACTIVE' ? 'gray' :
                        user.status === 'SUSPENDED' ? 'red' :
                        'yellow'
                      }
                    >
                      {user.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{user.joinDate}</Table.Td>
                  <Table.Td>{user.lastActive}</Table.Td>
                  <Table.Td>
                    <div className="space-y-1">
                      <div className="text-sm">{user.storage}</div>
                      <div className="h-1.5 w-24 bg-gray-200 rounded-full">
                        <div 
                          className="h-1.5 bg-[#0f4736] rounded-full" 
                          style={{ width: `${user.storagePercentage}%` }}
                        />
                      </div>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex gap-1">
                      <ActionIcon variant="light" color="blue">
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="yellow">
                        <PenSquare size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light">
                        <MoreVertical size={16} />
                      </ActionIcon>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 order-2 sm:order-1">Page 1 of 5</div>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button variant="subtle" size="sm">Previous</Button>
            <Button variant="subtle" size="sm">1</Button>
            <Button variant="subtle" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Users;