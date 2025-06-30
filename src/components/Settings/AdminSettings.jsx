import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase, isAdmin } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const { FiSettings, FiPlus, FiTrash2, FiSave, FiTag, FiBriefcase, FiShield } = FiIcons

const AdminSettings = () => {
  const { user } = useAuth()
  const [niches, setNiches] = useState([])
  const [businessTypes, setBusinessTypes] = useState([])
  const [newNiche, setNewNiche] = useState('')
  const [newBusinessType, setNewBusinessType] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('settings_qm3x9k5l2w')
        .select('*')
        .in('key', ['niches', 'business_types'])

      if (error) throw error

      const nichesData = data?.find(item => item.key === 'niches')
      const businessTypesData = data?.find(item => item.key === 'business_types')

      setNiches(nichesData?.value || [])
      setBusinessTypes(businessTypesData?.value || [])
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Fallback to default values
      setNiches(['E-commerce', 'SaaS', 'Digital Marketing', 'Real Estate', 'Health & Wellness'])
      setBusinessTypes(['Startup', 'Small Business', 'Medium Business', 'Enterprise', 'Agency'])
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      
      // Update niches
      const { error: nichesError } = await supabase
        .from('settings_qm3x9k5l2w')
        .upsert({
          key: 'niches',
          value: niches,
          description: 'Available niches for blueprints',
          updated_at: new Date().toISOString()
        })

      if (nichesError) throw nichesError

      // Update business types
      const { error: businessTypesError } = await supabase
        .from('settings_qm3x9k5l2w')
        .upsert({
          key: 'business_types',
          value: businessTypes,
          description: 'Available business types for blueprints',
          updated_at: new Date().toISOString()
        })

      if (businessTypesError) throw businessTypesError

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addNiche = () => {
    if (newNiche.trim() && !niches.includes(newNiche.trim())) {
      setNiches([...niches, newNiche.trim()])
      setNewNiche('')
    }
  }

  const removeNiche = (index) => {
    setNiches(niches.filter((_, i) => i !== index))
  }

  const addBusinessType = () => {
    if (newBusinessType.trim() && !businessTypes.includes(newBusinessType.trim())) {
      setBusinessTypes([...businessTypes, newBusinessType.trim()])
      setNewBusinessType('')
    }
  }

  const removeBusinessType = (index) => {
    setBusinessTypes(businessTypes.filter((_, i) => i !== index))
  }

  // Check admin access
  if (!isAdmin(user)) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <SafeIcon icon={FiShield} className="text-6xl text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h3>
          <p className="text-gray-500">
            You don't have permission to access Admin Settings.
          </p>
        </div>
      </div>
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
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <SafeIcon icon={FiSettings} className="text-primary text-2xl" />
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
      </div>

      {/* Niches Management */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <SafeIcon icon={FiTag} className="text-primary text-xl" />
          <h3 className="text-xl font-semibold text-gray-900">Blueprint Niches</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newNiche}
              onChange={(e) => setNewNiche(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNiche()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add new niche..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addNiche}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <SafeIcon icon={FiPlus} />
              Add
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {niches.map((niche, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span className="text-gray-700">{niche}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeNiche(index)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Types Management */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <SafeIcon icon={FiBriefcase} className="text-primary text-xl" />
          <h3 className="text-xl font-semibold text-gray-900">Business Types</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newBusinessType}
              onChange={(e) => setNewBusinessType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addBusinessType()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add new business type..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addBusinessType}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <SafeIcon icon={FiPlus} />
              Add
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {businessTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span className="text-gray-700">{type}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeBusinessType(index)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-3 bg-gradient-primary text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          <SafeIcon icon={FiSave} />
          {saving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>
    </div>
  )
}

export default AdminSettings