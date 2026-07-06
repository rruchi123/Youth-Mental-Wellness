import React from 'react';
import { motion } from 'framer-motion';

const messages = [
  "It's okay to not be okay",
  "Your feelings are valid",
  "Healing isn't linear",
  "Small steps still count",
  "You deserve support"
];

export default function ReassuranceSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-medium text-slate-700 mb-12">
            Some things you might need to hear
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 font-medium"
            >
              {message}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-teal-50 to-violet-50 rounded-2xl border border-slate-100">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white"
                />
              ))}
            </div>
            <p className="text-slate-600">
              <span className="font-semibold text-slate-700">Thousands</span> of young people are here, just like you
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}