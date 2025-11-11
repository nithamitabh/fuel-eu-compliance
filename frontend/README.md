# FuelEU Maritime Compliance - Frontend

React + TypeScript frontend application for FuelEU Maritime Regulation compliance management.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters pattern).

## 📦 Tech Stack

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3001`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📚 Custom Hooks

All hooks are located in `src/core/application/`:

### useRoutes
```typescript
const { routes, loading, error, refetch } = useRoutes();
```

### useComparison
```typescript
const { comparisonData, loading, error, refetch } = useComparison();
```

### useCompliance
```typescript
const { computeCompliance, complianceData, loading, error } = useCompliance();
```

### useBanking
```typescript
const { bankSurplus, applyBankedSurplus, loading, error } = useBanking();
```

### usePooling
```typescript
const { createPool, pools, loading, error } = usePooling();
```

## 🎯 Demo Component

Run the demo to test all hooks:

```tsx
// In App.tsx
import { DemoHooks } from './DemoHooks';

function App() {
  return <DemoHooks />;
}
```

## 📖 Documentation


- **PHASE3_COMPLETE.md** - Detailed completion summary with examples
- **Backend API** - See `../backend/README.md`

---

**Status**: Phase 3 Complete ✅  
**Next**: Phase 4 - UI Components & Pages


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
