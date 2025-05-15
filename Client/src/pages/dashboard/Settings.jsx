import { Button, Switch, TextInput, Select, Divider } from '@mantine/core';
import { Bell, User, Shield, Palette } from 'lucide-react';

const Settings = () => {
  return (
    <main>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Settings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User size={20} />
            <h2 className="text-lg sm:text-xl font-semibold">Profile Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Display Name"
              placeholder="Enter your name"
            />
            <TextInput
              label="Email"
              placeholder="Enter your email"
              type="email"
            />
          </div>
        </div>

        <Divider />

        {/* Appearance */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette size={20} />
            <h2 className="text-lg sm:text-xl font-semibold">Appearance</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Select
              label="Chart Style"
              placeholder="Choose default chart style"
              data={['Modern', 'Classic', 'Minimal']}
            />
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-600">Enable dark theme</p>
              </div>
              <Switch size="md" />
            </div>
          </div>
        </div>

        <Divider />

        {/* Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} />
            <h2 className="text-lg sm:text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive analysis completion emails</p>
              </div>
              <Switch size="md" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Processing Updates</h3>
                <p className="text-sm text-gray-600">Get notified about processing status</p>
              </div>
              <Switch size="md" />
            </div>
          </div>
        </div>

        <Divider />

        {/* Data & Privacy */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} />
            <h2 className="text-lg sm:text-xl font-semibold">Data & Privacy</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Data Collection</h3>
                <p className="text-sm text-gray-600">Allow anonymous usage data collection</p>
              </div>
              <Switch size="md" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Auto-Save</h3>
                <p className="text-sm text-gray-600">Automatically save analysis results</p>
              </div>
              <Switch size="md" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="sm:w-auto w-full">Save Changes</Button>
          <Button variant="light" className="sm:w-auto w-full">Reset to Default</Button>
        </div>
      </div>
    </main>
  );
};

export default Settings;