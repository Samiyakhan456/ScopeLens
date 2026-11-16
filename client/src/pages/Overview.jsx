
import {
  ArrowUpRight,
  FileText,
  CheckCircle2,
  CircleHelp,
  ArrowRight
} from 'lucide-react';

function Overview({ stats, recentScans, onNavigate }) {
  const cards = [
    {
      label: 'DOCUMENTS SCANNED',
      value: stats.total,
      icon: FileText
    },
    {
      label: 'RELATED TENDERS',
      value: stats.related,
      icon: CheckCircle2
    },
    {
      label: 'POSSIBLE MATCHES',
      value: stats.possible,
      icon: CircleHelp
    }
  ];

  return (
    <main className="overview-page">
      <section className="hero-section">
        <p className="eyebrow">YOUR DOCUMENT INTELLIGENCE WORKSPACE</p>

        <h1>
          Clarity in
          <br />
          every <em>tender.</em>
        </h1>

        <p className="hero-description">
          Discover industrial opportunities hidden in complex
          tender documents. Scan, analyse and identify what
          matters.
        </p>

        <button
          className="primary-button"
          onClick={() => onNavigate('scan')}
        >
          Scan New Documents
          <ArrowUpRight size={18} />
        </button>
      </section>

      <section className="stats-grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <div className="stat-top">
              <span>{label}</span>
              <Icon size={19} strokeWidth={1.5} />
            </div>
            <div className="stat-value">{value}</div>
          </article>
        ))}
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR ACTIVITY</p>
            <h2>Recent scans</h2>
          </div>

          <button
            className="text-button"
            onClick={() => onNavigate('reports')}
          >
            View reports <ArrowRight size={16} />
          </button>
        </div>

        {recentScans.length === 0 ? (
          <div className="empty-state">
            <FileText size={30} strokeWidth={1.3} />
            <h3>Your workspace awaits.</h3>
            <p>
              Your scanned tender documents will appear here.
              Start by uploading your first PDF or DOCX.
            </p>
            <button
              className="secondary-button"
              onClick={() => onNavigate('scan')}
            >
              Upload a document
            </button>
          </div>
        ) : (
          <div className="recent-list">
            {recentScans.slice(0, 5).map((scan, index) => (
              <div className="recent-row" key={`${scan.documentName}-${index}`}>
                <FileText size={20} />
                <span>{scan.documentName}</span>
                <strong>{scan.verdict}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Overview;
