import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'

const { FiX, FiSave, FiUpload, FiImage } = FiIcons

const BlueprintModal = ({ isOpen, onClose, blueprint, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    niche: '',
    business_type: '',
    cover_image_url: '',
    featured_image_url: '',
    content: '',
    status: 'draft'
  })
  const [niches, setNiches] = useState([])
  const [businessTypes, setBusinessTypes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (blueprint) {
      setFormData({
        title: blueprint.title || '',
        description: blueprint.description || '',
        niche: blueprint.niche || '',
        business_type: blueprint.business_type || '',
        cover_image_url: blueprint.cover_image_url || '',
        featured_image_url: blueprint.featured_image_url || '',
        content: blueprint.content || '',
        status: blueprint.status || 'draft'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        niche: '',
        business_type: '',
        cover_image_url: '',
        featured_image_url: '',
        content: '',
        status: 'draft'
      })
    }
  }, [blueprint])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings_qm3x9k5l2w')
        .select('*')
        .in('key', ['niches', 'business_types'])

      if (error) throw error

      const nichesData = data?.find(item => item.key === 'niches')
      const businessTypesData = data?.find(item => item.key === 'business_types')

      setNiches(nichesData?.value || ['E-commerce', 'SaaS', 'Digital Marketing'])
      setBusinessTypes(businessTypesData?.value || ['Startup', 'Small Business', 'Enterprise'])
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Fallback values
      setNiches(['E-commerce', 'SaaS', 'Digital Marketing', 'Real Estate', 'Health & Wellness'])
      setBusinessTypes(['Startup', 'Small Business', 'Medium Business', 'Enterprise', 'Agency'])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (blueprint) {
        // Update existing blueprint
        const { error } = await supabase
          .from('blueprints_detailed_qm3x9k5l2w')
          .update(formData)
          .eq('id', blueprint.id)

        if (error) throw error
      } else {
        // Create new blueprint
        const { error } = await supabase
          .from('blueprints_detailed_qm3x9k5l2w')
          .insert([formData])

        if (error) throw error
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving blueprint:', error)
      alert('Error saving blueprint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUrlChange = (field, url) => {
    setFormData({ ...formData, [field]: url })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {blueprint ? 'Edit Blueprint' : 'Create Blueprint'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blueprint Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter blueprint title"
                    required
                  />
                </div>

                {/* Niche and Business Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niche
                    </label>
                    <select
                      value={formData.niche}
                      onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a niche</option>
                      {niches.map((niche) => (
                        <option key={niche} value={niche}>
                          {niche}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      value={formData.business_type}
                      onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter detailed description..."
                    rows="4"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL (1500x500)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={formData.cover_image_url}
                      onChange={(e) => handleImageUrlChange('cover_image_url', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://example.com/cover-image.jpg"
                    />
                    {formData.cover_image_url && (
                      <div className="relative">
                        <img
                          src={formData.cover_image_url}
                          alt="Cover preview"
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL (500x500)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={formData.featured_image_url}
                      onChange={(e) => handleImageUrlChange('featured_image_url', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://example.com/featured-image.jpg"
                    />
                    {formData.featured_image_url && (
                      <div className="relative">
                        <img
                          src={formData.featured_image_url}
                          alt="Featured preview"
                          className="w-24 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter the blueprint content, steps, and details..."
                    rows="8"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-primary text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  <SafeIcon icon={FiSave} />
                  {loading ? 'Saving...' : 'Save Blueprint'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BlueprintModal