import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, GraduationCap, Loader2 } from 'lucide-react';

interface Card {
    id: string;
    front: string;
    back: string;
    next_review: string;
}

interface Deck {
    id: string;
    title: string;
    description: string;
}

export const DeckDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddCard, setShowAddCard] = useState(false);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id, user]);

    const fetchData = async () => {
        if (!id || !user) return;
        try {
            const { data: deckData, error: deckError } = await supabase.from('decks').select('*').eq('id', id).single();
            const { data: cardData, error: cardError } = await supabase.from('cards').select('*').eq('deck_id', id).order('created_at', { ascending: false });

            if (deckError) throw deckError;
            if (cardError) throw cardError;

            setDeck(deckData);
            setCards(cardData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!front.trim() || !back.trim() || !user || !id) return;
        setAdding(true);

        try {
            const { error } = await supabase.from('cards').insert({
                deck_id: id,
                front,
                back,
                next_review: new Date().toISOString(),
                interval: 0,
                repetition: 0,
                ease_factor: 2.5
            });

            if (error) throw error;

            setFront('');
            setBack('');
            setShowAddCard(false);
            fetchData();
        } catch (error) {
            console.error('Error adding card:', error);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm('Are you sure you want to delete this card?')) return;
        try {
            const { error } = await supabase.from('cards').delete().eq('id', cardId);
            if (error) throw error;
            setCards(cards.filter(c => c.id !== cardId));
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    if (loading) return <div className="text-center text-white/50 py-10">Loading...</div>;
    if (!deck) return <div className="text-center text-white/50 py-10">Deck not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={20} />
                Back to Dashboard
            </Link>

            <div className="glass-panel p-6 mb-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-white">{deck.title}</h1>
                            <p className="text-white/60">{deck.description}</p>
                        </div>
                        <Link
                            to={`/review/${id}`}
                            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-xl shadow-indigo-500/20 whitespace-nowrap"
                        >
                            <GraduationCap size={24} />
                            Start Review
                        </Link>
                    </div>
                    <div className="mt-6 flex gap-4 text-sm text-white/40 font-mono">
                        <span>{cards.length} Cards</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Cards</h2>
                <button
                    onClick={() => setShowAddCard(true)}
                    className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Card
                </button>
            </div>

            <div className="space-y-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-panel p-4 flex justify-between items-center group hover:bg-white/5 transition-colors"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mr-4">
                            <div>
                                <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider block mb-1">Front</span>
                                <p className="font-medium text-white/90">{card.front}</p>
                            </div>
                            <div>
                                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block mb-1">Back</span>
                                <p className="text-white/70">{card.back}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </motion.div>
                ))}
                {cards.length === 0 && (
                    <div className="text-center py-12 text-white/30 italic">No cards yet. Add some to start learning!</div>
                )}
            </div>

            {/* Add Card Modal */}
            {showAddCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddCard(false)}>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel w-full max-w-lg p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4 text-white">Add New Card</h2>
                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Front (Question)</label>
                                <textarea
                                    autoFocus
                                    required
                                    value={front}
                                    onChange={e => setFront(e.target.value)}
                                    className="glass-input w-full h-24 resize-none font-medium"
                                    placeholder="Enter the question..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Back (Answer)</label>
                                <textarea
                                    required
                                    value={back}
                                    onChange={e => setBack(e.target.value)}
                                    className="glass-input w-full h-24 resize-none"
                                    placeholder="Enter the answer..."
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddCard(false)}
                                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="btn-primary px-6 py-2 rounded-lg flex items-center gap-2"
                                >
                                    {adding && <Loader2 className="animate-spin" size={16} />}
                                    Add Card
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
