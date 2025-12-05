'use client';

import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37]/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#B8860B]/10 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20"
        >
          <Construction className="w-12 h-12 text-black" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Bakım Modu
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 mb-8 leading-relaxed">
          Sizlere daha iyi hizmet verebilmek için sitemizi yeniliyoruz.<br />
          Kenan Kadıoğlu Gayrimenkul olarak çok yakında yepyeni yüzümüzle karşınızda olacağız.
        </p>

        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[#D4AF37] text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
          </span>
          Geliştirme devam ediyor
        </div>

        {/* Admin Giriş Linki */}
        <div className="mt-12">
           <Link href="/admin/login" className="text-white/20 hover:text-white/40 text-xs transition-colors">
              Yönetici Girişi
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
