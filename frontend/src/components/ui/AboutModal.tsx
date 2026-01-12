'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Book, Mail } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0F1729] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-bold text-white">About This Demo</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Purpose</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    This platform demonstrates advanced ML/AI capabilities for detecting exoplanets from Kepler & TESS light curve data.
                                    It showcases the intersection of space science and modern web technologies.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Recharts', 'Python ML Backend'].map((tech) => (
                                        <span key={tech} className="px-3 py-1 text-xs font-medium text-white bg-white/10 rounded-full border border-white/10">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Links & Contact</h3>
                                <div className="space-y-3">
                                    <a href="https://github.com/ArmanShirzad/nasa-exoplanet-detection-platform" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                                        <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                        <div>
                                            <div className="text-sm font-medium text-white">GitHub Repository</div>
                                            <div className="text-xs text-gray-500">Source code and documentation</div>
                                        </div>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                                        <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                        <div>
                                            <div className="text-sm font-medium text-white">Contact Team</div>
                                            <div className="text-xs text-gray-500">questions@example.com</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5 text-center">
                            <p className="text-xs text-gray-500">
                                Built for NASA Space Apps Challenge 2025 • Designed with ❤️ by Armana Team
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
