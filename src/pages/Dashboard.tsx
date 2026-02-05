import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Cluster {
    id: string;
    title: string;
    description: string;
    created_at: string;
    memo_count?: number;
}

export const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewClusterModal, setShowNewClusterModal] = useState(false);
    const [newClusterTitle, setNewClusterTitle] = useState('');
    const [newClusterDesc, setNewClusterDesc] = useState('');
    const [showNewMemoModal, setShowNewMemoModal] = useState(false);
    const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
    const [newMemoQuestion, setNewMemoQuestion] = useState('');
    const [newMemoAnswer, setNewMemoAnswer] = useState('');

    const openNewMemoModal = (clusterId: string) => {
        setSelectedClusterId(clusterId);
        setShowNewMemoModal(true);
    };

    const handleCreateMemo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClusterId || !newMemoQuestion.trim() || !newMemoAnswer.trim() || !user) return;

        try {
                .insert({
            deck_id: selectedClusterId,
            user_id: user.id,
            front: newMemoQuestion,
            back: newMemoAnswer,
            next_review: new Date().toISOString(),
            interval: 0,
            repetition: 0,
            ease_factor: 2.5
        });

if (error) throw error;

setNewMemoQuestion('');
setNewMemoAnswer('');
setShowNewMemoModal(false);
// Refresh to update counts
fetchClusters();
        } catch (error) {
    console.error('Error creating memo:', error);
}
    };

const fetchClusters = async () => {
    if (!user) return;
    try {
        // Note: We are still using 'decks' table for now to avoid database migration complexity
        // but in the UI we call them Clusters.
        const { data, error } = await supabase
            .from('decks')
            .select('*, cards(count)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        setClusters(data.map(d => ({
            ...d,
            memo_count: d.cards?.[0]?.count ?? 0
        })));
    } catch (error) {
        console.error('Error fetching clusters:', error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchClusters();
}, [user]);

const handleCreateCluster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClusterTitle.trim() || !user) return;

    try {
        const { error } = await supabase
            .from('decks') // Using decks table
            .insert({
                user_id: user.id,
                title: newClusterTitle,
                description: newClusterDesc
            });

        if (error) throw error;

        setNewClusterTitle('');
        setNewClusterDesc('');
        setShowNewClusterModal(false);
        fetchClusters();
    } catch (error) {
        console.error('Error creating cluster:', error);
    }
};

return (
    <div className="max-w-7xl mx-auto">
        {/* Header & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 flex items-center gap-4"
            >
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <BookOpen size={24} />
                </div>
                <div>
                    <p className="text-white/60 text-sm">{t('dashboard.totalClusters')}</p>
                    <p className="text-2xl font-bold">{clusters.length}</p>
                </div>
            </motion.div>
            {/* More stats placeholders */}
        </div>

        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('dashboard.yourClusters')}</h2>
            <button
                onClick={() => setShowNewClusterModal(true)}
                className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl"
            >
                <Plus size={20} />
                {t('dashboard.newCluster')}
            </button>
        </div>

        {loading ? (
            <div className="text-center text-white/50 py-10">{t('app.loading')}</div>
        ) : clusters.length === 0 ? (
            <div className="text-center py-20 glass-panel">
                <BookOpen className="mx-auto text-white/20 mb-4" size={48} />
                <h3 className="text-xl font-medium mb-2">{t('dashboard.noClustersTitle')}</h3>
                <p className="text-white/50 mb-6">{t('dashboard.noClustersDesc')}</p>
                <button
                    onClick={() => setShowNewClusterModal(true)}
                    className="btn-primary"
                >
                    {t('dashboard.createCluster')}
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusters.map((cluster, i) => (
                    <motion.div
                        key={cluster.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-panel p-6 hover:bg-white/10 transition-colors group relative flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold">{cluster.title}</h3>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    openNewMemoModal(cluster.id);
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                                title={t('dashboard.addMemo', { defaultValue: 'Add Memo' })}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <p className="text-white/60 text-sm mb-4 line-clamp-2">{cluster.description || 'No description'}</p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                            <span className="text-sm text-white/50">{t('dashboard.nodesCount', { count: cluster.memo_count || 0 })}</span>
                            <Link
                                to={`/deck/${cluster.id}`}
                                className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500 hover:text-white transition-all text-sm font-medium"
                            >
                                {t('dashboard.studyNow')}
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}

        {/* New Cluster Modal */}
        {showNewClusterModal && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowNewClusterModal(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-bold mb-4">{t('dashboard.modalTitle')}</h2>
                    <form onSubmit={handleCreateCluster} className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/70 mb-1">{t('dashboard.clusterTitle')}</label>
                            <input
                                autoFocus
                                required
                                value={newClusterTitle}
                                onChange={e => setNewClusterTitle(e.target.value)}
                                className="glass-input w-full"
                                placeholder={t('dashboard.clusterTitlePlaceholder')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/70 mb-1">{t('dashboard.clusterDesc')}</label>
                            <textarea
                                value={newClusterDesc}
                                onChange={e => setNewClusterDesc(e.target.value)}
                                className="glass-input w-full h-24 resize-none"
                                placeholder={t('dashboard.clusterDescPlaceholder')}
                            />
                        </div>
                        <div className="flex gap-3 justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => setShowNewClusterModal(false)}
                                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {t('dashboard.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                {t('dashboard.create')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}

        {/* New Memo Modal */}
        {showNewMemoModal && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowNewMemoModal(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel w-full max-w-lg p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-bold mb-4">{t('dashboard.addMemo')}</h2>
                    <form onSubmit={handleCreateMemo} className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/70 mb-1">{t('dashboard.question')}</label>
                            <textarea
                                autoFocus
                                required
                                value={newMemoQuestion}
                                onChange={e => setNewMemoQuestion(e.target.value)}
                                className="glass-input w-full h-24 resize-none"
                                placeholder={t('dashboard.enterQuestion')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/70 mb-1">{t('dashboard.answer')}</label>
                            <textarea
                                required
                                value={newMemoAnswer}
                                onChange={e => setNewMemoAnswer(e.target.value)}
                                className="glass-input w-full h-24 resize-none"
                                placeholder={t('dashboard.enterAnswer')}
                            />
                        </div>
                        <div className="flex gap-3 justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => setShowNewMemoModal(false)}
                                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {t('dashboard.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                {t('dashboard.saveMemo')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
    </div>
);
};
