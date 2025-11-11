/**
 * Layout Component
 * Main application layout with 4 tabs: Routes, Compare, Banking, Pooling
 * Uses React Router v6 for navigation and TailwindCSS for marine-inspired styling
 */

import { NavLink, Outlet, Link } from 'react-router-dom';

export function Layout() {
  const tabs = [
    { name: 'Routes', path: '/dashboard/routes', icon: '🗺️' },
    { name: 'Compare', path: '/dashboard/compare', icon: '📊' },
    { name: 'Banking', path: '/dashboard/banking', icon: '🏦' },
    { name: 'Pooling', path: '/dashboard/pooling', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header with Marine Theme */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo/Icon */}
              <Link to="/" className="group">
                <div className="bg-teal-500/20 p-3 rounded-lg backdrop-blur-sm border border-teal-400/30 group-hover:bg-teal-500/30 transition-all">
                  <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
              </Link>
              
              {/* Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  FuelEU Maritime Compliance
                </h1>
                <p className="mt-1 text-sm text-blue-200">
                  Article 20 & 21 - Banking and Pooling Operations
                </p>
              </div>
            </div>

            {/* Back to Home Link */}
            <Link 
              to="/"
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-teal-200 rounded-lg border border-teal-400/30 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Tab Navigation with Marine Theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-shrink-0">
        <nav className="flex space-x-2 mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 text-center ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-teal-600 dark:hover:text-teal-400'
                }`
              }
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <Outlet />
      </main>

      {/* Footer with Marine Theme */}
      <footer className="mt-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <p className="text-sm text-gray-400">
                Backend API: <code className="bg-gray-700 px-2 py-1 rounded text-teal-400">http://localhost:3000/api</code>
              </p>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 FuelEU Maritime Compliance Module
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
