import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Globe, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
    const { t, i18n } = useTranslation();
    const { session, signOut, profile } = useAuth();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);

    const toggleLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsLangOpen(false);
    };

    // Click outside handler for language dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'tr', label: 'Türkçe', flag: '🇹🇷' }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-panel rounded-none border-t-0 border-x-0 border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <img src="/logo.png" alt="Memoryze Logo" className="w-10 h-10 group-hover:scale-105 transition-transform" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Memoryze
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Dashboard Link for Logged In Users */}
                    {session && (
                        <Link
                            to="/dashboard"
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
                        >
                            {t('nav.dashboard')}
                        </Link>
                    )}

                    {/* User Profile Display */}
                    {session && profile && (
                        <div className="hidden md:flex items-center gap-2 text-white/80 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <User size={16} className="text-indigo-400" />
                            <span className="text-sm font-medium">
                                {profile.first_name} {profile.last_name}
                            </span>
                        </div>
                    )}

                    {/* Language Dropdown */}
                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
                        >
                            <span className="text-lg">{currentLang.flag}</span>
                            <span className="hidden sm:inline">{currentLang.label}</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isLangOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-40 glass-panel border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => toggleLanguage(lang.code)}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-white/10 transition-colors ${i18n.language === lang.code ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/80'}`}
                                        >
                                            <span className="text-lg">{lang.flag}</span>
                                            {lang.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="p-2 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            title={t('nav.signOut')}
                        >
                            <LogOut size={20} />
                        </button>
                    ) : (
                        <Link
                            to="/auth"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/25"
                        >
                            {t('landing.login')}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};
