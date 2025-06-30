import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'

const { FiTag, FiPlus, FiTrash2, FiSave, FiBriefcase, FiEdit2, FiCheck, FiX } = FiIcons

const CategoriesManager = () => {
  const [categories, setCategories] = useState({
    niches: [],
    business_types: [],
    blueprint_categories: [],
    sop_categories: [],
    tool_categories: [],
    client_statuses: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [newItems, setNewItems] = useState({})

  const categoryTypes = [
    { 
      key: 'niches', 
      label: 'Blueprint Niches', 
      icon: FiTag, 
      color: 'blue',
      description: 'Industry niches for blueprints'
    },
    { 
      key: 'business_types', 
      label: 'Business Types', 
      icon: FiBriefcase, 
      color: 'purple',
      description: 'Types of businesses using blueprints'
    },
    { 
      key: 'blueprint_categories', 
      label: 'Blueprint Categories', 
      icon: FiTag, 
      color: 'green',
      description: 'General categories for blueprints'
    },
    { 
      key: 'sop_categories', 
      label: 'SOP Categories', 
      icon: FiTag, 
      color: 'orange',
      description: 'Categories for Standard Operating Procedures'
    },
    { 
      key: 'tool_categories', 
      label: 'Tool Categories', 
      icon: FiTag, 
      color: 'pink',
      description: 'Categories for business tools'
    },
    { 
      key: 'client_statuses', 
      label: 'Client Statuses', 
      icon: FiTag, 
      color: 'indigo',
      description: 'Available client status options'
    }
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('settings_qm3x9k5l2w')
        .select('*')

      if (error) throw error

      const categoriesData = {}
      categoryTypes.forEach(type => {
        const setting = data?.find(item => item.key === type.key)
        categoriesData[type.key] = setting?.value || getDefaultValues(type.key)
      })

      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Set default values
      const defaultCategories = {}
      categoryTypes.forEach(type => {
        defaultCategories[type.key] = getDefaultValues(type.key)
      })
      setCategories(defaultCategories)
    } finally {
      setLoading(false)
    }
  }

  const getDefaultValues = (key) => {
    const defaults = {
      niches: ['E-commerce', 'SaaS', 'Digital Marketing', 'Real Estate', 'Health & Wellness'],
      business_types: ['Startup', 'Small Business', 'Medium Business', 'Enterprise', 'Agency'],
      blueprint_categories: ['Marketing', 'Sales', 'Operations', 'Strategy', 'Growth'],
      sop_categories: ['Operations', 'Marketing', 'HR', 'Finance', 'Customer Service'],
      tool_categories: ['Analytics', 'Design', 'Email', 'Social Media', 'Productivity'],
      client_statuses: ['Active', 'Inactive', 'Prospect', 'Lead', 'Converted']
    }
    return defaults[key] || []
  }

  const saveCategories = async () => {
    try {
      setSaving(true)
      
      for (const type of categoryTypes) {
        const { error } = await supabase
          .from('settings_qm3x9k5l2w')
          .upsert({
            key: type.key,
            value: categories[type.key],
            description: type.description,
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      }

      alert('Categories saved successfully!')
    } catch (error) {
      console.error('Error saving categories:', error)
      alert('Error saving categories. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addItem = (categoryKey) => {
    const newItem = newItems[categoryKey]?.trim()
    if (newItem && !categories[categoryKey].includes(newItem)) {
      setCategories({
        ...categories,
        [categoryKey]: [...categories[categoryKey], newItem]
      })
      setNewItems({ ...newItems, [categoryKey]: '' })
    }
  }

  const removeItem = (categoryKey, index) => {
    setCategories({
      ...categories,
      [categoryKey]: categories[categoryKey].filter((_, i) => i !== index)
    })
  }

  const startEditing = (categoryKey, index) => {
    setEditingItem({ categoryKey, index, value: categories[categoryKey][index] })
  }

  const saveEdit = () => {
    if (editingItem) {
      const newCategories = [...categories[editingItem.categoryKey]]
      newCategories[editingItem.index] = editingItem.value
      setCategories({
        ...categories,
        [editingItem.categoryKey]: newCategories
      })
      setEditingItem(null)
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SafeIcon icon={FiTag} className="text-primary text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveCategories}
          disabled={saving}
          className="px-6 py-3 bg-gradient-primary text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          <SafeIcon icon={FiSave} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryTypes.map((type) => (
          <motion.div
            key={type.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-${type.color}-100`}>
                <SafeIcon icon={type.icon} className={`text-${type.color}-600`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{type.label}</h3>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </div>

            {/* Add New Item */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItems[type.key] || ''}
                onChange={(e) => setNewItems({ ...newItems, [type.key]: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addItem(type.key)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder={`Add new ${type.label.toLowerCase()}...`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addItem(type.key)}
                className="px-3 py-2 bg-gradient-primary text-white rounded-lg flex items-center gap-1 hover:shadow-lg transition-shadow text-sm"
              >
                <SafeIcon icon={FiPlus} className="text-sm" />
                Add
              </motion.button>
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {categories[type.key].map((item, index) => (
                  <motion.div
                    key={`${type.key}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200"
                  >
                    {editingItem?.categoryKey === type.key && editingItem?.index === index ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingItem.value}
                          onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={saveEdit}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <SafeIcon icon={FiCheck} className="text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={cancelEdit}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <SafeIcon icon={FiX} className="text-sm" />
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-700 text-sm flex-1">{item}</span>
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEditing(type.key, index)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <SafeIcon icon={FiEdit2} className="text-sm" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(type.key, index)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {categories[type.key].length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No {type.label.toLowerCase()} added yet
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CategoriesManager