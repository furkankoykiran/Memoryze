# <img src="public/logo.png" width="48" height="48" style="vertical-align: middle; margin-right: 10px;" /> Memoryze

> **Sync your knowledge, retain your future.**

**Live app: [furkankoykiran.com.tr/Memoryze](https://furkankoykiran.com.tr/Memoryze/)**

Memoryze is a modern, spaced-repetition based learning application designed to help you optimize your study sessions and maximize retention. Built with a focus on simplicity, performance, and user experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)
[![CI](https://github.com/furkankoykiran/Memoryze/actions/workflows/ci.yml/badge.svg)](https://github.com/furkankoykiran/Memoryze/actions/workflows/ci.yml)

---

## 🚀 Features

- **Smart Scheduling**: Uses advanced spaced repetition algorithms (based on SuperMemo 2) to schedule reviews at the perfect time.
- **Clusters & Memos**: Organize your knowledge into **Clusters** (Topics) and atomic **Memos** (Flashcards).
- **Multi-Language Support**: Fully localized in **English** and **Turkish**. Auto-detects your browser preference.
- **Modern Dashboard**: Manage your clusters, add new memos easily, and track your progress.
- **Modern UI/UX**: Features a sleek, dark-themed glassmorphism interface powered by Tailwind CSS and Framer Motion.
- **Secure Authentication**: Robust user management via Supabase Auth.

## 🛠 Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🔍 SEO, AI discovery and build

- Turkish/English interface; `document.documentElement.lang` follows the active language.
- Canonical URL, Open Graph/Twitter cards and a generated 1200×630 `og-image.png`.
- `WebApplication` + `FAQPage` JSON-LD with author, licence and repository links.
- `robots.txt`, `sitemap.xml`, `llms.txt`, `ai.txt`, `.well-known/security.txt` and a web manifest in `public/`.
- `npm run build` runs `vite build`, then `scripts/postbuild.js` (writes `404.html` and `.nojekyll`) and `scripts/verify-build.js`, which fails when metadata, discovery files or hashed assets are missing.
- Routes other than the landing page are code-split, so the public page loads only the landing chunk.

The Supabase URL and anon key in `.env` are public by design (`VITE_` variables are
embedded in the client bundle); row-level security in Supabase is what protects user
data. Move them to repository secrets if you prefer not to commit `.env`.

## 📦 Installation

To run Memoryze locally, follow these steps:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/furkankoykiran/Memoryze.git
    cd Memoryze
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (optional if relying on hardcoded anon keys for dev, but recommended):
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🌍 Deployment

This project is configured for **GitHub Pages**.

- The `deploy.yml` workflow automatically builds and deploys changes from the `main` branch.
- It handles SPA routing by generating a `404.html` and setting the correct `basename`.

## ⚠️ Known Issues & Troubleshooting

### Supabase Rate Limits (`over_email_send_rate_limit`)
Supabase's free tier has strict limits on email sending (approx. 3-4 emails per hour). If you encounter this error during development:
1.  Go to your **Supabase Dashboard**.
2.  Navigate to **Authentication > Providers > Email**.
3.  **Disable** "Confirm email" (Confirm email addresses).
4.  This allows users to sign up **without** sending an email, bypassing the rate limit and immediately logging them in.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Make with ❤️ by [Furkan Köykıran](https://github.com/furkankoykiran)*
*Memoryze © 2024*
