import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import CategoriesManager from './CategoriesManager'
import { isAdmin } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const { FiDatabase, FiArrowLeft, FiTag, FiTable, FiSettings, FiShield } = FiIcons

const DatabaseManagement = ({ onBack }) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('categories')

  const tabs = [
    { id: 'categories', label: 'Categories', icon: FiTag },
    { id: 'tables', label: 'Tables', icon: FiTable },
    { id: 'settings', label: 'DB Settings', icon: FiSettings }
  ]

  // Check admin access
  if (!isAdmin(user)) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <SafeIcon icon={FiShield} className="text-6xl text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h3>
          <p className="text-gray-500">
            You don't have permission to access Database Management.
          </p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoriesManager />
      case 'tables':
        return <TablesManager />
      case 'settings':
        return <DatabaseSettings />
      default:
        return <CategoriesManager />
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            Back to Dashboard
          </motion.button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiDatabase} className="text-primary text-2xl" />
            <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SafeIcon icon={FiShield} className="text-primary" />
          <span className="text-sm font-medium text-primary">Admin Only</span>
        </div>
      </div>

      {/* Top Menu */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
        <div className="px-6 py-4">
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={tab.icon} />
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        {renderContent()}
      </div>
    </div>
  )
}

// Tables Manager Component
const TablesManager = () => {
  const tables = [
    { name: 'blueprints_qm3x9k5l2w', records: 12, size: '2.4 MB' },
    { name: 'clients_qm3x9k5l2w', records: 45, size: '1.8 MB' },
    { name: 'sops_qm3x9k5l2w', records: 8, size: '1.2 MB' },
    { name: 'tools_qm3x9k5l2w', records: 25, size: '3.1 MB' },
    { name: 'pricing_plans_qm3x9k5l2w', records: 6, size: '0.8 MB' },
    { name: 'settings_qm3x9k5l2w', records: 10, size: '0.4 MB' }
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <SafeIcon icon={FiTable} className="text-primary text-xl" />
        <h2 className="text-2xl font-bold text-gray-900">Database Tables</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <motion.div
            key={table.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <SafeIcon icon={FiTable} className="text-primary" />
              <h3 className="font-semibold text-gray-900">{table.name}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Records:</span>
                <span className="font-medium">{table.records}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Size:</span>
                <span className="font-medium">{table.size}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                View Data
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Export
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Database Settings Component
const DatabaseSettings = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <SafeIcon icon={FiSettings} className="text-primary text-xl" />
        <h2 className="text-2xl font-bold text-gray-900">Database Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Connection Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-blue-700">Connected to Supabase</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project URL
            </label>
            <input
              type="url"
              readOnly
              value="https://hsilldpjikloxzysmtbt.supabase.co"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Region
            </label>
            <input
              type="text"
              readOnly
              value="US East (N. Virginia)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Database Actions</h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Backup Database
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Logs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Performance Stats
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseManagement