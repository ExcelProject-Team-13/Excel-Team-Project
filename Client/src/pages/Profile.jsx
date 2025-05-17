import { Avatar, Button, TextInput, Paper, Tabs } from '@mantine/core';
import { FileUp, ChartBar, Mail, User, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <main className="p-4 sm:p-6 md:p-8">
      {/* Back Button */}
      <Button
        variant="transparent"
        leftSection={<ArrowLeft size={16} />}
        onClick={() => navigate('/dashboard')}
        className="mb-6"
      >
        Back to Dashboard
      </Button>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8">
        <Avatar 
          size={120} 
          radius="md"
          src="https://avatars.githubusercontent.com/u/123456789"
          className="border-4 border-[#b0eacd]"
        />
        
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">John Doe</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-gray-600 mb-4">
            <div className="flex items-center justify-center sm:justify-start gap-1">
              <Mail size={16} />
              <span>john@example.com</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1">
              <Calendar size={16} />
              <span>Joined January 2024</span>
            </div>
          </div>
          <Button variant="light">Edit Profile</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Paper shadow="sm" p="md" className="text-center">
          <FileUp size={24} className="mx-auto mb-2 text-[#0f4736]" />
          <div className="text-2xl font-bold mb-1">24</div>
          <div className="text-gray-600">Files Uploaded</div>
        </Paper>
        <Paper shadow="sm" p="md" className="text-center">
          <ChartBar size={24} className="mx-auto mb-2 text-[#0f4736]" />
          <div className="text-2xl font-bold mb-1">18</div>
          <div className="text-gray-600">Analyses Created</div>
        </Paper>
        <Paper shadow="sm" p="md" className="text-center">
          <User size={24} className="mx-auto mb-2 text-[#0f4736]" />
          <div className="text-2xl font-bold mb-1">5</div>
          <div className="text-gray-600">Shared Projects</div>
        </Paper>
      </div>

      {/* Profile Details */}
      <Tabs defaultValue="details">
        <Tabs.List>
          <Tabs.Tab value="details">Profile Details</Tabs.Tab>
          <Tabs.Tab value="activity">Recent Activity</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <TextInput
                label="Full Name"
                value="John Doe"
                readOnly
              />
              <TextInput
                label="Email"
                value="john@example.com"
                readOnly
              />
              <TextInput
                label="Organization"
                value="Excel Analytics Inc."
                readOnly
              />
            </div>
            <div className="space-y-4">
              <TextInput
                label="Role"
                value="Data Analyst"
                readOnly
              />
              <TextInput
                label="Location"
                value="New York, USA"
                readOnly
              />
              <TextInput
                label="Time Zone"
                value="EST (UTC-5)"
                readOnly
              />
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="activity" className="mt-6">
          <div className="space-y-4">
            {[
              {
                action: "Uploaded sales report",
                time: "2 hours ago",
                icon: <FileUp size={16} />
              },
              {
                action: "Created revenue analysis",
                time: "5 hours ago",
                icon: <ChartBar size={16} />
              },
              {
                action: "Updated profile information",
                time: "1 day ago",
                icon: <User size={16} />
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="bg-[#e6f0ed] p-2 rounded-lg">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Tabs.Panel>
      </Tabs>
    </main>
  );
};

export default Profile;