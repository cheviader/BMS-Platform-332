import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './components/Auth/AuthPage'
import Dashboard from './components/Dashboard/Dashboard'
import BlueprintsList from './components/Blueprints/BlueprintsList'
import SOPsList from './components/SOPs/SOPsList'
import ToolsList from './components/Tools/ToolsList'
import ClientsList from './components/Clients/ClientsList'
import PricingList from './components/Pricing/PricingList'
import Settings from './components/Settings/Settings'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import './App.css'

const MainApp = () => {
  const { user, signOut, loading } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')

  const handleSignOut = async () => {
    await signOut()
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
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
        return <Dashboard />
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
        setActiveSection={setActiveSection}
        onSignOut={handleSignOut}
      />
      <div className="flex-1 flex flex-col">
        <Header
          title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          user={user}
        />
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