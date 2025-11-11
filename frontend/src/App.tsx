/**
 * App Component
 * Main application component with React Router setup
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, RoutesTab, CompareTab, BankingTab, PoolingTab } from './adapters/ui/components';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RoutesTab />} />
          <Route path="compare" element={<CompareTab />} />
          <Route path="banking" element={<BankingTab />} />
          <Route path="pooling" element={<PoolingTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
