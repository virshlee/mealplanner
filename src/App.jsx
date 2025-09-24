import { useState } from 'react'
import Header from './components/Header'
import Layout from './components/Layout'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Layout />
      </div>
    </AuthProvider>
  )
}

export default App

