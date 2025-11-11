/**
 * PoolingTab Component
 * Compliance pooling operations (Article 21)
 * Create pools and view pool members
 */

import { useState } from 'react';
import { usePooling } from '../../../core/application';

export function PoolingTab() {
  const { pools, selectedPool, createPool, fetchPoolById, loading } = usePooling();
  
  // Ensure pools is an array (defensive programming)
  const safePools = Array.isArray(pools) ? pools : [];
  
  const [poolName, setPoolName] = useState('');
  const [year, setYear] = useState(2024);
  const [shipIds, setShipIds] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCreatePool = async () => {
    setMessage(null);
    
    // Parse ship IDs from comma-separated string
    const shipIdArray = shipIds.split(',').map(id => id.trim()).filter(id => id.length > 0);
    
    if (!poolName || shipIdArray.length < 2) {
      setMessage({ type: 'error', text: 'Pool name required and at least 2 ship IDs needed' });
      return;
    }

    const result = await createPool({ poolName, year, shipIds: shipIdArray });
    
    if (result) {
      setMessage({
        type: 'success',
        text: `Pool "${result.pool.poolName}" created with ${result.members.length} members. Total balance: ${result.pool.totalBalance.toFixed(2)} gCO₂e`
      });
      setPoolName('');
      setShipIds('');
    } else {
      setMessage({ type: 'error', text: 'Failed to create pool' });
    }
  };

  const handleViewPool = async (poolId: string) => {
    await fetchPoolById(poolId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg shadow-xl p-6 border border-blue-700">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <div>
              <h2 className="text-2xl font-bold text-white">Pooling Operations</h2>
              <p className="text-blue-200 mt-1">Article 21 - Create and manage compliance pools</p>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`rounded-lg p-4 border ${
            message.type === 'success'
              ? 'bg-green-900/30 border-green-600/50 text-green-300'
              : 'bg-red-900/30 border-red-600/50 text-red-300'
          }`}>
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {/* Summary Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Pools */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg shadow-lg p-6 border border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Total Pools</p>
                <p className="text-4xl font-bold text-white mt-2">{safePools.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Selected Pool Info */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium">Selected Pool</p>
                {selectedPool ? (
                  <>
                    <p className="text-2xl font-bold text-teal-400 mt-2">
                      {selectedPool.pool.poolName}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedPool.members.length} members • Balance: <span className="text-teal-300 font-semibold">{selectedPool.pool.totalBalance.toFixed(2)} gCO₂e</span>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 mt-2 italic">None selected</p>
                )}
              </div>
              <div className="bg-gray-700 p-3 rounded-full">
                <svg className="w-8 h-8 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Create Pool Form */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 text-teal-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Pool
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Pool Name */}
            <div>
              <label htmlFor="poolName" className="block text-sm font-medium text-gray-300 mb-2">
                Pool Name
              </label>
              <input
                id="poolName"
                type="text"
                value={poolName}
                onChange={(e) => setPoolName(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="e.g., Fleet Pool 2024"
              />
            </div>

            {/* Year */}
            <div>
              <label htmlFor="poolYear" className="block text-sm font-medium text-gray-300 mb-2">
                Year
              </label>
              <input
                id="poolYear"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="e.g., 2024"
              />
            </div>

            {/* Ship IDs - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="shipIds" className="block text-sm font-medium text-gray-300 mb-2">
                Ship IDs (comma-separated, min 2)
              </label>
              <textarea
                id="shipIds"
                value={shipIds}
                onChange={(e) => setShipIds(e.target.value)}
                rows={3}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all"
                placeholder="e.g., SHIP-001, SHIP-002, SHIP-003"
              />
              <p className="text-sm text-gray-400 mt-2">
                Enter ship IDs separated by commas. At least 2 ships are required.
              </p>
            </div>

            {/* Submit Button - Full Width */}
            <div className="md:col-span-2">
              <button
                onClick={handleCreatePool}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Pool...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Create Pool</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Pools List */}
        {safePools.length > 0 && (
          <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-800 to-blue-900 border-b border-blue-700">
              <h3 className="text-lg font-bold text-white">Active Pools</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Pool ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Pool Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {safePools.map((pool) => (
                    <tr key={pool.poolId} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                        {pool.poolId.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {pool.poolName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {pool.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${
                          pool.totalBalance >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {pool.totalBalance.toFixed(2)} gCO₂e
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewPool(pool.poolId)}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition-colors"
                        >
                          View Members
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Pool Members */}
        {selectedPool && selectedPool.members.length > 0 && (
          <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 border-b border-teal-500">
              <h3 className="text-lg font-bold text-white">
                Pool Members: {selectedPool.pool.poolName}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Member ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ship ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Contribution Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Allocated Surplus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Net Position
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {selectedPool.members.map((member) => {
                    const netPosition = member.contributionBalance + member.allocatedSurplus;
                    return (
                      <tr key={member.memberId} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                          {member.memberId.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {member.shipId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={member.contributionBalance >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {member.contributionBalance.toFixed(2)} gCO₂e
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {member.allocatedSurplus.toFixed(2)} gCO₂e
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={netPosition >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {netPosition.toFixed(2)} gCO₂e
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {safePools.length === 0 && (
          <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
            <svg className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-300">No pools created yet</h3>
            <p className="mt-2 text-sm text-gray-400 italic">Use the form above to define your first compliance pool!</p>
          </div>
        )}
      </div>
    </div>
  );
}
