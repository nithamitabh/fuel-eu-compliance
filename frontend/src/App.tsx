/**
 * App Component
 * Main application component with React Router setup
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, RoutesTab, CompareTab, BankingTab, PoolingTab } from './adapters/ui/components';
import { LandingPage } from './adapters/ui/pages/LandingPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route path="routes" element={<RoutesTab />} />
          <Route path="compare" element={<CompareTab />} />
          <Route path="banking" element={<BankingTab />} />
          <Route path="pooling" element={<PoolingTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
