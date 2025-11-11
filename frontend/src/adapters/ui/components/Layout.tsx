/**
 * Layout Component
 * Main application layout with 4 tabs: Routes, Compare, Banking, Pooling
 * Uses React Router v6 for navigation and TailwindCSS for styling
 */

import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  const tabs = [
    { name: 'Routes', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: 'Banking', path: '/banking' },
    { name: 'Pooling', path: '/pooling' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            FuelEU Maritime Compliance
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Article 20 & 21 - Banking and Pooling Operations
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Backend API: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">http://localhost:3001/api</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
