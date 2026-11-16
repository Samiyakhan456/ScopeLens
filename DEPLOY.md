# ScopeLens — Deployment Guide

This document describes the proposed deployment architecture and configuration for ScopeLens.

The application uses a separate frontend and backend, so they can be deployed independently.

**Proposed hosting platforms:**
- Frontend: Vercel
- Backend: Render
- Source code: GitHub

**Deployment status:** Deployment status: Successfully deployed. The frontend is hosted on Vercel and the backend is hosted on Render.

---

## 1. Deployment Architecture

The proposed production architecture is:

```text
                 USER
                   |
                   v
          Vercel - React Frontend
                   |
                   | HTTPS REST API Requests
                   v
           Render - Express Backend
                   |
          ---------------------
          |         |         |
          v         v         v
       PDF       DOCX      Keyword
     Extraction Extraction Matching
          |         |         |
          ---------------------
                   |
                   v
           Relevance Scoring
                   |
                   v
            Excel Generation
                   |
                   v
          Response to Frontend
                   |
                   v
           Excel Report Download
```

The frontend communicates with the backend through REST API endpoints. The backend handles document processing, keyword matching, relevance scoring, and Excel report generation.

---

## 2. Frontend Deployment — Vercel

The React application can be hosted on Vercel.
**Live Frontend URL:** https://scope-lens-jet.vercel.app

### Steps

1. Sign in to [Vercel](https://vercel.com/).
2. Connect the GitHub account containing the ScopeLens repository.
3. Select the `ScopeLens` repository.
4. Configure the frontend project using the following settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Frontend Environment Variable

Configure the following environment variable in Vercel:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<your-backend-domain>` |

Replace the placeholder with the actual deployed backend URL.

After configuration, deploy the application.

Vercel will provide a production frontend URL similar to:

'https://scope-lens-jet.vercel.app'

---

## 3. Backend Deployment — Render

The Node.js and Express backend can be hosted on Render.
**Live Backend URL:** https://scopelens-backend.onrender.com

**Health Check:** https://scopelens-backend.onrender.com/api/health

### Steps

1. Sign in to [Render](https://render.com/).
2. Connect your GitHub account.
3. Create a new Web Service.
4. Select the `ScopeLens` repository.
5. Configure the service:

| Setting | Value |
|---|---|
| Runtime | Node.js |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

### Backend Environment Variables

Configure the following environment variable:

| Variable | Value |
|---|---|
| `PORT` | Provided automatically by Render |

The backend should use `process.env.PORT` and listen on the port supplied by the hosting platform.

Render will provide a backend URL similar to:

'https://scopelens-backend.onrender.com'

---

## 4. CORS Configuration

Since the frontend and backend are hosted on separate domains, Cross-Origin Resource Sharing (CORS) must allow requests from the deployed frontend.

The backend should allow:

- The local development frontend: `http://localhost:5173`
- The deployed Vercel frontend: `https://scope-lens-jet.vercel.app`

For production, configure CORS to allow the intended frontend origin rather than relying on unrestricted cross-origin access.

---

## 5. API Configuration

The frontend uses the `VITE_API_URL` environment variable to determine the backend API base URL.

The backend exposes the following endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/scan` | Upload and analyse documents |
| POST | `/api/scan/excel` | Generate and download an Excel report |

The production frontend should send requests to the deployed backend URL.

Example:

```text
https://scopelens-backend.onrender.com/api/scan
```

---

## 6. Deployment Verification

After deployment, the following checks should be performed:

- [ ] Frontend loads successfully.
- [ ] Frontend can communicate with the deployed backend.
- [ ] Multiple PDF documents can be uploaded.
- [ ] DOCX documents can be uploaded and processed.
- [ ] Text extraction works correctly.
- [ ] Official keyword matching returns expected results.
- [ ] Relevance classifications are correct.
- [ ] Supplementary terminology is displayed separately.
- [ ] Excel reports can be generated and downloaded.
- [ ] CORS configuration permits frontend-to-backend communication.
- [ ] Invalid file types and oversized uploads are handled appropriately.

---

## 7. Environment and Security Considerations

- Environment variables should be configured through the hosting platforms' environment settings.
- `.env` files must not be committed to GitHub.
- Only intended frontend origins should be allowed through production CORS configuration.
- Uploaded documents should be processed without exposing their contents publicly.
- Production deployments should use HTTPS.
- API errors should be handled without exposing sensitive server information.

---

## 8. Future Deployment Improvements

Potential improvements include:

- Automated deployment through GitHub integration.
- Production logging and error monitoring.
- Automated backend testing before deployment.
- OCR support for scanned PDF documents.
- Improved deployment health checks and monitoring.

---

**Note:** ScopeLens has been deployed and its core functionality has been verified using PDF and DOCX uploads, keyword matching, relevance scoring, supplementary terminology detection, and Excel report generation.