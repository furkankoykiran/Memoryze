import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Auth = () => {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isForgotPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + import.meta.env.BASE_URL + 'update-password',
                });
                if (error) throw error;
                alert(t('auth.resetLinkSent'));
                setIsForgotPassword(false);
                setIsLogin(true);
            } else if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/dashboard');
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin + import.meta.env.BASE_URL
                    }
                });
                if (error) throw error;

                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: data.user.id,
                                first_name: firstName,
                                last_name: lastName
                            }
                        ]);

                    // If there's a profile error, we log it but don't stop the flow
                    // In a real app we might want to handle this more gracefully
                    if (profileError) console.error('Error creating profile:', profileError);
                }

                alert(t('auth.checkEmail'));
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                // Map Supabase errors to translation keys
                if (err.message === 'Invalid login credentials') {
                    setError(t('auth.errorInvalidLogin'));
                } else if (
                    err.message.includes('rate limit') ||
                    err.message.includes('Too many requests') ||
                    err.message.includes('over_email_send_rate_limit')
                ) {
                    setError(t('auth.errorRateLimit'));
                } else {
                    setError(err.message);
                }
            } else {
                setError(t('auth.errorUnexpected'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 relative overflow-hidden"
            >
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        {t('app.title')}
                    </h1>
                    <p className="text-white/60 mt-2">
                        {isForgotPassword ? t('auth.resetPassword') : isLogin ? t('auth.welcomeBack') : t('auth.welcomeJoin')}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5">
                    {!isLogin && !isForgotPassword && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-white/80 ml-1">{t('profile.firstName')}</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-white placeholder-white/20"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-white/80 ml-1">{t('profile.lastName')}</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-white placeholder-white/20"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-white/80 ml-1">{t('auth.email')}</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-white placeholder-white/20"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {!isForgotPassword && (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-white/80">{t('auth.password')}</label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-white placeholder-white/20"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {isForgotPassword ? t('auth.sendResetLink') : isLogin ? t('auth.signIn') : t('auth.signUp')}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    {isForgotPassword ? (
                        <button
                            onClick={() => {
                                setIsForgotPassword(false);
                                setIsLogin(true);
                                setError(null);
                            }}
                            className="text-white/40 hover:text-white transition-colors text-sm hover:underline"
                        >
                            {t('auth.backToSignIn')}
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                }}
                                className="text-white/40 hover:text-white transition-colors text-sm hover:underline"
                            >
                                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                            </button>

                            {isLogin && (
                                <button
                                    onClick={() => {
                                        setIsForgotPassword(true);
                                        setError(null);
                                    }}
                                    className="text-xs text-indigo-300/80 hover:text-indigo-300 transition-colors hover:underline"
                                >
                                    {t('auth.forgotPassword')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
