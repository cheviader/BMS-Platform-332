import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://hsilldpjikloxzysmtbt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzaWxsZHBqaWtsb3h6eXNtdGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODkxOTcsImV4cCI6MjA2Njg2NTE5N30.B_4_masDViZ5x_7HvNEr0YYEwdlHBeMc3tv3FYyyRGU'

// For development, you can also use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

// Demo admin user for testing
export const DEMO_ADMIN = {
  email: 'admin@blueprintmanager.com',
  password: 'admin123',
  user: {
    id: 'demo-admin-id',
    email: 'admin@blueprintmanager.com',
    user_metadata: {
      full_name: 'Demo Admin',
      avatar_url: null,
      role: 'admin'
    },
    app_metadata: {
      role: 'admin'
    },
    created_at: new Date().toISOString()
  }
}

// Admin users list - you can expand this
export const ADMIN_USERS = [
  'admin@blueprintmanager.com',
  'admin@boostmy.site'
]

// Helper function to check if user is admin
export const isAdmin = (user) => {
  if (!user) return false
  
  // Check demo admin
  if (user.email === DEMO_ADMIN.email) return true
  
  // Check if user email is in admin list
  if (ADMIN_USERS.includes(user.email)) return true
  
  // Check user metadata for admin role
  if (user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin') return true
  
  return false
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})