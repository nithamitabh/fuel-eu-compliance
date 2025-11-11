# FuelEU Compliance - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:3001`

### Installation & Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies (if not already done)
npm install

# 3. Start development server
npm run dev
```

The app will open at **http://localhost:5173**

---

## 📱 Application Tour

### Routes Tab (Default)
**URL**: `http://localhost:5173/`

**What you'll see**:
- Table of all routes with vessel data
- "Set Baseline" buttons
- Refresh button

**Try this**:
1. View route details in the table
2. Click "Set Baseline" on any route (not yet connected to backend)
3. Click "Refresh" to reload data

---

### Compare Tab
**URL**: `http://localhost:5173/compare`

**What you'll see**:
- 3 KPI cards (Target, Baseline Avg, Current Avg)
- Bar chart comparing intensities
- Detailed comparison table with ✅/❌

**Try this**:
1. View the target intensity (89.3368 gCO₂e/MJ)
2. Check if routes are compliant in the table
3. Analyze the bar chart visualization

---

### Banking Tab
**URL**: `http://localhost:5173/banking`

**What you'll see**:
- Compliance balance KPI (changes color based on surplus/deficit)
- Total banked surplus
- Banking operations form
- Banking history table

**Try this**:
1. Enter Ship ID: `SHIP-001`, Year: `2024`
2. Click "Compute Compliance"
3. If balance > 0: Click "Bank Surplus"
4. If balance < 0 and banked surplus available: Click "Apply Banked Surplus"
5. View banking history below

---

### Pooling Tab
**URL**: `http://localhost:5173/pooling`

**What you'll see**:
- Total pools count
- Create pool form
- Active pools table
- Pool members table (after selecting a pool)

**Try this**:
1. Fill in:
   - Pool Name: `Fleet Pool 2024`
   - Year: `2024`
   - Ship IDs: `SHIP-001, SHIP-002, SHIP-003`
2. Click "Create Pool"
3. View created pool in the table
4. Click "View Members" to see allocation details

---

## 🎨 Features

### ✅ Fully Functional
- All 4 tabs with navigation
- Data fetching from backend API
- Loading spinners
- Error handling with retry
- Success/error messages
- Form validation
- Responsive design
- Dark mode support

### 📊 Visualizations
- **KPI Cards**: Dynamic colors based on data
- **Bar Chart**: Recharts integration for comparison
- **Tables**: Sortable, responsive data tables
- **Badges**: Status indicators (Baseline, Active, Expired, etc.)

### 🎯 Smart Features
- **Auto-refresh**: Click refresh buttons to reload data
- **Conditional buttons**: Disabled when conditions not met
- **Color coding**: Green for surplus, red for deficit
- **Tooltips**: Hover for additional info
- **Empty states**: Helpful messages when no data

---

## 🛠️ Development

### Available Scripts

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Project Structure

```
frontend/src/
├── adapters/
│   ├── infrastructure/api/    # API client
│   └── ui/components/         # UI components (Phase 4)
│       ├── Layout.tsx
│       ├── RoutesTab.tsx
│       ├── CompareTab.tsx
│       ├── BankingTab.tsx
│       └── PoolingTab.tsx
├── core/
│   ├── domain/                # Types/entities
│   ├── ports/                 # Interfaces
│   └── application/           # Custom hooks
├── App.tsx                    # Router setup
└── main.tsx                   # Entry point
```

---

## 🔧 Configuration

### API Base URL

Default: `http://localhost:3001/api`

To change, update `apiClient.ts`:

```typescript
constructor(baseURL: string = 'YOUR_API_URL')
```

### Backend Connection

Make sure the backend is running:

```bash
cd ../backend
npm run dev
```

Backend should be accessible at `http://localhost:3001/api`

---

## 💡 Tips

### Testing Without Backend
The app will show error states if backend is not running. You can still:
- Navigate between tabs
- See the UI layout
- Test responsive design
- Toggle dark mode (if implemented)

### Dark Mode
The app automatically supports dark mode using TailwindCSS `dark:` variants.

### Responsive Design
Try resizing your browser or opening on mobile devices. All components are fully responsive.

---

## 📚 Documentation

- **PHASE3_COMPLETE.md** - Core & API adapter documentation
- **PHASE4_COMPLETE.md** - UI components documentation
- **README.md** - General frontend documentation

---

## 🎯 Common Tasks

### View Routes
1. Go to Routes tab (default)
2. Data loads automatically
3. Click refresh if needed

### Compare Routes
1. Go to Compare tab
2. View KPIs and chart
3. Check compliance in table

### Bank Surplus
1. Go to Banking tab
2. Compute compliance first
3. Bank surplus if CB > 0

### Create Pool
1. Go to Pooling tab
2. Fill in form (min 2 ships)
3. Submit to create pool

---

## 🐛 Troubleshooting

### API Connection Failed
**Error**: "No response from server"  
**Fix**: Start the backend server

### Routes Not Loading
**Error**: "Failed to fetch routes"  
**Fix**: Check backend is running and database is seeded

### Build Errors
**Error**: TypeScript compilation errors  
**Fix**: Run `npm install` to ensure dependencies are installed

---

## 🎉 Success!

You now have a fully functional FuelEU Compliance frontend application with:

✅ 4 interactive tabs  
✅ Data visualization  
✅ Form handling  
✅ Error states  
✅ Responsive design  
✅ Dark mode  
✅ Production-ready build  

**Happy compliance tracking!** 🚢📊
