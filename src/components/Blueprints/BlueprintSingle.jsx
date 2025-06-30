import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'

const { FiArrowLeft, FiDollarSign, FiTag, FiBriefcase, FiCalendar, FiUser, FiEdit2 } = FiIcons

const BlueprintSingle = ({ blueprintId, onBack, onEdit }) => {
  const [blueprint, setBlueprint] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (blueprintId) {
      fetchBlueprint()
    }
  }, [blueprintId])

  const fetchBlueprint = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blueprints_qm3x9k5l2w')
        .select('*')
        .eq('id', blueprintId)
        .single()

      if (error) throw error
      setBlueprint(data)
    } catch (error) {
      console.error('Error fetching blueprint:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!blueprint) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Blueprint not found</h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          ← Back to Blueprints
        </motion.button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} />
          Back to Blueprints
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEdit(blueprint)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <SafeIcon icon={FiEdit2} />
          Edit Blueprint
        </motion.button>
      </div>

      {/* Cover Image */}
      {blueprint.cover_image_url && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <img
            src={blueprint.cover_image_url}
            alt={blueprint.name || blueprint.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <div className="w-full h-64 md:h-80 bg-gradient-primary-light rounded-xl shadow-lg hidden flex items-center justify-center">
            <SafeIcon icon={FiTag} className="text-6xl text-gray-300" />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title and Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blueprint.name || blueprint.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {blueprint.price && (
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiDollarSign} className="text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    ${blueprint.price}
                  </span>
                </div>
              )}

              {blueprint.niche && (
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiTag} className="text-primary" />
                  <span className="px-3 py-1 bg-gradient-primary text-white text-sm rounded-full">
                    {blueprint.niche}
                  </span>
                </div>
              )}

              {blueprint.business_type && (
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiBriefcase} className="text-purple-600" />
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {blueprint.business_type}
                  </span>
                </div>
              )}
            </div>

            {blueprint.description && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {blueprint.description}
                </p>
              </div>
            )}
          </motion.div>

          {/* Content */}
          {blueprint.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Blueprint Content</h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {blueprint.content}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          {blueprint.featured_image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <img
                src={blueprint.featured_image_url}
                alt={blueprint.name || blueprint.title}
                className="w-full aspect-square object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <div className="w-full aspect-square bg-gradient-primary-light rounded-lg hidden flex items-center justify-center">
                <SafeIcon icon={FiTag} className="text-4xl text-gray-300" />
              </div>
            </motion.div>
          )}

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <SafeIcon icon={FiCalendar} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(blueprint.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {blueprint.status && (
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiTag} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        blueprint.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : blueprint.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {blueprint.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-primary text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Purchase Blueprint
            </motion.button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Secure payment processing
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BlueprintSingle