import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'
import PricingModal from './PricingModal'

const { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter, FiDollarSign } = FiIcons

const PricingList = () => {
  const [pricingPlans, setPricingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchPricingPlans()
  }, [])

  const fetchPricingPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('price', { ascending: true })

      if (error) throw error
      setPricingPlans(data || [])
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pricing plan?')) {
      try {
        const { error } = await supabase
          .from('pricing_plans')
          .delete()
          .eq('id', id)

        if (error) throw error
        fetchPricingPlans()
      } catch (error) {
        console.error('Error deleting pricing plan:', error)
      }
    }
  }

  const filteredPlans = pricingPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || plan.type === filterType
    return matchesSearch && matchesFilter
  })

  const types = ['all', ...new Set(pricingPlans.map(p => p.type).filter(Boolean))]

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
          <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
          <p className="text-gray-600 mt-1">Manage your service pricing and packages</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedPlan(null)
            setShowModal(true)
          }}
          className="bg-gradient-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <SafeIcon icon={FiPlus} />
          Add Plan
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pricing plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="relative">
          <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">
                      /{plan.billing_period || 'month'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {plan.description}
                  </p>
                </div>

                {plan.type && (
                  <div className="mb-4 text-center">
                    <span className="inline-block bg-gradient-primary text-white text-xs px-3 py-1 rounded-full">
                      {plan.type}
                    </span>
                  </div>
                )}

                {plan.features && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-line">
                      {plan.features}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {plan.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedPlan(plan)
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
                        setSelectedPlan(plan)
                        setShowModal(true)
                      }}
                      className="p-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <SafeIcon icon={FiEdit2} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(plan.id)}
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

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiDollarSign} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No pricing plans found</h3>
          <p className="text-gray-500">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first pricing plan to get started'
            }
          </p>
        </div>
      )}

      <PricingModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan}
        onSave={fetchPricingPlans}
      />
    </div>
  )
}

export default PricingList