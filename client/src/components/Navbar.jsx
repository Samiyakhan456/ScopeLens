
import { ScanSearch, LayoutDashboard, FileSpreadsheet } from 'lucide-react';

function Navbar({ activePage, setActivePage }) {
  const links = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Documents', icon: ScanSearch },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  ];

  return (
    <header className="navbar">
      <a className="brand" href="#" onClick={() => setActivePage('overview')}>
        ScopeLens<span>.</span>
      </a>

      <nav className="nav-links">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-link ${activePage === id ? 'active' : ''}`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={16} strokeWidth={1.7} />
            {label}
          </button>
        ))}
      </nav>

      <div className="connection-status">
        <span className="status-dot" />
        <span>DOCUMENT INTELLIGENCE</span>
      </div>
    </header>
  );
}

export default Navbar;
