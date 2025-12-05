'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary-gold to-primary-gold/20 leading-none select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4 max-w-lg mx-auto"
        >
          <h2 className="text-3xl font-bold text-white">
            Sayfa Bulunamadı
          </h2>
          <p className="text-white/40 text-lg">
            Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir. 
            Yolunuzu kaybetmiş gibi görünüyorsunuz.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all flex items-center gap-2 group w-full sm:w-auto justify-center"
          >
            <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Geri Dön</span>
          </button>

          <Link 
            href="/"
            className="px-8 py-3 rounded-xl bg-primary-gold text-black font-semibold hover:bg-primary-gold-dark transition-all flex items-center gap-2 group w-full sm:w-auto justify-center shadow-lg shadow-primary-gold/20"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfa</span>
          </Link>
        </motion.div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}
