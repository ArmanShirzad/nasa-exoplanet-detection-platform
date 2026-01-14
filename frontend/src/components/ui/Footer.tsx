'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Star, Heart, Github, Instagram, ExternalLink, Mail } from 'lucide-react';

export default function Footer({ onNavigateToSection }: { onNavigateToSection?: (section: string) => void }) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#') && onNavigateToSection) {
      e.preventDefault();
      const section = href.substring(1);
      onNavigateToSection(section);
    }
  };

  const navigation = {
    main: [
      { name: 'Home', href: '#home' },
      { name: 'Meet the Data', href: '#data' },
      { name: 'Analysis', href: '#analysis' },
      { name: 'About', href: '#about' },
    ],
    resources: [
      { name: 'NASA Exoplanet Archive', href: 'https://exoplanetarchive.ipac.caltech.edu/' },
      { name: 'TESS Data', href: 'https://tess.mit.edu/' },
      { name: 'Kepler Data', href: 'https://www.nasa.gov/mission_pages/kepler/main/' },
      { name: 'K2 Mission', href: 'https://www.nasa.gov/mission_pages/kepler/main/' },
    ],
    community: [
      { name: 'Space Apps Challenge', href: 'https://www.spaceappschallenge.org/' },
      { name: 'NASA GitHub', href: 'https://github.com/nasa' },
      { name: 'Exoplanet Science', href: 'https://exoplanets.nasa.gov/' },
      { name: 'Astrophysics Division', href: 'https://science.nasa.gov/astrophysics' },
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://gitlab.com/armana-team/nasa-exoplanet-2025/', color: 'hover:text-gray-300' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/armana.team', color: 'hover:text-pink-400' },
    { name: 'Team', icon: ExternalLink, href: 'https://teamarmana-nasaspaceapp2025.vercel.app/', color: 'hover:text-red-400' },
    { name: 'Contact', icon: Mail, href: 'mailto:spaceapps@nasa.gov', color: 'hover:text-green-400' },
  ];

  return (
    <footer className="bg-black/20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-space-500 to-nebula-500 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">NASA Exoplanet Explorer</h3>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star className="w-3 h-3" />
                    <span>Powered by Armana Team- NASA Space Apps Challenge 2025</span>
                  </div>
                  <a
                    href="https://armanshirzad.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-nebula-400 hover:text-nebula-300 transition-colors flex items-center gap-1"
                  >
                    <span>Created by Arman Shirzad</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </motion.div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Discover worlds beyond our solar system with the same tools NASA uses.
              Advanced AI analysis for exoplanet detection from space-based light curves.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg bg-white/10 text-gray-400 transition-all duration-200 ${link.color}`}
                  aria-label={link.name}
                >
                  <link.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-gray-400 hover:text-nebula-400 transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-nebula-400 transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Community</h4>
            <ul className="space-y-2">
              {navigation.community.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-nebula-400 transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-white/10 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© {currentYear} NASA Space Apps Challenge</span>
              <span>•</span>
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-500" />
              </motion.div>
              <span>for space exploration</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Open Source
              </a>
            </div>
          </div>

          {/* NASA Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 glass rounded-lg"
          >
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This application is developed as part of the NASA Space Apps Challenge.
              While it uses NASA data and follows scientific principles.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
