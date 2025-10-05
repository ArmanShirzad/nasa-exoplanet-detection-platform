'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-gray-400 mt-2">Last updated: {new Date().getFullYear()}</p>
        </div>

        <div className="glass rounded-xl border border-white/10 p-6 space-y-4">
          <p className="text-gray-300">
            NASA Exoplanet Explorer is a demonstration app by Armana Team for NASA Space Apps
            Challenge 2025. We keep things minimal and privacy-friendly.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white">Data You Provide</h2>
            <p className="text-gray-400 mt-1">
              If you upload files or paste data for analysis, we process them in-memory to
              generate results. We do not sell, rent, or profile your data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Storage</h2>
            <p className="text-gray-400 mt-1">
              Uploaded data is kept only as long as needed to compute results and may be
              discarded after your session. Artifacts shown in the UI are derived from your input.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Analytics & Cookies</h2>
            <p className="text-gray-400 mt-1">
              We avoid invasive tracking. If basic telemetry is enabled, it is used solely to
              improve reliability and user experience.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Third‑Party Services</h2>
            <p className="text-gray-400 mt-1">
              Links to NASA and other resources open external sites with their own policies.
              Please review those when visiting.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Contact</h2>
            <p className="text-gray-400 mt-1">
              Questions about privacy? Reach us at <a className="underline hover:text-white" href="mailto:spaceapps@nasa.gov">spaceapps@nasa.gov</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


