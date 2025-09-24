import { useAuth } from '../contexts/AuthContext'
import Meals from './Meals'
import Plans from './Plans'

function Layout() {
  const { user } = useAuth()

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {user ? (
          <div className="space-y-10">
            <Meals />
            <Plans />
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign in to start planning your meals
            </h2>
            <p className="text-gray-600">
              Please sign in with your Google account to access the meal planner.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default Layout

