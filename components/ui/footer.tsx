"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, MessageCircle, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const ref = useRef<HTMLElement | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({ x: rect.width / 2, y: rect.height / 2 });
  }, []);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <footer ref={ref} onMouseMove={onMove} className="relative mt-auto">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 opacity-95" />

        {/* mouse-follow soft radial */}
        <div
          aria-hidden
          style={{
            background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(99,102,241,0.08), transparent 20%)`,
          }}
          className="absolute inset-0 mix-blend-screen"
        />

        {/* floating accent blobs */}
        <div className="absolute top-8 left-6 w-52 h-52 bg-purple-700/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-8 right-6 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl animate-[float_5s_ease-in-out_infinite]" />

        {/* subtle dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff20 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            mixBlendMode: 'overlay',
          }}
        />

        <style jsx>{`
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
        `}</style>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-7xl mx-auto px-6 sm:px-8 py-8"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-t-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-start">
                <motion.h3 className="text-white text-lg font-semibold" whileHover={{ scale: 1.02 }}>
                  Built by Fitrah Maulana Malik
                </motion.h3>
                <div className="mt-3 flex items-center gap-3">
                  <motion.span
                    className="inline-flex items-center gap-2 bg-white/6 text-sm text-gray-200 px-3 py-1 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Zap className="w-4 h-4 text-green-400" />
                    <span>Realtime System Active</span>
                  </motion.span>
                  <span className="text-sm text-gray-400">OfficeFlow SaaS</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.a
                  href="https://github.com/hopeful21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/6 hover:bg-white/10 rounded-lg transition-shadow duration-200 shadow-sm"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="w-5 h-5 text-gray-100" />
                  <span className="text-gray-100 font-medium">hopeful21</span>
                </motion.a>

                <motion.a
                  href="https://wa.me/087765061856"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/6 hover:bg-white/10 rounded-lg transition-shadow duration-200 shadow-sm"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-5 h-5 text-gray-100" />
                  <span className="text-gray-100 font-medium">WhatsApp</span>
                </motion.a>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-300">© {currentYear} OfficeFlow ERP. All rights reserved.</div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-1 rounded-full text-white text-xs font-semibold">
                  Realtime • Active
                </div>
                <div className="text-sm text-gray-400">Uptime: 99.99%</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
