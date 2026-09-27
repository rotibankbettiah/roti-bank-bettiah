import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

interface PaymentSuccessProps {
  isVisible: boolean;
  paymentId: string;
  amount: number;
  donorName: string;
  onClose: () => void;
  onPrintReceipt: () => void;
}

interface CelebrationParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  delay: number;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  isVisible,
  paymentId,
  amount,
  donorName,
  onClose,
  onPrintReceipt,
}) => {
  const [phase, setPhase] = useState<'processing' | 'success' | 'details'>('processing');
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [mealsCount, setMealsCount] = useState(0);
  const targetMeals = Math.floor(amount / 10);
  const confettiRef = useRef<boolean>(false);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setPhase('processing');
      confettiRef.current = false;
      return;
    }

    // Phase 1: Processing animation (1.5s)
    setPhase('processing');
    const timer1 = setTimeout(() => {
      setPhase('success');
      confettiRef.current = true;
      generateParticles();
    }, 1500);

    // Phase 2: Show details (3s after success)
    const timer2 = setTimeout(() => {
      setPhase('details');
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isVisible]);

  // Animated meal counter
  useEffect(() => {
    if (phase !== 'success' && phase !== 'details') return;
    
    const duration = 1500;
    const steps = 40;
    const increment = targetMeals / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetMeals) {
        setMealsCount(targetMeals);
        clearInterval(timer);
      } else {
        setMealsCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [phase, targetMeals]);

  const generateParticles = () => {
    const colors = ['#059669', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];
    const newParticles: CelebrationParticle[] = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 40 + (Math.random() - 0.5) * 30,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        speed: 100 + Math.random() * 200,
        delay: Math.random() * 0.5,
      });
    }
    setParticles(newParticles);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="payment-success-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={phase === 'details' ? onClose : undefined}
      >
        {/* Confetti */}
        {(phase === 'success' || phase === 'details') && (
          <div className="fixed inset-0 z-[101] pointer-events-none">
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={600}
              gravity={0.12}
              colors={['#059669', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']}
            />
          </div>
        )}

        {/* Celebration Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(p.angle * Math.PI / 180) * p.speed,
              y: Math.sin(p.angle * Math.PI / 180) * p.speed,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Main Card */}
        <motion.div
          className="payment-success-card relative z-[102]"
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Processing Phase */}
          {phase === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-emerald-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Payment</h3>
              <p className="text-slate-500 text-sm mb-6">Securing your generous donation...</p>
              <div className="payment-processing-bar mx-8"></div>

              {/* Animated amount display */}
              <motion.div 
                className="mt-6 text-3xl font-black text-emerald-600"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ₹{amount.toLocaleString('en-IN')}
              </motion.div>
            </motion.div>
          )}

          {/* Success Phase */}
          {(phase === 'success' || phase === 'details') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4"
            >
              {/* Success Checkmark */}
              <div className="relative">
                {/* Pulsing rings */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-emerald-400/30"
                  animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-emerald-400/20"
                  animate={{ scale: [1, 3], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />

                <motion.div
                  className="success-checkmark-circle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                >
                  <svg className="success-checkmark" viewBox="0 0 52 52">
                    <path d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </motion.div>
              </div>

              {/* Success Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-2xl font-black text-slate-900 mt-6 mb-1">
                  Thank You{donorName ? `, ${donorName}` : ''}!
                </h3>
                <p className="text-emerald-600 font-bold text-sm mb-4">
                  Your donation was successful!
                </p>
              </motion.div>

              {/* Amount Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl p-5 mb-5 border border-emerald-200/50"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 mb-2">
                  Donation Amount
                </p>
                <p className="text-4xl font-black text-emerald-700">
                  ₹{amount.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-utensils text-white text-[9px]"></i>
                  </div>
                  <span className="text-sm font-bold text-emerald-800">
                    This feeds <span className="text-emerald-600 text-lg font-black">{mealsCount}</span> meals
                  </span>
                </div>
              </motion.div>

              {/* Details Phase Content */}
              {phase === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  {/* Payment ID */}
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Payment ID</span>
                    <span className="text-xs font-black text-slate-700 font-mono">{paymentId}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={onPrintReceipt}
                      className="w-full px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-97 shadow-lg shadow-emerald-600/20 btn-premium"
                    >
                      <i className="fas fa-file-invoice"></i> Download Receipt (PDF)
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-97"
                    >
                      <i className="fas fa-check-circle text-emerald-500"></i> Done
                    </button>
                  </div>

                  {/* Trust badges */}
                  <div className="flex justify-center gap-4 pt-2">
                    {[
                      { icon: 'fa-shield-halved', text: 'Encrypted' },
                      { icon: 'fa-building-columns', text: 'RBI Regulated' },
                      { icon: 'fa-file-invoice', text: '80G Tax Benefit' },
                    ].map((badge, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        <i className={`fas ${badge.icon} text-emerald-500`}></i>
                        {badge.text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentSuccess;
