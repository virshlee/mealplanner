import { useAuth } from '../contexts/AuthContext'

function Header() {
  const { user, signIn, signOut, loading, firestoreNetworkEnabled, reconnect } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Meal Planner</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`text-xs px-2 py-1 rounded ${firestoreNetworkEnabled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {firestoreNetworkEnabled ? 'Online' : 'Offline'}
            </span>
            {!firestoreNetworkEnabled && (
              <button
                onClick={reconnect}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-xs font-medium"
              >
                Retry Sync
              </button>
            )}
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.displayName || user.email}
                </span>
                <button
                  onClick={signOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

