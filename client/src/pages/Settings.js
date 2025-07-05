import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Eye, 
  Lock, 
  User, 
  Mail, 
  Smartphone,
  Globe,
  Palette,
  Download,
  Trash2,
  Save,
  X,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const { theme, setThemeMode } = useTheme();
  const [settings, setSettings] = useState({
    account: {
      username: 'guest_user',
      email: 'guest@truthlens.com',
      language: 'English',
      timezone: 'UTC-5 (Eastern Time)'
    },
    privacy: {
      profileVisibility: 'public',
      showActivity: true,
      allowAnalytics: true,
      dataSharing: false
    },
    notifications: {
      pushNotifications: true,
      emailNotifications: false,
      smsNotifications: false,
      newsAlerts: true,
      factCheckAlerts: true,
      biasAlerts: true,
      socialUpdates: false
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
      showAnimations: true
    },
    data: {
      autoBackup: true,
      exportData: false,
      deleteAccount: false
    }
  });

  const [tempSettings, setTempSettings] = useState(settings);

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'data', name: 'Data & Export', icon: Download }
  ];

  const handleSave = () => {
    setSettings(tempSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  const handleSettingChange = (section, key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Username</label>
            {isEditing ? (
              <input
                type="text"
                value={tempSettings.account.username}
                onChange={(e) => handleSettingChange('account', 'username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{settings.account.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={tempSettings.account.email}
                onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{settings.account.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Language</label>
            {isEditing ? (
              <select
                value={tempSettings.account.language}
                onChange={(e) => handleSettingChange('account', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            ) : (
              <p className="text-gray-900 dark:text-white">{settings.account.language}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Timezone</label>
            {isEditing ? (
              <select
                value={tempSettings.account.timezone}
                onChange={(e) => handleSettingChange('account', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
              </select>
            ) : (
              <p className="text-gray-900 dark:text-white">{settings.account.timezone}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4">Security</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-gray-400 dark:text-slate-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Change Password</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Update your account password</p>
              </div>
            </div>
            <span className="text-sm text-gray-400 dark:text-slate-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-400 dark:text-slate-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Add an extra layer of security</p>
              </div>
            </div>
            <span className="text-sm text-gray-400 dark:text-slate-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4">Privacy Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
              <p className="text-xs text-gray-500">Who can see your profile</p>
            </div>
            <select
              value={tempSettings.privacy.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              disabled={!isEditing}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Show Activity</p>
              <p className="text-xs text-gray-500">Display your reading activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.privacy.showActivity}
                onChange={(e) => handleSettingChange('privacy', 'showActivity', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Analytics</p>
              <p className="text-xs text-gray-500">Help improve TruthLens</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.privacy.allowAnalytics}
                onChange={(e) => handleSettingChange('privacy', 'allowAnalytics', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Push Notifications</p>
              <p className="text-xs text-gray-500">Receive notifications in browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.notifications.pushNotifications}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive email updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">News Alerts</p>
              <p className="text-xs text-gray-500">Breaking news notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.notifications.newsAlerts}
                onChange={(e) => handleSettingChange('notifications', 'newsAlerts', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Fact-Check Alerts</p>
              <p className="text-xs text-gray-500">New fact-check results</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.notifications.factCheckAlerts}
                onChange={(e) => handleSettingChange('notifications', 'factCheckAlerts', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Theme</label>
            <select
              value={tempSettings.appearance.theme}
              onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Font Size</label>
            <select
              value={tempSettings.appearance.fontSize}
              onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Compact Mode</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Reduce spacing for more content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.appearance.compactMode}
                onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Backup</p>
              <p className="text-xs text-gray-500">Automatically backup your data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.data.autoBackup}
                onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Export Data</p>
                <p className="text-xs text-gray-500">Download your data as JSON</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-900">Delete Account</p>
                <p className="text-xs text-red-500">Permanently delete your account</p>
              </div>
            </div>
            <span className="text-sm text-red-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-300">Settings</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage your account preferences and privacy</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Edit Settings</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-soft p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700'
                        : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 