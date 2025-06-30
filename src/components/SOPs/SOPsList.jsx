import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'
import SOPModal from './SOPModal'

const { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter, FiClipboard } = FiIcons

const SOPsList = () => {
  const [sops, setSops] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSOP, setSelectedSOP] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchSOPs()
  }, [])

  const fetchSOPs = async () => {
    try {
      const { data, error } = await supabase
        .from('sops')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSops(data || [])
    } catch (error) {
      console.error('Error fetching SOPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this SOP?')) {
      try {
        const { error } = await supabase
          .from('sops')
          .delete()
          .eq('id', id)

        if (error) throw error
        fetchSOPs()
      } catch (error) {
        console.error('Error deleting SOP:', error)
      }
    }
  }

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === 'all' || sop.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const categories = ['all', ...new Set(sops.map(s => s.category).filter(Boolean))]

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
          <h1 className="text-3xl font-bold text-gray-900">Standard Operating Procedures</h1>
          <p className="text-gray-600 mt-1">Manage your business SOPs and processes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedSOP(null)
            setShowModal(true)
          }}
          className="bg-gradient-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <SafeIcon icon={FiPlus} />
          Add SOP
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search SOPs..."
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

      {/* SOPs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredSOPs.map((sop) => (
            <motion.div
              key={sop.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {sop.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {sop.description}
                    </p>
                  </div>
                </div>

                {sop.category && (
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-primary text-white text-xs px-2 py-1 rounded-full">
                      {sop.category}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(sop.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedSOP(sop)
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
                        setSelectedSOP(sop)
                        setShowModal(true)
                      }}
                      className="p-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <SafeIcon icon={FiEdit2} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(sop.id)}
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

      {filteredSOPs.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiClipboard} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No SOPs found</h3>
          <p className="text-gray-500">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first SOP to get started'
            }
          </p>
        </div>
      )}

      <SOPModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedSOP(null)
        }}
        sop={selectedSOP}
        onSave={fetchSOPs}
      />
    </div>
  )
}

export default SOPsList