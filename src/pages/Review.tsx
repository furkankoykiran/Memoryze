import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { calculateSM2 } from '../lib/sm2';
import { useTranslation } from 'react-i18next';

interface Card {
  id: string;
  front: string;
  back: string;
  next_review: string;
  interval: number;
  repetition: number;
  ease_factor: number;
}

export const Review = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (id && user) fetchReviews();
  }, [id, user]);

  const fetchReviews = async () => {
    try {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', id)
        .lte('next_review', today) // Review cards that are due
        .order('next_review', { ascending: true })
        .limit(20);

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (grade: number) => {
    const card = cards[currentCardIndex];

    const result = calculateSM2({
      q: grade,
      repetition: card.repetition,
      ef: card.ease_factor,
      interval: card.interval
    });

    // Backend update
    supabase.from('cards').update({
      next_review: result.nextReviewDate.toISOString(),
      interval: result.interval,
      repetition: result.repetition,
      ease_factor: result.ef
    }).eq('id', card.id).then(({ error }) => {
      if (error) console.error("Update failed", error);
    });

    // Reset flip
    setIsFlipped(false);

    // Logic: If grade is 0 (Again) or 3 (Hard), re-queue the card
    // Note: We won't count it as a "completed" review for the session progress
    if (grade < 4) {
      // Add a copy of the card to the end of the queue to review again in this session
      setCards(prev => [...prev, card]);
    } else {
      // Only count as completed if grade is Good or Easy
      setCompletedCount(prev => prev + 1);
    }

    const nextIndex = currentCardIndex + 1;
    if (nextIndex >= cards.length) {
      setSessionComplete(true);
    } else {
      setCurrentCardIndex(nextIndex);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white/50">{t('app.loading')}</div>;

  if (cards.length === 0 && !sessionComplete) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center glass-panel p-10">
        <CheckCircle size={64} className="mx-auto text-emerald-400 mb-6" />
        <h2 className="text-2xl font-bold mb-2 text-white">{t('deck.review.allCaughtUp')}</h2>
        <p className="text-white/60 mb-8">{t('deck.review.noCardsDue')}</p>
        <Link to="/dashboard" className="btn-primary px-6 py-3 rounded-xl inline-block">{t('deck.review.backToDashboard')}</Link>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center glass-panel p-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">{t('deck.review.sessionComplete')}</h2>
          <p className="text-white/60 mb-8">{t('deck.review.reviewedCards', { count: completedCount })}</p>
          <Link to="/dashboard" className="btn-primary px-8 py-3 rounded-xl inline-block font-bold">{t('deck.review.backToDashboard')}</Link>
        </motion.div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <div className="text-white/40 text-sm font-mono">
          {/* Show progress based on completed vs initial unique cards, or just index */}
          Card {currentCardIndex + 1} / {cards.length}
        </div>
        <div className="w-6" />
      </div>

      <div className="flex-1 flex flex-col justify-center relative perspective-1000">
        <motion.div
          className="glass-panel p-10 min-h-[350px] flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl relative z-10"
          onClick={() => !isFlipped && setIsFlipped(true)}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 flex items-center justify-center p-8 backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <div>
              <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-4 block">{t('deck.review.question')}</span>
              <h3 className="text-2xl font-medium leading-relaxed text-white">{currentCard.front}</h3>
            </div>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 flex items-center justify-center p-8 backface-hidden"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div>
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-4 block">{t('deck.review.answer')}</span>
              <h3 className="text-2xl font-medium leading-relaxed text-white">{currentCard.back}</h3>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center h-24">
          {!isFlipped ? (
            <p className="text-white/40 animate-pulse">{t('deck.review.tapToFlip')}</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-3"
            >
              <button onClick={() => handleGrade(0)} className="p-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all">
                <span className="block text-xs font-bold uppercase opacity-70 mb-1">{t('deck.review.difficulty.again')}</span>
                <span className="text-sm">{t('deck.review.sub.cannot')}</span>
              </button>
              <button onClick={() => handleGrade(3)} className="p-3 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500 hover:text-white transition-all">
                <span className="block text-xs font-bold uppercase opacity-70 mb-1">{t('deck.review.difficulty.hard')}</span>
                <span className="text-sm">{t('deck.review.sub.struggled')}</span>
              </button>
              <button onClick={() => handleGrade(4)} className="p-3 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500 hover:text-white transition-all">
                <span className="block text-xs font-bold uppercase opacity-70 mb-1">{t('deck.review.difficulty.good')}</span>
                <span className="text-sm">{t('deck.review.sub.recall')}</span>
              </button>
              <button onClick={() => handleGrade(5)} className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all">
                <span className="block text-xs font-bold uppercase opacity-70 mb-1">{t('deck.review.difficulty.easy')}</span>
                <span className="text-sm">{t('deck.review.sub.perfect')}</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
