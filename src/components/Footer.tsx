import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="border-t border-white/10 py-8 text-center text-white/40 text-sm mt-auto bg-slate-900/50 backdrop-blur-sm">
            <p>
                {t('landing.footer.rights')} • Designed & Built by{' '}
                <a
                    href="https://github.com/furkankoykiran/Memoryze"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Furkan Köykıran
                </a>
            </p>
        </footer>
    );
};
