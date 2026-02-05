import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { DeckDetail } from './pages/DeckDetail';
import { Review } from './pages/Review';
import { Landing } from './pages/Landing';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Layout Wrapper for Pages that need Header/Footer
// Although Landing uses them directly, other protected pages use Layout
// But user requested "header and footer must be on all pages"
// So we can wrap Auth in a layout that only has header/footer content but centers the auth form?
// NO, the user says "header portion should have name/surname etc".
// Let's create a PublicLayout for Auth if needed, or just use Header/Footer in Auth page manually to keep the center alignment.
// BUT, the Layout component I just created handles basic layout.
// Let's try to use Layout for everything.

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout>{children}</Layout>;
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col pt-20">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        {children}
      </div>
      <Footer />
    </div>
  );
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <PublicLayout>{children}</PublicLayout>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Landing Page (Has its own layout structure in Landing.tsx) */}
          <Route path="/" element={<Landing />} />

          {/* Auth Page */}
          <Route path="/auth" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/deck/:id" element={
            <ProtectedRoute>
              <DeckDetail />
            </ProtectedRoute>
          } />

          <Route path="/review/:id" element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
