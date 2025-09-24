import { createContext, useContext, useEffect, useState } from 'react'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore, enableNetwork, disableNetwork, enableIndexedDbPersistence } from 'firebase/firestore'

// Firebase configuration from existing project
const firebaseConfig = {
  apiKey: "AIzaSyB5Dle95t_pZFHMJ0nHLK0Stmv4CyFkpSI",
  authDomain: "mealplanner-3d711.firebaseapp.com",
  projectId: "mealplanner-3d711",
  storageBucket: "mealplanner-3d711.appspot.com",
  messagingSenderId: "731814301235",
  appId: "1:731814301235:web:b652ad6e9fc06c93141d46"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
// Enable offline persistence (IndexedDB). If multiple tabs are open, persistence may fail gracefully.
enableIndexedDbPersistence(db).catch(() => {
  // noop: fall back to memory cache if persistence cannot be enabled
})
const googleProvider = new GoogleAuthProvider()

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [firestoreNetworkEnabled, setFirestoreNetworkEnabled] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const goOffline = async () => {
    try {
      await disableNetwork(db)
      setFirestoreNetworkEnabled(false)
    } catch (error) {
      console.error('Error disabling Firestore network:', error)
    }
  }

  const reconnect = async () => {
    try {
      await enableNetwork(db)
      setFirestoreNetworkEnabled(true)
    } catch (error) {
      console.error('Error enabling Firestore network:', error)
    }
  }

  const value = {
    user,
    signIn,
    signOut,
    loading,
    firestoreNetworkEnabled,
    goOffline,
    reconnect
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
