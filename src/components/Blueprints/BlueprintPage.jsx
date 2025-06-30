import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { supabase } from '../../lib/supabase'

const { FiArrowLeft, FiTag, FiBriefcase, FiCheck, FiStar, FiUsers, FiClock, FiShoppingCart, FiHeart } = FiIcons

const BlueprintPage = ({ blueprintId, onBack, onEdit }) => {
  const [blueprint, setBlueprint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState('standard')
  const [purchasing, setPurchasing] = useState(false)

  const pricingPlans = {
    basic: {
      name: 'Basic Blueprint',
      price: 19,
      features: [
        'Complete blueprint document',
        'Step-by-step implementation guide',
        'Basic templates included',
        'Email support',
        'Single use license'
      ]
    },
    standard: {
      name: 'Standard Package',
      price: 99,
      features: [
        'Everything in Basic',
        'Advanced templates & tools',
        'Video tutorials (2+ hours)',
        'Priority email support',
        'Commercial use license',
        'Bonus resources pack',
        '30-day money-back guarantee'
      ],
      popular: true
    },
    premium: {
      name: 'Premium Package',
      price: 299,
      features: [
        'Everything in Standard',
        'One-on-one consultation call',
        'Custom implementation plan',
        'Done-for-you templates',
        'Priority phone support',
        'Lifetime updates',
        'Reseller rights included',
        'Private community access'
      ]
    }
  }

  useEffect(() => {
    if (blueprintId) {
      fetchBlueprint()
    }
  }, [blueprintId])

  const fetchBlueprint = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blueprints_detailed_qm3x9k5l2w')
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

  const handlePurchase = async (planType) => {
    setPurchasing(true)
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const plan = pricingPlans[planType]
      alert(`🎉 Purchase successful!\n\nYou've purchased: ${blueprint.title}\nPlan: ${plan.name}\nAmount: $${plan.price}\n\nCheck your email for download instructions.`)
      
      // Here you would integrate with your payment processor
      // like Stripe, PayPal, etc.
      
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            Back to Blueprints
          </motion.button>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <SafeIcon icon={FiHeart} />
            </motion.button>
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEdit(blueprint)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit Blueprint
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover Image */}
            {blueprint.cover_image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl shadow-lg"
              >
                <img
                  src={blueprint.cover_image_url}
                  alt={blueprint.title}
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="w-full h-80 bg-gradient-primary-light hidden items-center justify-center">
                  <SafeIcon icon={FiTag} className="text-6xl text-gray-300" />
                </div>
              </motion.div>
            )}

            {/* Title and Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {blueprint.niche && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-primary text-white text-sm rounded-full">
                    <SafeIcon icon={FiTag} className="text-xs" />
                    {blueprint.niche}
                  </span>
                )}
                {blueprint.business_type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    <SafeIcon icon={FiBriefcase} className="text-xs" />
                    {blueprint.business_type}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {blueprint.title}
              </h1>

              <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiStar} className="text-yellow-500" />
                  <span>4.8 (127 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiUsers} />
                  <span>2,450+ customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiClock} />
                  <span>Last updated: {new Date(blueprint.updated_at || blueprint.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {blueprint.description}
                </p>
              </div>
            </motion.div>

            {/* Content Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Get</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full mt-1">
                      <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Complete Implementation Guide</h4>
                      <p className="text-gray-600 text-sm">Step-by-step instructions to implement this blueprint in your business.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full mt-1">
                      <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Ready-to-Use Templates</h4>
                      <p className="text-gray-600 text-sm">Professional templates you can customize for your brand.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full mt-1">
                      <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Proven Strategies</h4>
                      <p className="text-gray-600 text-sm">Battle-tested methods that have generated millions in revenue.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full mt-1">
                      <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Expert Support</h4>
                      <p className="text-gray-600 text-sm">Get help from our team when you need it most.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full mt-1">
                      <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Bonus Resources</h4>
                      <p className="text-gray-600 text-sm">Additional tools and resources to maximize your success.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full mt-1">
                      <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Lifetime Updates</h4>
                      <p className="text-gray-600 text-sm">Get all future updates and improvements at no extra cost.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Detailed Content */}
            {blueprint.content && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Blueprint Details</h2>
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {blueprint.content}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Featured Image */}
              {blueprint.featured_image_url && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                >
                  <img
                    src={blueprint.featured_image_url}
                    alt={blueprint.title}
                    className="w-full aspect-square object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="w-full aspect-square bg-gradient-primary-light rounded-lg hidden items-center justify-center">
                    <SafeIcon icon={FiTag} className="text-4xl text-gray-300" />
                  </div>
                </motion.div>
              )}

              {/* Pricing Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                {Object.entries(pricingPlans).map(([key, plan]) => (
                  <div
                    key={key}
                    className={`relative bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all ${
                      selectedPlan === key
                        ? 'border-primary shadow-xl'
                        : 'border-gray-100 hover:border-gray-200'
                    } ${plan.popular ? 'ring-2 ring-primary/20' : ''}`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <div className="text-3xl font-bold text-primary">
                        ${plan.price}
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <SafeIcon icon={FiCheck} className="text-green-500 text-sm flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {selectedPlan === key && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePurchase(key)
                        }}
                        disabled={purchasing}
                        className="w-full py-3 rounded-lg font-bold text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{ backgroundColor: '#FFE033' }}
                      >
                        <SafeIcon icon={FiShoppingCart} />
                        {purchasing ? 'Processing...' : 'Buy Now'}
                      </motion.button>
                    )}
                  </div>
                ))}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={FiCheck} className="text-green-500" />
                    <span className="text-sm text-gray-700">30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={FiCheck} className="text-green-500" />
                    <span className="text-sm text-gray-700">Instant download</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={FiCheck} className="text-green-500" />
                    <span className="text-sm text-gray-700">Secure payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={FiCheck} className="text-green-500" />
                    <span className="text-sm text-gray-700">Expert support included</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlueprintPage