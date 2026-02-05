import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Layers, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Landing = () => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'tr' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-panel rounded-none border-t-0 border-x-0 border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/30">
                            <BookOpen size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Memoryze
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            aria-label="Toggle Language"
                        >
                            <Globe size={20} />
                        </button>
                        <Link to="/auth" className="text-sm font-medium hover:text-indigo-400 transition-colors">
                            {t('landing.login')}
                        </Link>
                        <Link
                            to="/auth"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/25"
                        >
                            {t('landing.getStarted')}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-indigo-400"
                    >
                        {t('landing.heroTitle')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
                    >
                        {t('landing.heroSubtitle')}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            to="/auth"
                            className="btn-primary text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-2"
                        >
                            <Zap size={20} />
                            {t('landing.getStarted')}
                        </Link>
                    </motion.div>
                </div>

                {/* Features */}
                <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap className="text-yellow-400" size={32} />}
                        title={t('landing.features.sync.title')}
                        desc={t('landing.features.sync.desc')}
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={<Layers className="text-indigo-400" size={32} />}
                        title={t('landing.features.clusters.title')}
                        desc={t('landing.features.clusters.desc')}
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<BookOpen className="text-emerald-400" size={32} />}
                        title={t('landing.features.memos.title')}
                        desc={t('landing.features.memos.desc')}
                        delay={0.5}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 text-center text-white/40 text-sm">
                <p>{t('landing.footer.rights')}</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass-panel p-8 text-center hover:bg-white/10 transition-colors"
    >
        <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-white/60">{desc}</p>
    </motion.div>
);
