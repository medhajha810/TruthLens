import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Eye,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Shield,
  Settings
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Guest User',
    email: 'guest@truthlens.com',
    location: 'United States',
    joinDate: 'January 2024',
    bio: 'Passionate about media literacy and fact-checking. Always seeking the truth behind the headlines.',
    preferences: {
      notifications: true,
      emailUpdates: false,
      darkMode: false,
      autoRefresh: true
    }
  });

  const [tempData, setTempData] = useState(profileData);

  const activityStats = [
    { label: 'Articles Read', value: '1,247', icon: Eye, color: 'text-blue-500' },
    { label: 'Bookmarks', value: '89', icon: Bookmark, color: 'text-green-500' },
    { label: 'Votes Cast', value: '156', icon: ThumbsUp, color: 'text-purple-500' },
    { label: 'Comments', value: '23', icon: MessageCircle, color: 'text-orange-500' }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'read',
      title: 'Read article about AI developments',
      time: '2 hours ago',
      icon: Eye
    },
    {
      id: 2,
      type: 'vote',
      title: 'Voted on fact-check claim',
      time: '4 hours ago',
      icon: ThumbsUp
    },
    {
      id: 3,
      type: 'bookmark',
      title: 'Bookmarked analysis report',
      time: '1 day ago',
      icon: Bookmark
    },
    {
      id: 4,
      type: 'comment',
      title: 'Commented on social sentiment',
      time: '2 days ago',
      icon: MessageCircle
    }
  ];

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setTempData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-300">Profile</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Your personal information and activity</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
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
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-soft p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.location}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p className="text-gray-900">{profileData.joinDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={tempData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-soft p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activityStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-soft p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Preferences Sidebar */}
        <div className="space-y-6">
          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-soft p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                  <p className="text-xs text-gray-500">Receive real-time updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempData.preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Updates</p>
                  <p className="text-xs text-gray-500">Weekly digest emails</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempData.preferences.emailUpdates}
                    onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-500">Use dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempData.preferences.darkMode}
                    onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto Refresh</p>
                  <p className="text-xs text-gray-500">Auto-update news feeds</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempData.preferences.autoRefresh}
                    onChange={(e) => handlePreferenceChange('autoRefresh', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-soft p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Account Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Privacy & Security</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">View Analytics</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 