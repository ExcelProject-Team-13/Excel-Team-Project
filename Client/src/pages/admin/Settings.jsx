import { useState } from 'react';
import {
  Container,
  Title,
  Switch,
  NumberInput,
  Select,
  TextInput,
  Button,
  Divider,
  Text,
  Alert,
  Tabs,
  ColorInput,
} from '@mantine/core';
import { Save, Mail, Shield, Database, Palette, Clock } from 'lucide-react';

const Settings = () => {
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    // System Settings
    maintenanceMode: false,
    maxFileSize: 10,
    allowedFileTypes: ['.xlsx', '.xls'],
    maxConcurrentUsers: 100,
    
    // Email Settings
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    emailFrom: 'noreply@excelanalyzer.com',
    
    // Security Settings
    passwordMinLength: 8,
    requireSpecialChars: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Theme Settings
    primaryColor: '#0f4736',
    secondaryColor: '#b0eacd',
    darkMode: false,
  });

  const handleSave = () => {
    // Here you would typically save to your backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container size="xl" className="py-8">
      <div className="bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className='text-2xl md:text-3xl font-bold'>System Settings</h1>
          <Button
            leftSection={<Save size={16} />}
            onClick={handleSave}
            className="w-full sm:w-auto"
            size="md"
          >
            Save Changes
          </Button>
        </div>

        {saved && (
          <Alert className="mb-6" title="Success" color="teal">
            Settings have been saved successfully.
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm p-2">
          <Tabs defaultValue="system" className="overflow-x-auto">
            <Tabs.List className="flex-wrap border-b border-gray-200 mb-6">
              <Tabs.Tab value="system" leftSection={<Database size={16} />}>
                System
              </Tabs.Tab>
              <Tabs.Tab value="email" leftSection={<Mail size={16} />}>
                Email
              </Tabs.Tab>
              <Tabs.Tab value="security" leftSection={<Shield size={16} />}>
                Security
              </Tabs.Tab>
              <Tabs.Tab value="appearance" leftSection={<Palette size={16} />}>
                Appearance
              </Tabs.Tab>
            </Tabs.List>

            {/* Rest of your tabs content with added padding and better spacing */}
            <div className="p-4">
              <Tabs.Panel value="system">
                <div className="space-y-8 max-w-5xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Text fw={500} className="text-lg">Maintenance Mode</Text>
                      <Text size="sm" c="dimmed" className="max-w-md">
                        Enable this to put the system in maintenance mode
                      </Text>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.currentTarget.checked })}
                      size="md"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <NumberInput
                      label="Maximum File Size (MB)"
                      value={settings.maxFileSize}
                      onChange={(val) => setSettings({ ...settings, maxFileSize: val })}
                      min={1}
                      max={100}
                    />

                    <NumberInput
                      label="Maximum Concurrent Users"
                      value={settings.maxConcurrentUsers}
                      onChange={(val) => setSettings({ ...settings, maxConcurrentUsers: val })}
                      min={10}
                      max={1000}
                    />
                  </div>
                </div>
              </Tabs.Panel>

              {/* Similar changes for other panels */}
              <Tabs.Panel value="email">
                <div className="space-y-8 max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 gap-6">
                    <TextInput
                      label="SMTP Server"
                      value={settings.smtpServer}
                      onChange={(e) => setSettings({ ...settings, smtpServer: e.target.value })}
                    />

                    <NumberInput
                      label="SMTP Port"
                      value={settings.smtpPort}
                      onChange={(val) => setSettings({ ...settings, smtpPort: val })}
                    />
                  </div>

                  <TextInput
                    label="From Email Address"
                    value={settings.emailFrom}
                    onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="security">
                <div className="space-y-8 max-w-5xl mx-auto">
                  <NumberInput
                    label="Minimum Password Length"
                    value={settings.passwordMinLength}
                    onChange={(val) => setSettings({ ...settings, passwordMinLength: val })}
                    min={6}
                    max={32}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <Text fw={500}>Require Special Characters</Text>
                      <Text size="sm" c="dimmed">
                        Require special characters in passwords
                      </Text>
                    </div>
                    <Switch
                      checked={settings.requireSpecialChars}
                      onChange={(e) => setSettings({ ...settings, requireSpecialChars: e.currentTarget.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Text fw={500}>Two-Factor Authentication</Text>
                      <Text size="sm" c="dimmed">
                        Require 2FA for all users
                      </Text>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.currentTarget.checked })}
                    />
                  </div>

                  <NumberInput
                    label="Session Timeout (minutes)"
                    value={settings.sessionTimeout}
                    onChange={(val) => setSettings({ ...settings, sessionTimeout: val })}
                    min={5}
                    max={120}
                    leftSection={<Clock size={16} />}
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="appearance">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text fw={500}>Dark Mode</Text>
                      <Text size="sm" c="dimmed">
                        Enable dark mode by default
                      </Text>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onChange={(e) => setSettings({ ...settings, darkMode: e.currentTarget.checked })}
                    />
                  </div>
              </Tabs.Panel>
            </div>
          </Tabs>
        </div>
      </div>
    </Container>
  );
};

export default Settings;