import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { isAdmin } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const { FiBell, FiSearch, FiUser, FiShield } = FiIcons

const Header = ({ title }) => {
  const { user } = useAuth()
  
  const getDisplayTitle = (title) => {
    if (title === 'dashboard') return 'Admin Dashboard'
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {title === 'dashboard' && isAdmin(user) && (
            <SafeIcon icon={FiShield} className="text-primary text-2xl" />
          )}
          <h2 className="text-2xl font-bold text-gray-900">{getDisplayTitle(title)}</h2>
          {title === 'dashboard' && isAdmin(user) && (
            <span className="px-2 py-1 bg-gradient-primary text-white text-xs rounded-full">
              Admin Only
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-primary transition-colors relative"
          >
            <SafeIcon icon={FiBell} className="text-xl" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>

          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {isAdmin(user) ? (
                <SafeIcon icon={FiShield} className="text-primary" />
              ) : (
                <SafeIcon icon={FiUser} className="text-gray-600" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {user?.user_metadata?.full_name || user?.email || 'User'}
                </span>
                {isAdmin(user) && (
                  <span className="text-xs text-primary font-medium">Admin</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header