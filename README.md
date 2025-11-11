# FuelEU Maritime Compliance System

A full-stack web application for managing FuelEU Maritime Regulation (EU) 2023/1805 compliance, built with hexagonal architecture principles for both frontend and backend.

## 📋 Overview

The FuelEU Maritime Compliance System helps shipping companies track and manage their compliance with EU maritime fuel regulations. The application provides comprehensive tools for:

- **Route Management**: Track vessel routes with fuel consumption and GHG intensity data
- **Compliance Calculation**: Compute compliance balance (CB) per ship and year
- **Banking (Article 20)**: Bank compliance surplus for future use or apply to deficits
- **Pooling (Article 21)**: Create compliance pools to distribute surplus across multiple vessels
- **Comparison Analytics**: Compare baseline vs. current vessel performance against the 89.3368 gCO₂e/MJ target

## 🏗️ Architecture

Both frontend and backend follow **Hexagonal Architecture** (Ports & Adapters pattern) for clean separation of concerns, testability, and framework independence.

### Backend Architecture

```
backend/
├── src/
│   ├── core/                     # Business logic (framework-independent)
│   │   ├── domain/              # Entities, value objects, constants
│   │   │   ├── banking.entity.ts
│   │   │   ├── pool.entity.ts
│   │   │   ├── route.entity.ts
│   │   │   ├── shipCompliance.entity.ts
│   │   │   └── constants.ts
│   │   ├── application/         # Use cases (business operations)
│   │   │   ├── computeComplianceBalance.usecase.ts
│   │   │   ├── bankSurplus.usecase.ts
│   │   │   ├── applyBankedSurplus.usecase.ts
│   │   │   └── createPool.usecase.ts
│   │   └── ports/               # Repository interfaces
│   │       ├── banking.repository.ts
│   │       ├── compliance.repository.ts
│   │       ├── pool.repository.ts
│   │       └── route.repository.ts
│   ├── adapters/
│   │   ├── inbound/             # HTTP routers (Express)
│   │   │   └── http/
│   │   │       ├── routes.router.ts
│   │   │       ├── compliance.router.ts
│   │   │       ├── banking.router.ts
│   │   │       └── pools.router.ts
│   │   └── outbound/            # Database repositories (Prisma)
│   │       └── postgres/
│   │           ├── prismaRoute.repository.ts
│   │           ├── prismaCompliance.repository.ts
│   │           ├── prismaBanking.repository.ts
│   │           └── prismaPool.repository.ts
│   └── infrastructure/          # Server setup, dependency injection
│       ├── server/app.ts
│       └── db/prisma.ts
└── prisma/
    ├── schema.prisma            # Database schema
    └── seed.ts                  # Sample data
```

**Key Principles**:
- **Core Domain**: Zero framework dependencies, pure TypeScript business logic
- **Ports**: Interfaces defining contracts between layers
- **Adapters**: Concrete implementations (HTTP/Express, Database/Prisma)
- **Infrastructure**: Wires everything together via dependency injection

### Frontend Architecture

```
frontend/
├── src/
│   ├── core/
│   │   ├── domain/              # Types, entities, value objects
│   │   │   ├── route.entity.ts
│   │   │   ├── shipCompliance.entity.ts
│   │   │   ├── banking.entity.ts
│   │   │   ├── pool.entity.ts
│   │   │   └── index.ts
│   │   ├── ports/               # API service interfaces
│   │   │   ├── IComplianceApi.ts
│   │   │   └── index.ts
│   │   └── application/         # Custom hooks (use cases)
│   │       ├── useRoutes.ts
│   │       ├── useComparison.ts
│   │       ├── useCompliance.ts
│   │       ├── useBanking.ts
│   │       └── usePooling.ts
│   ├── adapters/
│   │   ├── infrastructure/api/  # HTTP client (Axios)
│   │   │   └── apiClient.ts
│   │   └── ui/
│   │       ├── components/      # React components
│   │       │   ├── Layout.tsx
│   │       │   ├── RoutesTab.tsx
│   │       │   ├── CompareTab.tsx
│   │       │   ├── BankingTab.tsx
│   │       │   └── PoolingTab.tsx
│   │       └── pages/
│   │           └── LandingPage.tsx
│   └── App.tsx                  # Router and app setup
```

**Key Principles**:
- **Core Domain**: Framework-agnostic business logic and types
- **Ports**: API service interfaces (IComplianceApi)
- **Adapters**: UI (React) and API (Axios) implementations
- **Custom Hooks**: Bridge between UI components and business logic

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (version 12+)

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Edit .env with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/fueleu_db"
# PORT=3000
# NODE_ENV=development

# 5. Run database migrations
npx prisma migrate dev

# 6. Seed database with sample data (optional)
npx prisma db seed

# 7. Start development server
npm run dev
```

Backend API will be available at `http://localhost:3000`

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173` (or `http://localhost:5174` if 5173 is in use)

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run all unit tests
npm test

# Run specific test suite
npm test -- computeCompliance
npm test -- bankSurplus
npm test -- applyBanked
npm test -- createPool

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage**:
- ✅ **17 unit tests** passing (~8 seconds)
- ✅ `ComputeComplianceBalanceUseCase` - 4 tests
- ✅ `BankSurplusUseCase` - 4 tests
- ✅ `ApplyBankedSurplusUseCase` - 4 tests
- ✅ `CreatePoolUseCase` - 5 tests

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Coverage**:
- ✅ **40 tests** passing (8 test files)
- ✅ **46.5% overall coverage**, 100% on core tested components
- ✅ Testing Stack: Vitest + @testing-library/react + jsdom

**Test Files**:

*Hook Tests (4 files):*
- `useRoutes.test.ts` - 5 tests (100% coverage)
- `useComparison.test.ts` - 5 tests (100% coverage)
- `useBanking.test.ts` - 5 tests
- `usePooling.test.ts` - 5 tests

*Component Tests (4 files):*
- `RoutesTab.test.tsx` - 6 tests (82% coverage)
- `CompareTab.test.tsx` - 8 tests (100% coverage)
- `BankingTab.test.tsx` - 3 tests
- `PoolingTab.test.tsx` - 3 tests

**Features Tested**:
- ✅ Loading states
- ✅ Error handling
- ✅ Data rendering
- ✅ Empty states
- ✅ Defensive programming (null/undefined handling)
- ✅ API mocking
- ✅ Custom hook mocking
- ✅ Chart component mocking (Recharts)

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health & Info
- `GET /health` - Server health check
- `GET /` - API information and available endpoints

### Routes Endpoints
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `POST /api/routes/:id/baseline` - Set route as baseline
- `GET /api/routes/comparison/data` - Get baseline vs current comparison data

### Compliance Endpoints
- `GET /api/compliance/ship/:shipId/year/:year` - Get compliance record for ship/year
- `POST /api/compliance/compute` - Compute compliance balance
  ```json
  {
    "shipId": "SHIP-001",
    "year": 2024
  }
  ```
- `GET /api/compliance/ship/:shipId` - Get all compliance records for a ship
- `GET /api/compliance/year/:year` - Get all compliance records for a year

### Banking Endpoints (Article 20)
- `POST /api/banking/bank` - Bank compliance surplus
  ```json
  {
    "shipId": "SHIP-001",
    "year": 2024
  }
  ```
- `POST /api/banking/apply` - Apply banked surplus to deficit
  ```json
  {
    "shipId": "SHIP-001",
    "year": 2024
  }
  ```
- `GET /api/banking/ship/:shipId` - Get banking records for ship

### Pooling Endpoints (Article 21)
- `POST /api/pools` - Create compliance pool
  ```json
  {
    "poolName": "North Sea Pool",
    "year": 2024,
    "shipIds": ["SHIP-001", "SHIP-002", "SHIP-003"]
  }
  ```
- `GET /api/pools` - Get all pools
- `GET /api/pools/:id` - Get pool details
- `GET /api/pools/:id/members` - Get pool members

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** + **TypeScript** | Runtime and type-safe language |
| **Express** | HTTP server and routing |
| **Prisma** | Type-safe database ORM |
| **PostgreSQL** | Relational database |
| **Jest** | Testing framework |
| **ts-node-dev** | Development server with hot reload |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with modern hooks |
| **TypeScript** | Type safety and IntelliSense |
| **Vite 7** | Build tool and dev server |
| **TailwindCSS v4** | Utility-first CSS framework |
| **Axios** | HTTP client for API calls |
| **Recharts** | Data visualization library |
| **React Router v6** | Client-side routing |

## 📱 Application Features

### Landing Page
- Marine-themed design with navy blue and teal colors
- Overview of platform capabilities
- 4-step "How to Use" guide
- Links to dashboard

### Routes Tab 🗺️
- View all vessel routes in a responsive table
- 10 columns: Route ID, Vessel Type, Fuel Type, Year, GHG Intensity, Fuel Consumption, Distance, Total Emissions, Baseline Status, Actions
- Set baseline routes for compliance comparison
- Loading states and error handling

### Compare Tab 📊
- **KPI Cards**: Target (89.3368), Baseline Average, Current Average
- **Bar Chart**: Visual comparison using Recharts
- **Comparison Table**: Side-by-side route comparison with:
  - Baseline/Current indicators
  - GHG intensity values
  - % difference from target
  - ✅/❌ compliance indicators

### Banking Tab 🏦
- **3 KPI Cards**:
  - Compliance Balance (color-coded: green for surplus, red for deficit)
  - Total Banked amount
  - Banking Records count
- **Operations Panel**:
  - Compute Compliance button
  - Bank Surplus button (disabled if CB ≤ 0)
  - Apply Banked Surplus button (disabled if CB ≥ 0 or no banked surplus)
- **Banking History Table**: All banking transactions with dates and amounts

### Pooling Tab 👥
- **Stats Cards**: Total Pools, Active Members
- **Create Pool Form**:
  - Pool name input
  - Year selection
  - Ship IDs (comma-separated, min 2 required)
  - Client-side validation
- **Active Pools Table**: List of all pools with member count
- **Pool Members Table**: Dynamic display showing:
  - Ship IDs
  - Contribution balance
  - Allocated surplus
  - Net position (color-coded)

## 🎨 Design System

### Color Palette (Marine Theme)
- **Navy Blue** (#1e3a8a): Primary color, headers, authority
- **Teal** (#14b8a6): Accent color, CTAs, highlights
- **Amber** (#fef3c7): Background, warmth
- **Green** (#10b981): Success, surplus
- **Red** (#ef4444): Error, deficit
- **Purple** (#a855f7): Pooling features

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

Build output will be in `frontend/dist/`:
- Bundle size: ~657 KB (198 KB gzipped)
- CSS size: ~43 KB (7.34 KB gzipped)
- 726 modules transformed

## 📁 Project Structure

```
fuel-eu-compliance/
├── backend/                 # Node.js + Express + Prisma
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── README.md
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── README.md               # This file
└── .gitignore
```

## 📖 Additional Documentation

### General
- [`AGENT_WORKFLOW.md`](AGENT_WORKFLOW.md) - Development workflow and conventions
- [`REFLECTION.md`](REFLECTION.md) - Architecture decisions and rationale

### Backend
- [`backend/README.md`](backend/README.md) - Backend API detailed documentation
- [`backend/TEST_SUMMARY.md`](backend/TEST_SUMMARY.md) - Comprehensive test coverage report

### Frontend
- [`frontend/README.md`](frontend/README.md) - Frontend architecture overview
- [`frontend/QUICKSTART.md`](frontend/QUICKSTART.md) - Quick start guide for users
- [`frontend/VISUAL_GUIDE.md`](frontend/VISUAL_GUIDE.md) - UI/UX design guide
- [`frontend/LANDING_PAGE_COMPLETE.md`](frontend/LANDING_PAGE_COMPLETE.md) - Landing page documentation
- [`frontend/PHASE3_COMPLETE.md`](frontend/PHASE3_COMPLETE.md) - Core domain & API layer
- [`frontend/PHASE4_COMPLETE.md`](frontend/PHASE4_COMPLETE.md) - UI components details
- [`frontend/TAILWIND_V4_FIX.md`](frontend/TAILWIND_V4_FIX.md) - Tailwind CSS v4 configuration

## 🔧 Development Workflow

### Backend Development
1. Make changes to core domain logic
2. Write/update tests
3. Run `npm test` to verify
4. Update routers/repositories if needed
5. Test via Postman/curl or frontend

### Frontend Development
1. Define types in `core/domain`
2. Create/update custom hooks in `core/application`
3. Build UI components in `adapters/ui`
4. Test in browser with hot reload
5. Verify responsive design

## 🐛 Troubleshooting

### Backend Issues

**Database connection errors:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify DATABASE_URL in .env
# Reset database
npx prisma migrate reset
```

**Port already in use:**
```bash
# Change PORT in .env
PORT=3001
```

### Frontend Issues

**Tailwind styles not loading:**
```bash
# Rebuild
npm run build

# Clear Vite cache
rm -rf node_modules/.vite
```

**API connection errors:**
- Verify backend is running on correct port
- Check `apiClient.ts` baseURL matches backend PORT

## 📊 Screenshots

_Screenshots to be added:_

1. **Landing Page** - Marine-themed hero with "Get Started" CTA
2. **Routes Tab** - Data table with 10 columns and Set Baseline action
3. **Compare Tab** - KPI cards + bar chart + comparison table
4. **Banking Tab** - 3 KPIs + operations form + banking history
5. **Pooling Tab** - Create form + pools table + members table

## 🤝 Contributing

This project follows hexagonal architecture principles. When contributing:

1. Keep core domain logic framework-independent
2. Define clear port interfaces
3. Implement adapters for external dependencies
4. Write tests for all use cases
5. Follow TypeScript strict mode
6. Use TailwindCSS utility classes (no custom CSS)

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Built with hexagonal architecture and modern web technologies for FuelEU Maritime Regulation compliance.

---

**Quick Start**: Run `cd backend && npm install && npm run dev` then `cd frontend && npm install && npm run dev`
