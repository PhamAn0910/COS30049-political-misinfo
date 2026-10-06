// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Main application component, client-side routing, and top-level layout composition
// Key Interface/Contract: Integrates Header, Sidebar, Footer layout with Dashboard, Analytics, Network, About pages

import React, { useState } from 'react';
import Header from './components/Layout/Header.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import Footer from './components/Layout/Footer.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';
import Network from './pages/Network.jsx';
import About from './pages/About.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'network':
        return <Network />;
      case 'about':
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-1">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-6">
            {renderPage()}
          </main>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
