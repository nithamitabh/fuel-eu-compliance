
# AI Agent Workflow Log

This document details the complete development journey of the FuelEU Maritime compliance platform, including all interactions with GitHub Copilot AI agent throughout the entire project lifecycle.

---

## 📋 Complete Chat Session Summary

### Session Overview
This project went through **multiple comprehensive development phases** from initial debugging to full production-ready deployment with documentation. Below is a chronological summary of all major tasks completed.

---

## 🔧 Phase 1: Initial Bug Fixes & API Integration (Days 1-2)

### Problem: CORS and API Connection Issues
**Initial Error:** `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:3001/api/routes`

**Issues Identified:**
1. Port mismatch - Backend running on `:3000`, frontend trying `:3001`
2. API response format mismatch - Backend returns `{success: boolean, data: T}`, frontend expected raw data
3. Data structure errors - `routes.map is not a function`, `comparisonData.filter is not a function`

**Solutions Implemented:**
1. ✅ Updated `apiClient.ts` baseURL from `localhost:3001` to `localhost:3000`
2. ✅ Modified all **18 API methods** to unwrap `response.data.data` instead of `response.data`
   - Routes endpoints: 6 methods
   - Compliance endpoints: 4 methods
   - Banking endpoints: 4 methods
   - Pooling endpoints: 4 methods
3. ✅ Added defensive programming with `Array.isArray()` checks in 4 components:
   - `RoutesTab.tsx` - 3 fixes (safeRoutes)
   - `CompareTab.tsx` - 3 fixes (safeComparisonData)
   - `BankingTab.tsx` - 6 fixes (safeBankingRecords)
   - `PoolingTab.tsx` - 4 fixes (safePools)

**Outcome:** Frontend successfully connected to backend, all API calls working correctly.

---

## 🎨 Phase 2: Landing Page Creation (Day 3)

### Task: Build Marine-Themed Landing Page
**User Request:** "Build a single, responsive, marine-themed landing page with Hero section, How It Works cards, and Footer"

**Implementation:**
1. ✅ Created `LandingPage.tsx` (350 lines) with:
   - Hero section with navy gradient background
   - Teal cloud icon with hover animations
   - Main heading: "Navigate FuelEU Maritime Compliance"
   - "Get Started" CTA button
   - Wave SVG separator

2. ✅ "How to Use" section with 4 feature cards:
   - **Card 1:** Monitor Routes 🗺️ (Blue gradient)
   - **Card 2:** Compare & Comply 📊 (Teal gradient)
   - **Card 3:** Bank Your Surplus 🏦 (Green gradient)
   - **Card 4:** Pool Resources 👥 (Purple gradient)
   - Each card with icon, hover effects, and detailed description

3. ✅ Key Features section:
   - Real-time compliance calculations
   - Automatic GHG comparisons
   - Banking & pooling workflows
   - Full regulation compliance checkmarks

4. ✅ Tech Stack showcase:
   - Frontend: React + TypeScript
   - Backend: Node.js + Express
   - Database: PostgreSQL + Prisma
   - Design: TailwindCSS

5. ✅ Marine-themed footer:
   - Company info
   - Backend API reference
   - GitHub link
   - Copyright notice

**Files Created:**
- `/frontend/src/adapters/ui/pages/LandingPage.tsx` (350 lines)
- `/frontend/src/adapters/ui/pages/index.ts` (export file)
- `/frontend/LANDING_PAGE_COMPLETE.md` (documentation)
- `/frontend/VISUAL_GUIDE.md` (300 lines, UI/UX guide)

**Routing Updated:**
- Landing page at `/`
- Dashboard at `/dashboard/*` (routes, compare, banking, pooling)
- Updated `App.tsx` and `Layout.tsx` with marine theme

---

## 🎨 Phase 3: Tailwind CSS v4 Migration (Day 4)

### Problem: Styles Not Rendering
**User Report:** "Why css applied not evenly Currently these type of page check for tailwind configration"

**Issue:** Tailwind CSS v4 was installed but using v3 syntax, causing styles to not generate properly.

**Root Causes:**
1. Using `@tailwind` directives instead of `@import "tailwindcss"`
2. Had `tailwind.config.js` file (v4 uses CSS-based config)
3. `postcss.config.js` had redundant autoprefixer
4. `App.css` had conflicting Vite default styles

**Fixes Applied:**
1. ✅ **index.css**: Changed to Tailwind v4 syntax
   ```css
   @import "tailwindcss";
   
   @theme {
     --color-navy: #1e3a8a;
     --color-teal: #14b8a6;
     --color-amber: #fef3c7;
   }
   ```

2. ✅ **Deleted** `tailwind.config.js` (not needed in v4)

3. ✅ **postcss.config.js**: Removed autoprefixer (built into v4)
   ```js
   export default {
     plugins: {
       '@tailwindcss/postcss': {}
     }
   }
   ```

4. ✅ **App.css**: Removed all conflicting styles (max-width, text-align)

**Build Results:**
- **Before:** CSS bundle 7.88 kB
- **After:** CSS bundle 43.41 kB (5.5x increase!)
- **Proof:** All Tailwind utilities now generating correctly

**Documentation Created:**
- `/frontend/TAILWIND_V4_FIX.md` (~200 lines)

---

## 📚 Phase 4: Comprehensive Documentation (Day 5)

### Task: Create README.md
**User Request:** "Review my project structure. Generate a README.md with: Overview, Architecture summary, Setup & run instructions, Test instructions"

**Created:** `/README.md` with 10 major sections:

1. **📋 Overview** - Platform purpose and 5 main features
2. **🏗️ Architecture** - Complete hexagonal architecture explanation:
   - Backend structure (core/domain, application, ports, adapters)
   - Frontend structure (core/domain, ports, adapters/ui)
   - Key principles for both layers
3. **🚀 Setup & Installation** - Step-by-step for backend and frontend
4. **🧪 Running Tests** - Backend (17 unit tests) and frontend commands
5. **📚 API Documentation** - All 18 endpoints with examples
6. **🛠️ Tech Stack** - Tables of backend and frontend technologies
7. **📱 Application Features** - Detailed breakdown of all 5 tabs
8. **🎨 Design System** - Color palette and responsive breakpoints
9. **🚀 Production Build** - Build commands and metrics
10. **📖 Additional Documentation** - Links to 10+ other docs

**Metrics Included:**
- Build size: 657 KB JS (198 KB gzip), 43 KB CSS (7.34 KB gzip)
- Test coverage: 17 unit tests passing
- 726 modules transformed

---

## 🎯 Phase 5: Full-Page Layout Fixes (Day 6)

### Problem: UI Not Covering Full Page
**User Report:** "Still need to fix ui it even not cover full page, same with other routes"

**Issue:** Content not filling viewport height, footer floating in middle of page.

**Fixes Applied:**

1. ✅ **Layout.tsx** (Dashboard):
   ```tsx
   // Added flex flexbox to fill viewport
   <div className="min-h-screen ... flex flex-col">
     <header className="... flex-shrink-0">...</header>
     <nav className="... flex-shrink-0">...</nav>
     <main className="... flex-grow">...</main>  // Expands!
     <footer className="... mt-auto">...</footer> // Sticks to bottom
   </div>
   ```

2. ✅ **LandingPage.tsx**:
   ```tsx
   <div className="min-h-screen ... flex flex-col">
     <section className="... flex-shrink-0">Hero</section>
     <section className="... flex-grow">Content</section>  // Expands!
     <footer className="... mt-auto">Footer</footer>
   </div>
   ```

3. ✅ **index.css**:
   ```css
   html, body {
     height: 100%;
   }
   
   #root {
     min-height: 100vh;
     display: flex;
     flex-direction: column;
   }
   ```

**Result:** All pages now properly fill the entire viewport with footer always at bottom.

---

## 🎨 Phase 6: Professional Pooling Tab Redesign (Day 7)

### Task: Refactor Pooling Tab with Marine Theme
**User Request:** "Refactor the Pooling Operations UI. Apply professional marine theme using navy blue, teal, dark gray. Replace all purple colors with teal-600."

**Complete UI Overhaul:**

1. ✅ **Background**: Changed to `bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900`

2. ✅ **Create Pool Form**:
   - Responsive grid: `grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4`
   - All inputs: `bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-teal-500`
   - Labels with `htmlFor` attributes
   - Submit button: `bg-teal-600 hover:bg-teal-700` with loading spinner

3. ✅ **Summary Header** (2-column grid):
   - **Total Pools Card**: Teal gradient (`from-teal-600 to-teal-700`) with users icon
   - **Selected Pool Card**: Gray (`bg-gray-800`) with clipboard icon
   - Shows pool count, selected pool name, member count, balance

4. ✅ **Empty State Message**:
   - Centered with icon: `text-gray-400 text-center italic mt-8`
   - "No pools created yet. Use the form above to define your first compliance pool!"

5. ✅ **Tables Styling**:
   - Active Pools: Navy header (`from-blue-800 to-blue-900`)
   - Pool Members: Teal header (`from-teal-600 to-teal-700`)
   - Dark rows (`bg-gray-800`) with hover effects
   - Color-coded balances (green for surplus, red for deficit)

6. ✅ **Message Banner**:
   - Success: `bg-green-900/30 border-green-600/50 text-green-300`
   - Error: `bg-red-900/30 border-red-600/50 text-red-300`
   - With appropriate icons (checkmark/X)

**Color Palette Applied:**
- Navy Blue: `#1e3a8a` (headers, authority)
- Teal: `#14b8a6` (CTAs, highlights)
- Dark Gray: `#111827` - `#374151` (backgrounds)
- Green: `#10b981` (surplus, success)
- Red: `#ef4444` (deficit, errors)

---

## 📊 Development Metrics & Statistics

### Code Changes Summary
- **Total Files Modified:** 25+
- **Total Lines Added:** ~3,000+
- **Components Refactored:** 8 (RoutesTab, CompareTab, BankingTab, PoolingTab, Layout, LandingPage, App, index.css)
- **Documentation Created:** 5 major files (README.md, LANDING_PAGE_COMPLETE.md, VISUAL_GUIDE.md, TAILWIND_V4_FIX.md, AGENT_WORKFLOW.md)
- **API Endpoints Fixed:** 18 methods across 4 services
- **Build Optimizations:** CSS bundle increased from 7.88 kB → 43.41 kB (proving all utilities generating)
- **Tests Passing:** 17 unit tests in backend

### Technology Stack Confirmed
**Backend:**
- Node.js + TypeScript 5.9.3
- Express.js (REST API)
- Prisma ORM + PostgreSQL
- Jest (Testing)
- Port 3000

**Frontend:**
- React 19.2.0 + TypeScript 5.9.3
- Vite 7.2.2 (Build tool)
- Tailwind CSS v4.1.17 (Styling)
- React Router v7.9.5 (Navigation)
- Recharts 3.4.1 (Charts)
- Axios (HTTP client)
- Port 5173/5174

**Architecture:**
- Hexagonal (Ports & Adapters) on both frontend and backend
- Clean separation: Core Domain → Ports → Adapters → Infrastructure

---

## 🎯 Key Achievements

### 1. **Complete API Integration** ✅
- Fixed CORS errors
- Resolved port mismatch
- Standardized response unwrapping across all 18 endpoints
- Added defensive programming to handle unexpected data structures

### 2. **Professional UI/UX** ✅
- Marine-themed design system (Navy, Teal, Amber)
- Fully responsive (mobile, tablet, desktop)
- Dark mode compatible
- Accessibility features (proper labels, ARIA attributes)
- Loading states and error handling

### 3. **Tailwind CSS v4 Migration** ✅
- Migrated from v3 to v4 syntax
- CSS-based configuration via @theme
- Removed legacy config files
- 5.5x CSS bundle increase (proof of proper generation)

### 4. **Full Viewport Coverage** ✅
- Flexbox layouts on all pages
- Footer always at bottom
- Content expands to fill space
- No white gaps or floating elements

### 5. **Comprehensive Documentation** ✅
- README.md with 10 major sections
- Setup instructions for both backend and frontend
- API documentation with examples
- Architecture diagrams and explanations
- Visual guides and quick-start guides

### 6. **Production-Ready** ✅
- Build successful (657 KB JS, 43 KB CSS)
- Optimized bundles (gzipped)
- Clean TypeScript compilation
- No critical errors or warnings

---

## 🔄 Iterative Development Process

### Workflow Pattern Used Throughout:
1. **Identify Issue** - User reports problem or requests feature
2. **Gather Context** - Read relevant files, check current state
3. **Plan Solution** - Break down into smaller tasks
4. **Implement Changes** - Use replace_string_in_file with precise context
5. **Verify Results** - Check for lint errors, test builds
6. **Document** - Create or update documentation
7. **User Feedback** - Get confirmation or next requirements

### Example Iteration (CORS Fix):
```
User: "Cross-Origin Request Blocked"
  ↓
Agent: Read apiClient.ts, identify port mismatch
  ↓
Agent: Update baseURL and all 18 methods
  ↓
Agent: Add defensive checks in 4 components
  ↓
User: "routes.map is not a function"
  ↓
Agent: Add Array.isArray() safeguards
  ↓
Result: ✅ All API calls working
```

---

## 📁 Complete File Change Log

### Backend Files (Existing - Not Modified in This Session)
- Already implemented hexagonal architecture
- 17 unit tests passing
- All API endpoints functional

### Frontend Files Modified
1. `/frontend/src/adapters/infrastructure/api/apiClient.ts` - 18 method updates
2. `/frontend/src/adapters/ui/components/RoutesTab.tsx` - Defensive checks
3. `/frontend/src/adapters/ui/components/CompareTab.tsx` - Defensive checks
4. `/frontend/src/adapters/ui/components/BankingTab.tsx` - Defensive checks
5. `/frontend/src/adapters/ui/components/PoolingTab.tsx` - Marine theme refactor
6. `/frontend/src/adapters/ui/components/Layout.tsx` - Marine theme + flexbox
7. `/frontend/src/adapters/ui/pages/LandingPage.tsx` - NEW (350 lines)
8. `/frontend/src/adapters/ui/pages/index.ts` - NEW
9. `/frontend/src/App.tsx` - Routing updates
10. `/frontend/src/index.css` - Tailwind v4 + flexbox
11. `/frontend/src/App.css` - Cleaned up conflicts
12. `/frontend/postcss.config.js` - Tailwind v4
13. `/frontend/tailwind.config.js` - DELETED (v4 doesn't need it)

### Documentation Files Created
1. `/README.md` - Comprehensive project documentation
2. `/frontend/LANDING_PAGE_COMPLETE.md` - Landing page details
3. `/frontend/VISUAL_GUIDE.md` - UI/UX design guide
4. `/frontend/TAILWIND_V4_FIX.md` - Migration guide
5. `/AGENT_WORKFLOW.md` - This file (complete session summary)

---

## 🎓 Lessons Learned & Best Practices

### What Worked Well:
1. **Incremental Changes** - Small, focused edits easier to verify
2. **Defensive Programming** - Array.isArray() checks prevented runtime errors
3. **Consistent Theming** - Marine color palette applied uniformly
4. **Documentation-First** - Creating guides alongside code
5. **Build Verification** - Running npm run build after major changes

### Challenges Overcome:
1. **Tailwind v4 Syntax** - Required research and multiple iterations
2. **Flexbox Layout** - Needed proper understanding of flex-grow/shrink/auto
3. **API Response Format** - Required unwrapping at correct level
4. **Color Consistency** - Replaced purple → teal across entire component

### AI Agent Usage Patterns:
- **GitHub Copilot** used for code suggestions and completions
- **Manual verification** of all AI-generated code
- **Iterative refinement** based on build results and user feedback
- **Context-aware prompting** with specific file paths and requirements

---

## 🏗️ Original Assignment Context

This document details the usage of AI agents, specifically GitHub Copilot, in the development of the FuelEU Maritime compliance platform, adhering to the assignment's constraints.

## Agents Used

As per the assignment requirements, the **only** AI agent used for code generation, refactoring, and testing was **GitHub Copilot**.

This was utilized in three primary modes:

  * **Inline Completions:** (Grey-text suggestions triggered by `Tab`) for boilerplate, variable names, and simple function bodies.
  * **Copilot Chat (IDE View):** (The side-panel chat) for project-wide tasks, scaffolding new files (`@workspace /new`), and generating tests (`@workspace /tests`).
  * **Copilot Chat (Inline `Ctrl+I`):** For context-specific generation, refactoring, or explaining code blocks.

-----

## Prompts & Outputs

Below are representative examples of the prompt-and-generation workflow.

### Example 1: Generating a Core Use Case (Backend)

**Context:** Implementing the core business logic for calculating Compliance Balance (CB) within the hexagonal architecture. The goal was to generate the use case file in `backend/src/core/application/`.

**Prompt (to Copilot Chat `@workspace`):**

```
> @workspace Create a 'ComputeComplianceBalanceUseCase' class. It should implement an 'execute(shipId, year)' method.
Constants:
- TARGET_INTENSITY = 89.3368
- ENERGY_PER_TON = 41000

Formula:
ComplianceBalance = (TARGET_INTENSITY - actual_ghgIntensity) * (fuelConsumption * ENERGY_PER_TON)

Inject 'IRouteRepository' and 'IComplianceRepository' via the constructor.
The 'execute' method should:
1. Fetch the relevant route data (ghgIntensity, fuelConsumption) using IRouteRepository for the given ship and year.
2. Calculate the Compliance Balance (CB).
3. Save the result using IComplianceRepository.
4. Return the calculated CB.
```

**Generated Output (Snippet):**

```typescript
// Generated by Copilot (in backend/src/core/application/computeComplianceBalance.usecase.ts)
import { IRouteRepository } from '../ports/route.repository';
import { IComplianceRepository } from '../ports/compliance.repository';

// Constants were hardcoded, which I later refactored
const TARGET_INTENSITY = 89.3368;
const ENERGY_PER_TON = 41000;

export class ComputeComplianceBalanceUseCase {
  constructor(
    private routeRepository: IRouteRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<number> {
    // Copilot correctly identified the need to fetch data first
    const route = await this.routeRepository.findRouteForShip(shipId, year); // This method name was a guess

    if (!route) {
      throw new Error('Route data not found for ship and year');
    }

    const energyInScope = route.fuelConsumption * ENERGY_PER_TON;
    const complianceBalance =
      (TARGET_INTENSITY - route.ghgIntensity) * energyInScope;

    // Correctly used the compliance repository to save
    await this.complianceRepository.saveSnapshot({
      shipId,
      year,
      cb_gco2eq: complianceBalance,
    });

    return complianceBalance;
  }
}
```

-----

### Example 2: Scaffolding a UI Component (Frontend)

**Context:** Building the 'Routes' tab component, including data fetching and table display.

**Prompt (to Copilot Chat `@workspace`):**

```
> @workspace Create a 'RoutesTab' component using React and Tailwind.
1. Use the 'useRoutes' custom hook to fetch data.
2. While 'loading', show a 'LoadingSpinner' component.
3. If 'error', show an error message.
4. Render a table styled with Tailwind (dark/light mode compatible).
5. Columns: routeId, vesselType, fuelType, year, ghgIntensity, totalEmissions.
6. Add a 'Set Baseline' button in each row.
```

**Generated Output (Snippet):**

```tsx
// Generated by Copilot (in frontend/src/adapters/ui/components/RoutesTab.tsx)
import React from 'react';
import { useRoutes } from '../../../core/application/useRoutes';
import { LoadingSpinner } from './LoadingSpinner'; // Assumed this component exists

export const RoutesTab: React.FC = () => {
  const { routes, loading, error, setBaseline } = useRoutes(); // Guessed 'setBaseline'

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const handleSetBaseline = (routeId: string) => {
    // TODO: Wire this up
    console.log('Set baseline for', routeId);
    // setBaseline(routeId); // This was the intended, but un-implemented, call
  };

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 ...">Route ID</th>
            {/* ... other headers ... */}
            <th className="px-6 py-3 ...">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {routes.map((route) => (
            <tr key={route.routeId}>
              <td className="px-6 py-4 ...">{route.routeId}</td>
              {/* ... other cells ... */}
              <td className="px-6 py-4">
                <button
                  onClick={() => handleSetBaseline(route.routeId)}
                  className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Set Baseline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

-----

## Validation / Corrections

Copilot was a "pair programmer" that required active supervision. My skill was applied in validating and correcting its output.

  * **On Example 1 (Backend):**

      * **Correction:** Copilot's `routeRepository.findRouteForShip` was a good *guess*, but it wasn't the method name defined in my `IRouteRepository` port.
      * **My Fix:** I manually refactored the call to match my port's actual method (`findByShipAndYear`).
      * **My Fix:** The hardcoded constants (`TARGET_INTENSITY`, `ENERGY_PER_TON`) were immediately extracted into a `src/shared/constants.ts` file to maintain clean architecture principles. Copilot just dumped them in the file.

  * **On Example 2 (Frontend):**

      * **Correction:** The `handleSetBaseline` function was a stub. Copilot created the button but didn't know *how* to implement the mutation.
      * **My Fix:** I manually created a `useSetBaseline` mutation hook (using `useSWR` or `react-query` patterns) and wired it to the `onClick` handler, including a re-fetch of the routes data upon success.
      * **My Fix:** Copilot assumed a `LoadingSpinner` component. I had to use an inline prompt (`// create a simple tailwind css spinning loader`) to generate that component separately.

-----

## Observations

### Where Copilot Saved Time

  * **TDD:** `> @workspace /tests Generate unit tests for 'ComputeComplianceBalanceUseCase'` was a huge accelerator. It generated the `describe/it` blocks and mocked all dependencies (repositories) perfectly. I only had to fill in the specific `expect` assertions.
  * **Boilerplate:** Scaffolding `package.json`, `tsconfig.json`, `vite.config.ts`, `prisma.schema.prisma`, and the basic Express `index.ts` server was instantaneous.
  * **Repository Implementation:** After defining the `IRouteRepository` port, I prompted Copilot to implement the adapter (`PrismaRouteRepository`). It correctly inferred all the Prisma Client calls (`prisma.route.findMany`, `prisma.route.update`) from the port's method signatures.
  * **Tailwind:** Generating the Tailwind markup for tables and forms (Example 2) was incredibly fast and saved significant time over manual class writing.

### Where Copilot Failed or Hallucinated

  * **Complex Domain Logic:** Copilot consistently failed on the **Pooling (Article 21)** logic. My prompts for the "greedy allocation algorithm" produced `for` loops that were either simplistic, inefficient (O(n^2)), or outright wrong. They did not satisfy the constraints (e.g., "deficit ship cannot exit worse"). This core piece of logic had to be written almost entirely manually.
  * **Architectural Nuance:** It sometimes tried to "cheat" the hexagonal architecture. For example, it once suggested importing the `PrismaClient` (an adapter) directly into a `core` use case file, which I had to immediately correct.
  * **Test Edge Cases:** It's excellent at "happy path" tests. It's poor at generating tests for edge cases (e.g., empty arrays, division by zero in the Compare tab, invalid pool combinations, over-applying a bank surplus). I had to manually add all of these.

-----

## Best Practices Followed

1.  **Architecture-First, AI-Second:** I manually created the hexagonal folder structure (`core/`, `adapters/`, `infrastructure/`) *before* invoking `@workspace`. This provided the necessary context for Copilot to place files correctly and understand the dependency flow.
2.  **Port-Driven Development:** I always manually wrote the `port` (interface) first. Then, I used Copilot to generate both the *use case* (which consumed the port) and the *adapter* (which implemented the port). This kept the AI aligned with the architecture.
3.  **Specific, Contextual Prompts:** I avoided vague prompts like "build the app." Instead, I used highly specific, task-oriented prompts (as shown in the examples) that defined *what* to build, *where* it fit, and *what* logic it should contain.
4.  **TDD with AI:** My workflow was:
    a. Manually write the port interface.
    b. Use Copilot Chat (`@workspace /tests`) to generate the test file for a use case.
    c. Run the test (which failed).
    d. Use Copilot Chat (`@workspace`) to generate the use case implementation to make the test pass.
    e. Manually add edge case tests.