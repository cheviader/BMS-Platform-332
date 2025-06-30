import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'

const { FiX, FiSave, FiPlus, FiTrash2 } = FiIcons

const SOPModal = ({ isOpen, onClose, sop, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    steps: [],
    status: 'draft'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sop) {
      setFormData({
        title: sop.title || '',
        description: sop.description || '',
        category: sop.category || '',
        steps: sop.steps || [],
        status: sop.status || 'draft'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        steps: [{ title: '', description: '', order: 1 }],
        status: 'draft'
      })
    }
  }, [sop])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (sop) {
        // Update existing SOP
        const { error } = await supabase
          .from('sops')
          .update(formData)
          .eq('id', sop.id)

        if (error) throw error
      } else {
        // Create new SOP
        const { error } = await supabase
          .from('sops')
          .insert([formData])

        if (error) throw error
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving SOP:', error)
    } finally {
      setLoading(false)
    }
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { title: '', description: '', order: formData.steps.length + 1 }]
    })
  }

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      steps: newSteps.map((step, i) => ({ ...step, order: i + 1 }))
    })
  }

  const updateStep = (index, field, value) => {
    const newSteps = [...formData.steps]
    newSteps[index][field] = value
    setFormData({ ...formData, steps: newSteps })
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
                {sop ? 'Edit SOP' : 'Create SOP'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter SOP title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter SOP description"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Operations, Marketing, HR"
                    />
                  </div>

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
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Steps
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={addStep}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <SafeIcon icon={FiPlus} />
                      Add Step
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {formData.steps.map((step, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Step {index + 1}
                          </span>
                          {formData.steps.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeStep(index)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <SafeIcon icon={FiTrash2} />
                            </motion.button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Step title"
                          />
                          <textarea
                            value={step.description}
                            onChange={(e) => updateStep(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Step description"
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
                  {loading ? 'Saving...' : 'Save SOP'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SOPModal