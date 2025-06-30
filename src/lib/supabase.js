import { createClient } from '@supabase/supabase-js'

// Demo/Development configuration
const DEMO_MODE = true

// These will be replaced with actual values when you connect your Supabase project
const SUPABASE_URL = 'https://hsilldpjikloxzysmtbt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzaWxsZHBqaWtsb3h6eXNtdGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODkxOTcsImV4cCI6MjA2Njg2NTE5N30.B_4_masDViZ5x_7HvNEr0YYEwdlHBeMc3tv3FYyyRGU'

// For development, you can also use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

// Demo user for testing
export const DEMO_ADMIN = {
  email: 'admin@blueprintmanager.com',
  password: 'admin123',
  user: {
    id: 'demo-admin-id',
    email: 'admin@blueprintmanager.com',
    user_metadata: {
      full_name: 'Demo Admin',
      avatar_url: null
    },
    created_at: new Date().toISOString()
  }
}

// Create Supabase client
let supabase = null

if (supabaseUrl !== 'https://your-project-id.supabase.co' && supabaseKey !== 'your-anon-key') {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
} else {
  console.warn('⚠️ Using demo mode. Configure Supabase credentials for production.')
  
  // Mock Supabase client for demo
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: (callback) => {
        const unsubscribe = () => {}
        return { data: { subscription: { unsubscribe } } }
      },
      signInWithPassword: ({ email, password }) => {
        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
          return Promise.resolve({ 
            data: { user: DEMO_ADMIN.user, session: { user: DEMO_ADMIN.user } }, 
            error: null 
          })
        }
        return Promise.resolve({ 
          data: null, 
          error: { message: 'Invalid email or password' } 
        })
      },
      signUp: ({ email, password }) => {
        return Promise.resolve({ 
          data: { user: { email, id: 'demo-user-' + Date.now() } }, 
          error: null 
        })
      },
      signInWithOAuth: () => {
        return Promise.resolve({ 
          data: null, 
          error: { message: 'OAuth not available in demo mode. Use demo credentials.' } 
        })
      },
      signOut: () => Promise.resolve({ error: null })
    },
    from: (table) => ({
      select: (columns) => ({
        order: () => ({ count: 0, data: [] }),
        eq: () => ({ count: 0, data: [] }),
        limit: () => ({ count: 0, data: [] })
      }),
      insert: (data) => Promise.resolve({ data, error: null }),
      update: (data) => ({
        eq: () => Promise.resolve({ data, error: null })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    })
  }
}

export { supabase }
