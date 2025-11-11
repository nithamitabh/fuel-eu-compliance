/**
 * BankingTab Component
 * Banking surplus operations (Article 20)
 * Displays KPIs and forms for banking/applying surplus
 */

import { useState } from 'react';
import { useBanking, useCompliance } from '../../../core/application';

export function BankingTab() {
  const { bankSurplus, applyBankedSurplus, fetchBankingRecords, bankingRecords, loading } = useBanking();
  const { computeCompliance, complianceData } = useCompliance();
  
  // Ensure bankingRecords is an array (defensive programming)
  const safeBankingRecords = Array.isArray(bankingRecords) ? bankingRecords : [];
  
  const [shipId, setShipId] = useState('SHIP-001');
  const [year, setYear] = useState(2024);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleComputeCompliance = async () => {
    setMessage(null);
    const result = await computeCompliance({ shipId, year });
    if (result) {
      setMessage({ type: 'success', text: 'Compliance computed successfully!' });
      await fetchBankingRecords(shipId);
    } else {
      setMessage({ type: 'error', text: 'Failed to compute compliance' });
    }
  };

  const handleBankSurplus = async () => {
    setMessage(null);
    const result = await bankSurplus({ shipId, year });
    if (result) {
      setMessage({
        type: 'success',
        text: `Banked ${result.bankedAmount.toFixed(2)} gCO₂e. Expires in ${result.expiryYear}.`
      });
      await computeCompliance({ shipId, year });
    } else {
      setMessage({ type: 'error', text: 'Failed to bank surplus' });
    }
  };

  const handleApplySurplus = async () => {
    setMessage(null);
    const result = await applyBankedSurplus({ shipId, year });
    if (result) {
      setMessage({
        type: 'success',
        text: `Applied banked surplus. New balance: ${result.complianceBalance.toFixed(2)} gCO₂e`
      });
      await computeCompliance({ shipId, year });
    } else {
      setMessage({ type: 'error', text: 'Failed to apply banked surplus' });
    }
  };

  const cbBefore = complianceData?.complianceBalance || 0;
  const isSurplus = cbBefore > 0;
  const isDeficit = cbBefore < 0;
  const totalBanked = safeBankingRecords
    .filter(r => !r.isExpired)
    .reduce((sum, r) => sum + r.bankedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Banking Operations</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Article 20 - Bank surplus or apply banked surplus to deficits
        </p>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <p className={`text-sm ${
            message.type === 'success'
              ? 'text-green-800 dark:text-green-300'
              : 'text-red-800 dark:text-red-300'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance Balance */}
        <div className={`rounded-lg shadow-lg p-6 ${
          isSurplus
            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
            : isDeficit
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
            : 'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Compliance Balance</p>
              <p className="text-3xl font-bold mt-2">{cbBefore.toFixed(2)}</p>
              <p className="text-white/80 text-xs mt-1">gCO₂e</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              {isSurplus ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <p className="text-white/80 text-sm mt-3">
            {isSurplus ? '✅ Surplus' : isDeficit ? '❌ Deficit' : '⚪ Compliant'}
          </p>
        </div>

        {/* Total Banked */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Banked</p>
              <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">{totalBanked.toFixed(2)}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">gCO₂e</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {safeBankingRecords.filter(r => !r.isExpired).length} active records
          </p>
        </div>

        {/* Banking Records */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Banking Records</p>
              <p className="text-3xl font-bold mt-2 text-purple-600 dark:text-purple-400">{safeBankingRecords.length}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">total</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {safeBankingRecords.filter(r => r.isExpired).length} expired
          </p>
        </div>
      </div>

      {/* Operations Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Operations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Ship ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ship ID
            </label>
            <input
              type="text"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., SHIP-001"
            />
          </div>

          {/* Year Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 2024"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleComputeCompliance}
            disabled={loading}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Computing...' : 'Compute Compliance'}
          </button>

          <button
            onClick={handleBankSurplus}
            disabled={loading || !isSurplus}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isSurplus ? 'Requires surplus (CB > 0)' : ''}
          >
            {loading ? 'Banking...' : 'Bank Surplus'}
          </button>

          <button
            onClick={handleApplySurplus}
            disabled={loading || !isDeficit || totalBanked <= 0}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isDeficit ? 'Requires deficit (CB < 0)' : totalBanked <= 0 ? 'No banked surplus available' : ''}
          >
            {loading ? 'Applying...' : 'Apply Banked Surplus'}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          <strong>Note:</strong> Bank Surplus requires CB &gt; 0. Apply Surplus requires CB &lt; 0 and available banked surplus.
        </p>
      </div>

      {/* Banking Records Table */}
      {safeBankingRecords.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Banking History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Banking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Banked Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Expiry Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {safeBankingRecords.map((record) => (
                  <tr key={record.bankingId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                      {record.bankingId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.bankedAmount.toFixed(2)} gCO₂e
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.expiryYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.isExpired ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
