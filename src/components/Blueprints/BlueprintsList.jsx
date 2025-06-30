import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'
import BlueprintModal from './BlueprintModal'
import BlueprintPage from './BlueprintPage'

const { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter, FiFileText, FiDollarSign, FiTag, FiBriefcase } = FiIcons

const BlueprintsList = () => {
  const [blueprints, setBlueprints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedBlueprint, setSelectedBlueprint] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'page'
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterNiche, setFilterNiche] = useState('all')
  const [niches, setNiches] = useState([])

  useEffect(() => {
    fetchBlueprints()
    fetchNiches()
  }, [])

  const fetchBlueprints = async () => {
    try {
      const { data, error } = await supabase
        .from('blueprints_detailed_qm3x9k5l2w')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBlueprints(data || [])
    } catch (error) {
      console.error('Error fetching blueprints:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNiches = async () => {
    try {
      const { data, error } = await supabase
        .from('settings_qm3x9k5l2w')
        .select('value')
        .eq('key', 'niches')
        .single()

      if (error) throw error
      setNiches(data?.value || [])
    } catch (error) {
      console.error('Error fetching niches:', error)
      setNiches(['E-commerce', 'SaaS', 'Digital Marketing'])
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blueprint?')) {
      try {
        const { error } = await supabase
          .from('blueprints_detailed_qm3x9k5l2w')
          .delete()
          .eq('id', id)

        if (error) throw error
        fetchBlueprints()
      } catch (error) {
        console.error('Error deleting blueprint:', error)
      }
    }
  }

  const handleView = (blueprint) => {
    setSelectedBlueprintId(blueprint.id)
    setViewMode('page')
  }

  const handleEdit = (blueprint) => {
    setSelectedBlueprint(blueprint)
    setShowModal(true)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedBlueprintId(null)
  }

  const filteredBlueprints = blueprints.filter(blueprint => {
    const title = blueprint.title || ''
    const description = blueprint.description || ''
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterNiche === 'all' || blueprint.niche === filterNiche
    return matchesSearch && matchesFilter
  })

  const availableNiches = ['all', ...niches]

  if (viewMode === 'page') {
    return (
      <BlueprintPage
        blueprintId={selectedBlueprintId}
        onBack={handleBackToList}
        onEdit={handleEdit}
      />
    )
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Blueprints</h1>
          <p className="text-gray-600 mt-1">Manage your marketing blueprints</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedBlueprint(null)
            setShowModal(true)
          }}
          className="bg-gradient-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <SafeIcon icon={FiPlus} />
          Add Blueprint
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blueprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="relative">
          <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterNiche}
            onChange={(e) => setFilterNiche(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
          >
            {availableNiches.map(niche => (
              <option key={niche} value={niche}>
                {niche === 'all' ? 'All Niches' : niche}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredBlueprints.map((blueprint) => (
            <motion.div
              key={blueprint.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleView(blueprint)}
            >
              {/* Featured Image */}
              {blueprint.featured_image_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={blueprint.featured_image_url}
                    alt={blueprint.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="w-full h-full bg-gradient-primary-light hidden items-center justify-center">
                    <SafeIcon icon={FiFileText} className="text-4xl text-gray-300" />
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blueprint.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {blueprint.description}
                    </p>
                  </div>
                </div>

                {/* Tags and Price */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {blueprint.niche && (
                    <span className="inline-flex items-center gap-1 bg-gradient-primary text-white text-xs px-2 py-1 rounded-full">
                      <SafeIcon icon={FiTag} className="text-xs" />
                      {blueprint.niche}
                    </span>
                  )}
                  {blueprint.business_type && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      <SafeIcon icon={FiBriefcase} className="text-xs" />
                      {blueprint.business_type}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(blueprint.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleView(blueprint)
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <SafeIcon icon={FiEye} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(blueprint)
                      }}
                      className="p-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <SafeIcon icon={FiEdit2} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(blueprint.id)
                      }}
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

      {filteredBlueprints.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiFileText} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No blueprints found</h3>
          <p className="text-gray-500">
            {searchTerm || filterNiche !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first blueprint to get started'}
          </p>
        </div>
      )}

      <BlueprintModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedBlueprint(null)
        }}
        blueprint={selectedBlueprint}
        onSave={fetchBlueprints}
      />
    </div>
  )
}

export default BlueprintsList