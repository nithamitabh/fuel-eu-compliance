# Frontend - Phase 3: Core & API Adapter

## ✅ Completed Tasks

### 1. Domain Layer (`/core/domain`)
Created domain entities matching backend types:
- ✅ `route.entity.ts` - Route type with all fuel/emissions properties
- ✅ `shipCompliance.entity.ts` - ShipCompliance and ComplianceStatus types
- ✅ `banking.entity.ts` - BankingRecord and banking operation types
- ✅ `pool.entity.ts` - Pool and PoolMember types for Article 21
- ✅ `index.ts` - Central exports

### 2. Ports Layer (`/core/ports`)
Defined API port interface:
- ✅ `IComplianceApi.ts` - Complete API contract with 20+ methods
  - Routes: CRUD operations + comparison endpoint
  - Compliance: Compute, fetch by ship/year
  - Banking: Bank surplus, apply surplus, get available
  - Pools: Create, fetch, get members
- ✅ `index.ts` - Central exports

### 3. Infrastructure Adapter (`/adapters/infrastructure/api`)
Implemented API client:
- ✅ `apiClient.ts` - Full axios-based implementation
  - Base URL: `http://localhost:3001/api`
  - Error handling with custom `ApiError` class
  - Response interceptor for centralized error management
  - All 20+ endpoints implemented
  - Singleton pattern with exported `apiClient` instance
- ✅ `index.ts` - Central exports

### 4. Application Layer (`/core/application`)
Created custom React hooks:
- ✅ `useRoutes.ts` - Fetch and manage routes data
- ✅ `useComparison.ts` - Fetch route comparison data
- ✅ `useCompliance.ts` - Compute and fetch compliance data
- ✅ `useBanking.ts` - Banking surplus operations
- ✅ `usePooling.ts` - Pooling operations
- ✅ `index.ts` - Central exports

---

## 📂 Frontend Structure

```
frontend/src/
├── core/
│   ├── domain/               # Domain entities (types)
│   │   ├── route.entity.ts
│   │   ├── shipCompliance.entity.ts
│   │   ├── banking.entity.ts
│   │   ├── pool.entity.ts
│   │   └── index.ts
│   ├── ports/                # Port interfaces
│   │   ├── IComplianceApi.ts
│   │   └── index.ts
│   └── application/          # Custom hooks
│       ├── useRoutes.ts
│       ├── useComparison.ts
│       ├── useCompliance.ts
│       ├── useBanking.ts
│       ├── usePooling.ts
│       └── index.ts
├── adapters/
│   ├── infrastructure/
│   │   └── api/              # API client adapter
│   │       ├── apiClient.ts
│   │       └── index.ts
│   └── ui/
│       └── components/       # (Ready for next phase)
├── App.tsx
└── main.tsx
```

---

## 🔧 Architecture Highlights

### Hexagonal Architecture (Ports & Adapters)
- **Domain Layer**: Pure TypeScript types, zero dependencies
- **Ports**: Interfaces defining contracts (IComplianceApi)
- **Adapters**: Concrete implementations (ApiClient)
- **Application**: React hooks using ports (dependency inversion)

### Key Features
1. **Type Safety** - Full TypeScript coverage with strict types
2. **Error Handling** - Centralized error management with custom ApiError
3. **React Best Practices**:
   - `useState` for state management
   - `useCallback` for memoized functions
   - `useEffect` for side effects
4. **Separation of Concerns** - Clear boundaries between layers
5. **Testability** - Hooks can be tested with mock API clients

---

## 🎯 How to Use the Hooks

### Example: Fetch Routes
```tsx
import { useRoutes } from './core/application';

function RoutesPage() {
  const { routes, loading, error, refetch } = useRoutes();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Routes</h1>
      <button onClick={refetch}>Refresh</button>
      {routes.map(route => (
        <div key={route.routeId}>{route.vesselType}</div>
      ))}
    </div>
  );
}
```

### Example: Bank Surplus
```tsx
import { useBanking } from './core/application';

function BankingPage() {
  const { bankSurplus, loading, error } = useBanking();

  const handleBank = async () => {
    const result = await bankSurplus({
      shipId: 'SHIP-001',
      year: 2024
    });
    
    if (result) {
      console.log('Banked:', result.bankedAmount);
    }
  };

  return (
    <button onClick={handleBank} disabled={loading}>
      Bank Surplus
    </button>
  );
}
```

### Example: Create Pool
```tsx
import { usePooling } from './core/application';

function PoolingPage() {
  const { createPool, pools, loading } = usePooling();

  const handleCreatePool = async () => {
    const result = await createPool({
      poolName: 'Fleet Pool 2024',
      year: 2024,
      shipIds: ['SHIP-001', 'SHIP-002', 'SHIP-003']
    });
    
    if (result) {
      console.log('Pool created:', result.pool.poolId);
    }
  };

  return (
    <div>
      <h1>Pools ({pools.length})</h1>
      <button onClick={handleCreatePool}>Create Pool</button>
    </div>
  );
}
```

---

## 🧪 Testing the API Client

You can test the API client manually:

```typescript
import { apiClient } from './adapters/infrastructure/api';

// Test connection
apiClient.getRoutes()
  .then(routes => console.log('Routes:', routes))
  .catch(err => console.error('Error:', err.message));

// Test compliance computation
apiClient.computeCompliance({ shipId: 'SHIP-001', year: 2024 })
  .then(result => console.log('Compliance:', result))
  .catch(err => console.error('Error:', err.message));
```

---

## 📋 API Endpoints Coverage

### Routes (6 endpoints)
- ✅ GET `/routes` - Get all routes
- ✅ GET `/routes/:id` - Get route by ID
- ✅ POST `/routes` - Create route
- ✅ PUT `/routes/:id` - Update route
- ✅ DELETE `/routes/:id` - Delete route
- ✅ GET `/routes/comparison/data` - Get comparison data

### Compliance (4 endpoints)
- ✅ GET `/compliance/ship/:shipId/year/:year` - Get compliance
- ✅ POST `/compliance/compute` - Compute compliance
- ✅ GET `/compliance/ship/:shipId` - Get compliance history
- ✅ GET `/compliance/year/:year` - Get year compliance

### Banking (4 endpoints)
- ✅ GET `/banking/ship/:shipId` - Get banking records
- ✅ POST `/banking/bank` - Bank surplus
- ✅ POST `/banking/apply` - Apply banked surplus
- ✅ GET `/banking/ship/:shipId/available` - Get available surplus

### Pools (4 endpoints)
- ✅ GET `/pools` - Get all pools
- ✅ GET `/pools/:id` - Get pool by ID
- ✅ POST `/pools` - Create pool
- ✅ GET `/pools/:id/members` - Get pool members

**Total: 18 API endpoints implemented**

---

## ✨ Next Steps

Ready for **Phase 4: UI Components**:
1. Create reusable UI components in `/adapters/ui/components`
2. Build pages using the custom hooks
3. Add form components for data input
4. Implement data visualization (charts/tables)
5. Add routing with React Router
6. Style with TailwindCSS

---

## 🎉 Phase 3 Complete!

All core logic and API communication is now in place:
- ✅ Domain types defined
- ✅ API port interface created
- ✅ API client adapter implemented
- ✅ 5 custom React hooks ready to use
- ✅ Full TypeScript type safety
- ✅ Error handling throughout
- ✅ Hexagonal architecture maintained

The frontend is now ready to consume the backend API! 🚀
