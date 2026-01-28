# Deployment and Database Configuration Guide

This guide explains how to update your database connection to Hostinger and deploy your application.

## 1. Database Configuration

The application uses **Drizzle ORM** with **MySQL**. I have updated the code to support loading credentials from a `.env` file.

### Steps to Update:
1.  **Locate the `.env` file** in the root directory of your project.
2.  **Update the `DATABASE_URL`** with your Hostinger credentials:
    ```env
    DATABASE_URL=mysql://u585115589_eizer:1i0b+Vxxxx@sql585.main-hosting.eu/u585115589_eizer
    ```
    *Note: Replace `sql585.main-hosting.eu` with the actual MySQL Host provided in your Hostinger control panel if it differs.*

### Code Changes Made:
-   Modified `server/db.ts` to include `dotenv.config()` so it can read from your `.env` file.
-   Created a template `.env` file for you to use.

---

## 2. Deploying to GitHub Pages

GitHub Pages is used to host the **frontend (client)** of your application. Since this is a full-stack app, you will need a separate place to host the **backend (server)**.

### A. Frontend Deployment (GitHub Pages)
I have created a GitHub Actions workflow that will automatically build and deploy your frontend whenever you push to the `main` branch.

1.  **Push the changes** I've made to your GitHub repository:
    ```bash
    git add .
    git commit -m "Add Hostinger DB config and GitHub Pages workflow"
    git push origin main
    ```
2.  **Enable GitHub Pages** in your repository settings:
    -   Go to **Settings** > **Pages**.
    -   Under **Build and deployment** > **Source**, select **GitHub Actions**.
3.  The workflow in `.github/workflows/deploy.yml` will now handle the deployment.

### B. Backend Deployment (Important)
GitHub Pages **cannot** run your Node.js server or connect to your MySQL database directly. You have two main options for the backend:

1.  **Host on Hostinger (Recommended):** Since you already have a database there, you can host your Node.js application on Hostinger if your plan supports it (VPS or specialized Node.js hosting).
2.  **Host on Render/Railway:** These are popular platforms for hosting Node.js backends for free or at a low cost.

**Once your backend is deployed:**
-   Update the `url` in `client/src/main.tsx` (line 43) from `/api/trpc` to your actual backend URL (e.g., `https://your-backend-api.com/api/trpc`).

---

## Summary of Files Modified/Created:
-   `server/db.ts`: Added environment variable support.
-   `.env`: Added your database credentials.
-   `.github/workflows/deploy.yml`: Created the automation for GitHub Pages.
-   `DEPLOYMENT_GUIDE.md`: This guide.
