/**
 * Demo Component
 * Demonstrates how to use all custom hooks
 * Remove this file when building actual UI
 */

import { useRoutes, useComparison, useCompliance, useBanking, usePooling } from './core/application';

export function DemoHooks() {
  // Example 1: Fetch routes
  const { routes, loading: routesLoading, error: routesError, refetch } = useRoutes();

  // Example 2: Fetch comparison data
  const { comparisonData, loading: comparisonLoading } = useComparison();

  // Example 3: Compliance operations
  const { computeCompliance, complianceData, loading: complianceLoading } = useCompliance();

  // Example 4: Banking operations
  const { bankSurplus, applyBankedSurplus, loading: bankingLoading } = useBanking();

  // Example 5: Pooling operations
  const { pools, createPool, loading: poolingLoading } = usePooling();

  const handleComputeCompliance = async () => {
    const result = await computeCompliance({ shipId: 'SHIP-001', year: 2024 });
    if (result) {
      console.log('Compliance computed:', result);
    }
  };

  const handleBankSurplus = async () => {
    const result = await bankSurplus({ shipId: 'SHIP-001', year: 2024 });
    if (result) {
      console.log('Surplus banked:', result);
    }
  };

  const handleApplyBankedSurplus = async () => {
    const result = await applyBankedSurplus({ shipId: 'SHIP-001', year: 2024 });
    if (result) {
      console.log('Banked surplus applied:', result);
    }
  };

  const handleCreatePool = async () => {
    const result = await createPool({
      poolName: 'Test Pool',
      year: 2024,
      shipIds: ['SHIP-001', 'SHIP-002'],
    });
    if (result) {
      console.log('Pool created:', result);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">FuelEU Compliance API Demo</h1>

      {/* Routes Section */}
      <section className="border p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Routes</h2>
        {routesLoading && <p className="text-gray-500">Loading routes...</p>}
        {routesError && <p className="text-red-500">Error: {routesError}</p>}
        {!routesLoading && !routesError && (
          <>
            <p className="mb-4">Total routes: {routes.length}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Routes
            </button>
          </>
        )}
      </section>

      {/* Comparison Section */}
      <section className="border p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Route Comparison</h2>
        {comparisonLoading && <p className="text-gray-500">Loading comparison data...</p>}
        {!comparisonLoading && (
          <p>Comparison routes: {comparisonData.length}</p>
        )}
      </section>

      {/* Compliance Section */}
      <section className="border p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Compliance Operations</h2>
        <div className="space-x-4">
          <button
            onClick={handleComputeCompliance}
            disabled={complianceLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {complianceLoading ? 'Computing...' : 'Compute Compliance'}
          </button>
        </div>
        {complianceData && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Status: {complianceData.status}</p>
            <p>Balance: {complianceData.complianceBalance.toFixed(2)}</p>
          </div>
        )}
      </section>

      {/* Banking Section */}
      <section className="border p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Banking Operations</h2>
        <div className="space-x-4">
          <button
            onClick={handleBankSurplus}
            disabled={bankingLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {bankingLoading ? 'Banking...' : 'Bank Surplus'}
          </button>
          <button
            onClick={handleApplyBankedSurplus}
            disabled={bankingLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {bankingLoading ? 'Applying...' : 'Apply Banked Surplus'}
          </button>
        </div>
      </section>

      {/* Pooling Section */}
      <section className="border p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Pooling Operations</h2>
        <p className="mb-4">Total pools: {pools.length}</p>
        <button
          onClick={handleCreatePool}
          disabled={poolingLoading}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          {poolingLoading ? 'Creating...' : 'Create Pool'}
        </button>
      </section>

      {/* API Info */}
      <section className="border p-6 rounded-lg bg-blue-50">
        <h2 className="text-2xl font-semibold mb-4">ℹ️ API Information</h2>
        <p className="mb-2">
          <strong>Backend URL:</strong> http://localhost:3001/api
        </p>
        <p className="mb-2">
          <strong>Note:</strong> Make sure the backend server is running before testing these operations.
        </p>
        <p className="text-sm text-gray-600">
          Check the browser console for detailed API response logs.
        </p>
      </section>
    </div>
  );
}
