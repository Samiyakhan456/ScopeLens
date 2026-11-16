const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function scanDocuments(files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('documents', file);
  });

  const response = await fetch(`${API_URL}/api/scan`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Scan failed (${response.status})`);
  }

  return response.json();
}

export async function downloadExcelReport(files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('documents', file);
  });

  const response = await fetch(`${API_URL}/api/scan/excel`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Excel export failed (${response.status})`);
  }

  return response.blob();
}
