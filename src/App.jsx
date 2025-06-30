import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './components/Auth/AuthPage'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import BlueprintsList from './components/Blueprints/BlueprintsList'
import SOPsList from './components/SOPs/SOPsList'
import ToolsList from './components/Tools/ToolsList'
import ClientsList from './components/Clients/ClientsList'
import PricingList from './components/Pricing/PricingList'
import Settings from './components/Settings/Settings'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import { isAdmin } from './lib/supabase'
import './App.css'

const MainApp = () => {
  const { user, signOut, loading } = useAuth()
  const [activeSection, setActiveSection] = useState(() => {
    // Set default section based on admin status
    return 'dashboard'
  })

  const handleSignOut = async () => {
    await signOut()
  }

  const handleSectionChange = (section) => {
    // Check if trying to access admin-only section
    if (section === 'dashboard' && !isAdmin(user)) {
      return // Don't allow access
    }
    setActiveSection(section)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />
      case 'blueprints':
        return <BlueprintsList />
      case 'sops':
        return <SOPsList />
      case 'tools':
        return <ToolsList />
      case 'clients':
        return <ClientsList />
      case 'pricing':
        return <PricingList />
      case 'settings':
        return <Settings />
      default:
        return isAdmin(user) ? <AdminDashboard /> : <BlueprintsList />
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage />
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange} 
        onSignOut={handleSignOut} 
      />
      <div className="flex-1 flex flex-col">
        <Header title={activeSection} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

export default App