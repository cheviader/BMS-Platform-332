import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, DEMO_ADMIN } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for demo session in localStorage
    const demoSession = localStorage.getItem('demo-session')
    if (demoSession) {
      try {
        const session = JSON.parse(demoSession)
        setUser(session.user)
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('demo-session')
      }
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      // Check for demo admin credentials
      if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        const session = { user: DEMO_ADMIN.user }
        localStorage.setItem('demo-session', JSON.stringify(session))
        setUser(DEMO_ADMIN.user)
        return { data: { user: DEMO_ADMIN.user }, error: null }
      }

      // Try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (data.user) {
        setUser(data.user)
      }
      
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Authentication failed' } }
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin
        }
      })
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Registration failed' } }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Google sign-in not available in demo mode' } }
    }
  }

  const signOut = async () => {
    try {
      // Clear demo session
      localStorage.removeItem('demo-session')
      setUser(null)
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: { message: 'Sign out failed' } }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Password reset not available in demo mode' } }
    }
  }

  const updatePassword = async (password) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Password update not available in demo mode' } }
    }
  }

  const value = {
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}