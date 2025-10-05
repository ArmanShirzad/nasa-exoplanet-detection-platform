'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Hash } from 'lucide-react';

export interface TabularFeaturesInput {
  period_days: number | string;
  transit_depth_ppm: number | string;
  planet_radius_re: number | string;
  stellar_radius_rs: number | string;
  snr: number | string;
}

export default function TabularMVPForm({ onSubmit }: { onSubmit: (features: TabularFeaturesInput) => void }) {
  const [features, setFeatures] = useState<TabularFeaturesInput>({
    period_days: '',
    transit_depth_ppm: '',
    planet_radius_re: '',
    stellar_radius_rs: '',
    snr: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValidNumber = (v: string) => v !== '' && !Number.isNaN(Number(v));
  const isPositive = (v: string) => Number(v) > 0;

  const update = useCallback((k: keyof TabularFeaturesInput, v: string) => {
    setFeatures(prev => ({ ...prev, [k]: v }));
  }, []);

  const validateField = useCallback((k: keyof TabularFeaturesInput, v: string) => {
    let msg = '';
    if (!isValidNumber(v)) msg = 'Required numeric value';
    else if (!isPositive(v)) msg = 'Must be > 0';
    setErrors(prev => ({ ...prev, [k]: msg }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const keys: (keyof TabularFeaturesInput)[] = ['period_days','transit_depth_ppm','planet_radius_re','stellar_radius_rs','snr'];
    const nextErrors: Record<string, string> = {};
    let ok = true;
    keys.forEach(k => {
      const v = String(features[k] ?? '');
      const msg = (!isValidNumber(v)) ? 'Required numeric value' : (!isPositive(v) ? 'Must be > 0' : '');
      if (msg) ok = false;
      nextErrors[k as string] = msg;
    });
    setErrors(nextErrors);
    if (!ok) return;
    onSubmit(features);
  }, [features, onSubmit]);

  const canSubmit = useMemo(() => {
    const keys: (keyof TabularFeaturesInput)[] = ['period_days','transit_depth_ppm','planet_radius_re','stellar_radius_rs','snr'];
    return keys.every(k => {
      const v = String(features[k] ?? '');
      return isValidNumber(v) && isPositive(v) && !(errors[k as string]);
    });
  }, [features, errors]);

  const Input = useCallback(({ label, field, unit }: { label: string; field: keyof TabularFeaturesInput; unit?: string }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <Hash className="w-4 h-4 text-space-400" />
        {label}
        {unit && <span className="text-xs text-gray-500">({unit})</span>}
      </label>
      <input
        type="number"
        value={features[field]}
        onChange={(e) => { update(field, e.target.value); }}
        onBlur={(e) => { validateField(field, e.target.value); }}
        placeholder="e.g., 10.5"
        className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-space-400/20 transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm ${errors[field] ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-space-400'}`}
      />
      {errors[field] && <p className="text-xs text-red-400">{errors[field]}</p>}
    </div>
  ), [features, errors, update, validateField]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="period_days" field="period_days" />
        <Input label="transit_depth_ppm" field="transit_depth_ppm" />
        <Input label="planet_radius_re" field="planet_radius_re" />
        <Input label="stellar_radius_rs" field="stellar_radius_rs" />
        <Input label="snr" field="snr" />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-space-500 to-nebula-500 text-white font-semibold rounded-lg shadow-lg hover:from-space-600 hover:to-nebula-600 focus:ring-4 focus:ring-space-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canSubmit}
      >
        <span className="flex items-center justify-center gap-2">
          <Activity className="w-5 h-5" />
          Analyze Tabular (MVP)
        </span>
      </motion.button>
    </motion.form>
  );
}


