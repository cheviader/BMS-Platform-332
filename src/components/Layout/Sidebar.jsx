import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { isAdmin } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const { FiShield, FiFileText, FiClipboard, FiTool, FiUsers, FiDollarSign, FiSettings, FiLogOut } = FiIcons

const Sidebar = ({ activeSection, setActiveSection, onSignOut }) => {
  const { user } = useAuth()

  const menuItems = [
    { id: 'blueprints', label: 'Blueprints', icon: FiFileText },
    { id: 'sops', label: 'SOPs', icon: FiClipboard },
    { id: 'tools', label: 'Tools', icon: FiTool },
    { id: 'clients', label: 'Clients', icon: FiUsers },
    { id: 'pricing', label: 'Pricing', icon: FiDollarSign },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ]

  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-100 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <img
          src="https://boostmy.site/wp-content/uploads/2025/03/boostmy.site-final-2025-400.png"
          alt="BoostMy.Site Logo"
          className="h-8 w-auto object-contain"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hidden">
          BoostMy.Site
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        {isAdmin(user) && (
          <>
            <div className="mb-3 px-4 py-2 bg-gradient-primary bg-opacity-10 rounded-lg">
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiShield} className="text-primary text-sm" />
                <span className="text-xs font-medium text-primary">Admin Access</span>
              </div>
            </div>
            
            {/* Admin Dashboard Menu Item */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 ${
                activeSection === 'dashboard'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiShield} className="text-lg" />
              <span className="font-medium">Admin Dashboard</span>
            </motion.button>
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <SafeIcon icon={FiLogOut} className="text-lg" />
          <span className="font-medium">Sign Out</span>
        </motion.button>
      </div>
    </div>
  )
}

export default Sidebar