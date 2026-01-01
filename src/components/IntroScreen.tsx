import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

const TITLE = 'TaskNest';
const SUBTITLE = 'by BhimSaaStudios';

function Particle({ delay, index }: { delay: number; index: number }) {
  const angle = (index / 20) * Math.PI * 2;
  const radius = 150 + Math.random() * 100;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-primary/40"
      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        x: [0, x],
        y: [0, y],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        delay: delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      style={{
        left: '50%',
        top: '50%',
      }}
    />
  );
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden z-50"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} delay={i * 0.15} index={i} />
        ))}

        {/* Rotating Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-64 h-64 rounded-full border-2 border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full border border-primary/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Pulsing Glow */}
        <motion.div
          className="absolute w-48 h-48 rounded-full tasknest-gradient blur-3xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {showContent && (
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 tasknest-gradient rounded-2xl blur-xl opacity-50" />
                <div className="relative w-24 h-24 tasknest-gradient rounded-2xl flex items-center justify-center tasknest-glow">
                  <CheckSquare className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Title with letter animation */}
            <div className="flex mb-2">
              {TITLE.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  className="text-5xl font-bold tasknest-text-gradient"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.5 + i * 0.08,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-muted-foreground mb-8 relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {SUBTITLE}
              <motion.span
                className="absolute inset-0 shimmer"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 1.5, duration: 1.5, repeat: 2 }}
              />
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.4 }}
            >
              <motion.div
                className="h-full tasknest-gradient rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </motion.div>

            <motion.p
              className="mt-3 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              Loading your workspace...
            </motion.p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
