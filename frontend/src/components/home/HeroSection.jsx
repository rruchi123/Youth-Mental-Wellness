import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageCircle, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quotes = [
  {
    text: "The privilege of a lifetime is to become who you truly are.",
    author: "Carl Jung"
  },
  {
    text: "He who has a why to live can bear almost any how.",
    author: "Viktor Frankl"
  },
  {
    text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi"
  },
  {
    text: "Out of your vulnerabilities will come your strength.",
    author: "Sigmund Freud"
  }
];

export default function HeroSection() {
  const [currentQuote] = React.useState(() => 
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-violet-50 to-rose-50">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-sm">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-slate-600">Your safe space</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            You're not alone
          </span>
          <br />
          <span className="bg-gradient-to-r from-teal-600 via-violet-500 to-rose-400 bg-clip-text text-transparent">
            in this.
          </span>
        </motion.h1>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <blockquote className="text-lg md:text-xl text-slate-600 italic leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          <p className="mt-3 text-sm text-slate-500 font-medium">— {currentQuote.author}</p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to={createPageUrl('Chat')}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/25 px-8 py-6 text-lg rounded-2xl"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Talk to someone
            </Button>
          </Link>
          <Link to={createPageUrl('MoodCheckIn')}>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-slate-200 hover:bg-white/60 px-8 py-6 text-lg rounded-2xl"
            >
              <Heart className="w-5 h-5 mr-2 text-rose-400" />
              Check in with yourself
            </Button>
          </Link>
        </motion.div>

        {/* Subtle reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-8 text-sm text-slate-500"
        >
          You don't have to explain everything. Just start where you are.
        </motion.p>
      </div>
    </section>
  );
}