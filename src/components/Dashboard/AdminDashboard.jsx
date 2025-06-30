import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase, isAdmin } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import DatabaseManagement from '../Database/DatabaseManagement'

const { FiFileText, FiClipboard, FiTool, FiUsers, FiTrendingUp, FiActivity, FiShield, FiDatabase, FiSettings } = FiIcons

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    blueprints: 0,
    sops: 0,
    tools: 0,
    clients: 0,
    totalUsers: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dashboard')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      // Fetch real data from Supabase
      const [blueprintsResult, sopsResult, toolsResult, clientsResult] = await Promise.all([
        supabase.from('blueprints_qm3x9k5l2w').select('*', { count: 'exact', head: true }),
        supabase.from('sops_qm3x9k5l2w').select('*', { count: 'exact', head: true }),
        supabase.from('tools_qm3x9k5l2w').select('*', { count: 'exact', head: true }),
        supabase.from('clients_qm3x9k5l2w').select('*', { count: 'exact', head: true })
      ])

      setStats({
        blueprints: blueprintsResult.count || 0,
        sops: sopsResult.count || 0,
        tools: toolsResult.count || 0,
        clients: clientsResult.count || 0,
        totalUsers: 156, // Mock data for demo
        activeUsers: 89 // Mock data for demo
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      // Fallback to demo data
      setStats({
        blueprints: 12,
        sops: 8,
        tools: 25,
        clients: 45,
        totalUsers: 156,
        activeUsers: 89
      })
    } finally {
      setLoading(false)
    }
  }

  // Check admin access
  if (!isAdmin(user)) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <SafeIcon icon={FiShield} className="text-6xl text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h3>
          <p className="text-gray-500">
            You don't have permission to access the Admin Dashboard.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Contact your administrator for access.
          </p>
        </div>
      </div>
    )
  }

  // Show Database Management if selected
  if (currentView === 'database') {
    return (
      <DatabaseManagement onBack={() => setCurrentView('dashboard')} />
    )
  }

  const statCards = [
    { title: 'Total Blueprints', value: stats.blueprints, icon: FiFileText, color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', change: '+12%' },
    { title: 'Active SOPs', value: stats.sops, icon: FiClipboard, color: 'bg-green-500', gradient: 'from-green-500 to-green-600', change: '+8%' },
    { title: 'Tools & Resources', value: stats.tools, icon: FiTool, color: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600', change: '+15%' },
    { title: 'Total Clients', value: stats.clients, icon: FiUsers, color: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600', change: '+23%' },
    { title: 'Total Users', value: stats.totalUsers, icon: FiDatabase, color: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-600', change: '+5%' },
    { title: 'Active Users', value: stats.activeUsers, icon: FiActivity, color: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600', change: '+18%' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SafeIcon icon={FiShield} className="text-primary text-3xl" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Welcome back, {user?.user_metadata?.full_name || user?.email}! Here's an overview of your platform.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${card.gradient}`}>
                <SafeIcon icon={card.icon} className="text-white text-xl" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 font-medium">{card.change}</span>
              <span className="text-sm text-gray-500">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Admin Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiActivity} className="text-primary text-xl" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Admin Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-700">New blueprint created by user</p>
              <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-700">Client database updated</p>
              <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-gray-700">SOP workflow updated</p>
              <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm text-gray-700">New user registered</p>
              <span className="text-xs text-gray-500 ml-auto">2 days ago</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiSettings} className="text-primary text-xl" />
            <h3 className="text-lg font-semibold text-gray-900">Admin Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('database')}
              className="w-full p-3 text-left bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <SafeIcon icon={FiDatabase} />
                <span>Manage Database</span>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SafeIcon icon={FiUsers} />
                <span>User Management</span>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SafeIcon icon={FiSettings} />
                <span>System Settings</span>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SafeIcon icon={FiTrendingUp} />
                <span>Analytics & Reports</span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard