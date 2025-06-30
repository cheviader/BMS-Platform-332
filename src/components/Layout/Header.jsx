import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'

const { FiBell, FiSearch, FiUser } = FiIcons

const Header = ({ title, user }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
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
            <SafeIcon icon={FiUser} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user?.email || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header