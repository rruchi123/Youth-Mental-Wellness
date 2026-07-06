import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Heart, HandHeart, Users, Zap, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryConfig = {
  academic_stress: { 
    label: "Academic Stress", 
    color: "bg-blue-100 text-blue-700",
    icon: "📚"
  },
  loneliness: { 
    label: "Loneliness", 
    color: "bg-violet-100 text-violet-700",
    icon: "🌙"
  },
  family_issues: { 
    label: "Family", 
    color: "bg-amber-100 text-amber-700",
    icon: "🏠"
  },
  anxiety: { 
    label: "Anxiety", 
    color: "bg-rose-100 text-rose-700",
    icon: "💭"
  },
  general: { 
    label: "General", 
    color: "bg-slate-100 text-slate-700",
    icon: "💬"
  },
  relationships: { 
    label: "Relationships", 
    color: "bg-pink-100 text-pink-700",
    icon: "💕"
  },
  self_discovery: { 
    label: "Self Discovery", 
    color: "bg-teal-100 text-teal-700",
    icon: "🌱"
  }
};

const reactionIcons = {
  heart: { icon: Heart, label: "Support", color: "text-rose-500" },
  hug: { icon: HandHeart, label: "Sending warmth", color: "text-amber-500" },
  same: { icon: Users, label: "I relate", color: "text-violet-500" },
  strength: { icon: Zap, label: "Stay strong", color: "text-teal-500" }
};

export default function ForumCard({ 
  post, 
  onClick, 
  onReact,
  commentCount = 0
}) {
  const category = categoryConfig[post.category] || categoryConfig.general;
  const reactions = post.reactions || { heart: 0, hug: 0, same: 0, strength: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 p-6 cursor-pointer hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-lg">
            {category.icon}
          </div>
          <div>
            <span className="text-sm font-medium text-slate-700">
              {post.anonymous_name || "Anonymous"}
            </span>
            <p className="text-xs text-slate-400">
              {post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : 'Just now'}
            </p>
          </div>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          category.color
        )}>
          {category.label}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
        {post.title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-5">
        {post.content}
      </p>

      {/* Reactions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1">
          {Object.entries(reactionIcons).map(([key, config]) => {
            const Icon = config.icon;
            const count = reactions[key] || 0;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onReact?.(post.id, key);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors",
                  count > 0 
                    ? "bg-slate-50 hover:bg-slate-100" 
                    : "hover:bg-slate-50"
                )}
              >
                <Icon className={cn("w-4 h-4", config.color)} />
                {count > 0 && (
                  <span className="text-xs font-medium text-slate-600">{count}</span>
                )}
              </motion.button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-medium">{commentCount}</span>
        </div>
      </div>
    </motion.div>
  );
}

export { categoryConfig };