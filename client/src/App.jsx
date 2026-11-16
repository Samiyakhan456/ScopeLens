
import { useState } from 'react';

import Background from './components/Background';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import ScanDocuments from './pages/ScanDocuments';
import './styles/App.css';

function App() {
  const [activePage, setActivePage] = useState('overview');

  // Real scan results will populate these values later.
  const [recentScans, setRecentScans] = useState([]);

  const stats = {
    total: recentScans.length,
    related: recentScans.filter(
      scan => scan.relevance === 'Yes'
    ).length,
    possible: recentScans.filter(
      scan => scan.relevance === 'Possible'
    ).length
  };

  return (
    <div className="app-shell">
      <Background />

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {activePage === 'overview' && (
        <Overview
          stats={stats}
          recentScans={recentScans}
          onNavigate={setActivePage}
        />
      )}

      {activePage === 'scan' && (
        <ScanDocuments
        onScanComplete={(results) => {
          setRecentScans((previous) => [...results, ...previous]);
        }}
      />
     )}

      {activePage === 'reports' && (
        <main className="placeholder-page">
          <p className="eyebrow">YOUR ACTIVITY</p>
          <h1>Reports</h1>
          <p>Your scan reports will appear here.</p>
        </main>
      )}
    </div>
  );
}

export default App;
