import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Book, LayoutDashboard, LogOut, Menu, X, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { t, i18n } = useTranslation();
    const { signOut, user, profile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/dashboard' },
    ];

    const isMobile = window.innerWidth < 1024; // Simple check, or rely on CSS for desktop reset

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'tr' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="flex min-h-screen text-white">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 glass-panel text-white"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Backdrop (Mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed top-0 bottom-0 left-0 z-40 w-64 glass-panel m-0 rounded-none lg:m-4 lg:rounded-2xl flex flex-col p-6 transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex items-center gap-3 mb-10">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Memoryze" className="w-10 h-10" />
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            {t('app.title')}
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white/70 hover:bg-white/10 hover:text-white"
                    >
                        <Book size={20} />
                        {t('nav.home')}
                    </Link>

                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                location.pathname === item.path
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/10 space-y-4">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold border border-white/20">
                            {(profile?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-white/90">
                                {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm"
                    >
                        <Globe size={18} />
                        <span>{i18n.language === 'en' ? 'Türkçe\'ye Geç' : 'Switch to English'}</span>
                    </button>

                    {/* Sign Out */}
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        {t('nav.signOut')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 lg:ml-72 overflow-x-hidden min-h-screen">
                {children}
            </main>
        </div>
    );
};
