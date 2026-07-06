import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Globe, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ExpertCard({ expert, onBook }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
    >
      {/* Header with gradient */}
      <div className="h-24 bg-gradient-to-br from-teal-400 via-teal-500 to-violet-500 relative">
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg p-1">
            {expert.avatar_url ? (
              <img 
                src={expert.avatar_url} 
                alt={expert.name}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-400">
                  {expert.name?.charAt(0) || 'E'}
                </span>
              </div>
            )}
          </div>
        </div>
        {expert.is_verified && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-medium text-white">Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-14 px-6 pb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{expert.name}</h3>
          <p className="text-sm text-slate-500">{expert.title}</p>
        </div>

        {/* Rating & Sessions */}
        <div className="flex items-center gap-4 mb-4">
          {expert.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-slate-700">{expert.rating.toFixed(1)}</span>
            </div>
          )}
          {expert.sessions_completed && (
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{expert.sessions_completed} sessions</span>
            </div>
          )}
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {expert.specializations?.slice(0, 3).map((spec, i) => (
            <Badge 
              key={i} 
              variant="secondary"
              className="bg-teal-50 text-teal-700 hover:bg-teal-100"
            >
              {spec}
            </Badge>
          ))}
          {expert.specializations?.length > 3 && (
            <Badge variant="secondary" className="bg-slate-50 text-slate-500">
              +{expert.specializations.length - 3}
            </Badge>
          )}
        </div>

        {/* Languages */}
        {expert.languages?.length > 0 && (
          <div className="flex items-center gap-2 mb-5 text-slate-500">
            <Globe className="w-4 h-4" />
            <span className="text-sm">{expert.languages.join(', ')}</span>
          </div>
        )}

        {/* Bio */}
        {expert.bio && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-5">
            {expert.bio}
          </p>
        )}

        {/* Book Button */}
        <Button
          onClick={() => onBook(expert)}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-xl"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Session
        </Button>
      </div>
    </motion.div>
  );
}