# <img src="public/logo.png" width="48" height="48" style="vertical-align: middle; margin-right: 10px;" /> Memoryze

> **Sync your knowledge, retain your future.**

Memoryze is a modern, spaced-repetition based learning application designed to help you optimize your study sessions and maximize retention. Built with a focus on simplicity, performance, and user experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Make with ❤️ by [Furkan Köykıran](https://github.com/furkankoykiran)*
*Memoryze © 2024*
