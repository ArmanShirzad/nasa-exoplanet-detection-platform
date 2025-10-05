'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          <p className="text-gray-400 mt-2">Last updated: {new Date().getFullYear()}</p>
        </div>

        <div className="glass rounded-xl border border-white/10 p-6 space-y-4">
          <p className="text-gray-300">
            NASA Exoplanet Explorer is provided by Armana Team for the NASA Space Apps
            Challenge 2025 as an experimental demonstration. By using this site, you agree to
            these short terms.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white">No Warranty</h2>
            <p className="text-gray-400 mt-1">
              The service is provided “as is.” We do not guarantee accuracy, availability,
              or fitness for any purpose. Use at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Acceptable Use</h2>
            <p className="text-gray-400 mt-1">
              Do not upload harmful, illegal, or third‑party confidential data. You are
              responsible for your inputs and outputs.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Intellectual Property</h2>
            <p className="text-gray-400 mt-1">
              This project may include open data from NASA and related missions. External
              resources remain the property of their respective owners.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Changes</h2>
            <p className="text-gray-400 mt-1">
              We may update these terms and the app without notice. Continued use constitutes
              acceptance of changes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">Contact</h2>
            <p className="text-gray-400 mt-1">
              Questions about these terms? Contact <a className="underline hover:text-white" href="mailto:spaceapps@nasa.gov">spaceapps@nasa.gov</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


