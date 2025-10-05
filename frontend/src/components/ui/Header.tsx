'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Star, Menu, X, Github, Instagram, ExternalLink, Map } from 'lucide-react';

interface HeaderProps {
  onOpen3DViewer?: () => void;
}

export default function Header({ onOpen3DViewer }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Meet the Data', href: '#data' },
    { name: 'Analysis', href: '#analysis' },
    { name: 'About', href: '#about' },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://gitlab.com/armana-team/nasa-exoplanet-2025/' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/armana.team' },
    { name: 'NASA', icon: ExternalLink, href: 'https://www.nasa.gov' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-space-500 to-nebula-500 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NASA Exoplanet Explorer</h1>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Star className="w-3 h-3" />
                <span>Powered by Armana Team- NASA Space Apps Challenge 2025</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ y: -2 }}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-space-400 to-nebula-400 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          {/* 3D Map Button & Social Links */}
          <div className="hidden md:flex items-center gap-4">
            {/* 3D Map Button */}
            {onOpen3DViewer && (
              <motion.button
                onClick={onOpen3DViewer}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-space-500 to-nebula-500 text-white hover:from-space-600 hover:to-nebula-600 transition-all duration-200 shadow-lg"
                title="Open 3D Exoplanet Map"
              >
                <Map className="w-4 h-4" />
                <span className="text-sm font-medium">3D Map</span>
              </motion.button>
            )}
            
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-200"
                aria-label={link.name}
              >
                <link.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  whileHover={{ x: 10 }}
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>
            
            {/* Mobile 3D Map Button */}
            {onOpen3DViewer && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <motion.button
                  onClick={() => {
                    onOpen3DViewer();
                    setIsMenuOpen(false);
                  }}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg bg-gradient-to-r from-space-500 to-nebula-500 text-white hover:from-space-600 hover:to-nebula-600 transition-all duration-200"
                >
                  <Map className="w-5 h-5" />
                  <span className="font-medium">3D Exoplanet Map</span>
                </motion.button>
              </div>
            )}
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-200"
                  aria-label={link.name}
                >
                  <link.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
