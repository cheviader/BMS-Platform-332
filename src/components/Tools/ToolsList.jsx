import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'
import ToolModal from './ToolModal'

const { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter, FiTool, FiExternalLink } = FiIcons

const ToolsList = () => {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTools(data || [])
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        const { error } = await supabase
          .from('tools')
          .delete()
          .eq('id', id)

        if (error) throw error
        fetchTools()
      } catch (error) {
        console.error('Error deleting tool:', error)
      }
    }
  }

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === 'all' || tool.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const categories = ['all', ...new Set(tools.map(t => t.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tools</h1>
          <p className="text-gray-600 mt-1">Manage your marketing and business tools</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedTool(null)
            setShowModal(true)
          }}
          className="bg-gradient-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <SafeIcon icon={FiPlus} />
          Add Tool
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="relative">
          <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {tool.category && (
                    <span className="inline-block bg-gradient-primary text-white text-xs px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                  )}
                  {tool.price && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      ${tool.price}
                    </span>
                  )}
                </div>

                {tool.url && (
                  <div className="mb-4">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <SafeIcon icon={FiExternalLink} />
                      Visit Tool
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(tool.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedTool(tool)
                        setShowModal(true)
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <SafeIcon icon={FiEye} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedTool(tool)
                        setShowModal(true)
                      }}
                      className="p-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <SafeIcon icon={FiEdit2} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(tool.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiTool} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tools found</h3>
          <p className="text-gray-500">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first tool to get started'
            }
          </p>
        </div>
      )}

      <ToolModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedTool(null)
        }}
        tool={selectedTool}
        onSave={fetchTools}
      />
    </div>
  )
}

export default ToolsList