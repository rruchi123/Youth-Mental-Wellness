import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  MessageCircle, 
  Heart, 
  Users, 
  Calendar, 
  Music, 
  Shield,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: "AI Companion",
    description: "A gentle, understanding presence whenever you need to talk. No judgment, just support.",
    color: "from-teal-400 to-teal-500",
    bgColor: "bg-teal-50",
    link: "Chat"
  },
  {
    icon: Heart,
    title: "Daily Check-In",
    description: "Track your emotional journey with gentle prompts and reflective journaling.",
    color: "from-rose-400 to-rose-500",
    bgColor: "bg-rose-50",
    link: "MoodCheckIn"
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect anonymously with others who understand. You're not the only one feeling this way.",
    color: "from-violet-400 to-violet-500",
    bgColor: "bg-violet-50",
    link: "Community"
  },
  {
    icon: Calendar,
    title: "Expert Support",
    description: "Book anonymous sessions with verified mental health professionals.",
    color: "from-blue-400 to-blue-500",
    bgColor: "bg-blue-50",
    link: "Experts"
  },
  {
    icon: Music,
    title: "Music & Mood",
    description: "Discover insights about your emotions through the music that moves you.",
    color: "from-amber-400 to-amber-500",
    bgColor: "bg-amber-50",
    link: "MusicMood"
  },
  {
    icon: Shield,
    title: "Your Privacy",
    description: "Anonymous by design. Your thoughts stay yours. Always.",
    color: "from-slate-400 to-slate-500",
    bgColor: "bg-slate-50",
    link: null
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Everything you need, nothing you don't
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Simple tools designed with care to support your mental wellness journey.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const content = (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative p-8 rounded-3xl ${feature.bgColor} border border-transparent hover:border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-100 cursor-pointer`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
                {feature.link && (
                  <div className="mt-4 flex items-center text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.div>
            );

            return feature.link ? (
              <Link key={index} to={createPageUrl(feature.link)}>
                {content}
              </Link>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}