
import { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  ScanSearch,
  Download,
  LoaderCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import {
  scanDocuments,
  downloadExcelReport
} from '../services/api';

function ScanDocuments({ onScanComplete }) {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const addFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles);
    const valid = [];
    const rejected = [];

    incoming.forEach((file) => {
      const extension = file.name.split('.').pop().toLowerCase();

      if (!['pdf', 'docx'].includes(extension)) {
        rejected.push(`${file.name}: unsupported format`);
      } else if (file.size > 10 * 1024 * 1024) {
        rejected.push(`${file.name}: exceeds 10 MB`);
      } else if (
        files.some((existing) =>
          existing.name === file.name &&
          existing.size === file.size
        ) ||
        valid.some((existing) =>
          existing.name === file.name &&
          existing.size === file.size
        )
      ) {
        rejected.push(`${file.name}: already selected`);
      } else {
        valid.push(file);
      }
    });

    setFiles((previous) => [...previous, ...valid]);
    setResults([]);
    setError(rejected.join('. '));
  };

  const removeFile = (index) => {
    setFiles((previous) => previous.filter((_, i) => i !== index));
    setResults([]);
  };

  const handleScan = async () => {
    if (!files.length || loading) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const data = await scanDocuments(files);

      if (!data.success) {
        throw new Error(data.message || 'Unable to scan documents.');
      }

      setResults(data.results || []);
      onScanComplete?.(data.results || []);
    } catch (err) {
      setError(err.message || 'Something went wrong while scanning.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!files.length || !results.length || exporting) return;

    setExporting(true);
    setError('');

    try {
      const blob = await downloadExcelReport(files);
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'ScopeLens_Tender_Report.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Excel download failed.');
    } finally {
      setExporting(false);
    }
  };

  const formatSize = (bytes) => {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <main className="scanner-page">
      <section className="scanner-heading">
        <p className="eyebrow">DOCUMENT ANALYSIS / 001</p>
        <h1>Find what <em>matters.</em></h1>
        <p>
          Upload tender documents and discover their relevance
          to industrial bolting and mechanical services.
        </p>
      </section>

      <section
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          multiple
          hidden
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = '';
          }}
        />

        <UploadCloud size={36} strokeWidth={1.4} />

        <h2>Drop your documents here</h2>
        <p>or click to browse your files</p>
        <span>PDF and DOCX · Maximum 10 MB per file · Up to 10 files</span>
      </section>

      {files.length > 0 && (
        <section className="selected-files">
          <div className="file-section-heading">
            <h2>Selected documents</h2>
            <span>{files.length} file(s)</span>
          </div>

          {files.map((file, index) => (
            <div className="file-row" key={`${file.name}-${index}`}>
              <FileText size={21} />
              <div className="file-details">
                <strong>{file.name}</strong>
                <span>{formatSize(file.size)}</span>
              </div>
              <button
                className="remove-file"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(index)}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </section>
      )}

      <div className="scanner-actions">
        <button
          className="primary-button"
          disabled={!files.length || loading}
          onClick={handleScan}
        >
          {loading ? (
            <>
              <LoaderCircle className="spin" size={18} />
              Scanning...
            </>
          ) : (
            <>
              <ScanSearch size={18} />
              Scan Documents
            </>
          )}
        </button>

        <button
          className="secondary-button"
          disabled={!files.length || loading}
          onClick={() => {
            setFiles([]);
            setResults([]);
            setError('');
          }}
        >
          Clear all
        </button>
      </div>

      {error && (
        <div className="scanner-error" role="alert">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <section className="results-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ANALYSIS COMPLETE</p>
              <h2>Scan results</h2>
            </div>

            <button
              className="primary-button"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Download size={17} />
              )}
              {exporting ? 'Preparing...' : 'Download Excel'}
            </button>
          </div>

          
<div className="results-table-wrapper">
  <table className="results-table">
    <thead>
      <tr>
        <th>DOCUMENT</th>
        <th>MATCHED KEYWORDS</th>
        <th>MATCHES</th>
        <th>RELEVANCE</th>
        <th>RELATED TERMINOLOGY</th>
      </tr>
    </thead>

    <tbody>
      {results.map((result, index) => (
        <tr key={`${result.documentName}-${index}`}>
          <td>{result.documentName}</td>

          <td>
            {result.matchedKeywords?.length
              ? result.matchedKeywords
                  .map((match) => match.keyword)
                  .join(', ')
              : 'None'}
          </td>

          <td>{result.matchCount}</td>

          <td>
            <span className={`verdict verdict-${result.relevance.toLowerCase()}`}>
              {result.verdict}
            </span>
          </td>

          <td>
            {result.relatedTerms?.length ? (
              <div className="related-terms-list">
                {result.relatedTerms.map((category, categoryIndex) => (
                  <div
                    className="related-term-category"
                    key={`${category.category}-${categoryIndex}`}
                  >
                    <strong>{category.category}:</strong>

                    <span>
                      {category.matchedTerms
                        .map((term) =>
                          `${term.term} (${term.occurrences})`
                        )
                        .join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="no-related-terms">None</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          <p className="results-note">
            <CheckCircle2 size={15} />
            {results.length} document(s) processed successfully.
          </p>
        </section>
      )}
    </main>
  );
}

export default ScanDocuments;
