'use client';

import React, { useState, useMemo } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Info, ArrowRight, Globe, Ruler, Thermometer } from 'lucide-react';
import { ExoplanetData, processedExoplanetData, getCategoryColor } from '@/utils/exoplanetData';

interface ExoplanetExplorerProps {
    onSelectPlanet: (planet: ExoplanetData) => void;
    selectedPlanetId?: string | null;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#0F1729]/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="font-bold text-white mb-1">{data.name}</p>
                <p className="text-xs text-blue-300">Period: {data.period} days</p>
                <p className="text-xs text-purple-300">Radius: {data.radius} R⊕</p>
                <p className="text-xs text-gray-400 mt-1 capitalize">{data.category}</p>
            </div>
        );
    }
    return null;
};

export default function ExoplanetExplorer({ onSelectPlanet, selectedPlanetId }: ExoplanetExplorerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

    const filteredData = useMemo(() => {
        return processedExoplanetData.filter(planet =>
            planet.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const selectedPlanet = useMemo(() =>
        processedExoplanetData.find(p => p.id === selectedPlanetId),
        [selectedPlanetId]
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[600px] w-full">
            {/* Left Panel: Controls & List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search exoplanets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>

                {/* Planet List */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {filteredData.map((planet) => (
                        <motion.button
                            key={planet.id}
                            layoutId={`planet-${planet.id}`}
                            onClick={() => onSelectPlanet(planet)}
                            onMouseEnter={() => setHoveredPlanet(planet.id)}
                            onMouseLeave={() => setHoveredPlanet(null)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${selectedPlanetId === planet.id
                                    ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-semibold ${selectedPlanetId === planet.id ? 'text-blue-300' : 'text-white'}`}>
                                    {planet.name}
                                </h3>
                                <span
                                    className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                                    style={{
                                        borderColor: `${getCategoryColor(planet.category)}40`,
                                        color: getCategoryColor(planet.category),
                                        backgroundColor: `${getCategoryColor(planet.category)}10`
                                    }}
                                >
                                    {planet.category}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <Ruler className="w-3 h-3" />
                                    <span>{planet.radius} R⊕</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Thermometer className="w-3 h-3" />
                                    <span>{planet.temperature} K</span>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Right Panel: Visualization & Details */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                {selectedPlanet ? (
                    // Detail View
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="h-full flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-white">{selectedPlanet.name}</h2>
                            <button
                                onClick={() => onSelectPlanet(null as any)}
                                className="text-sm text-gray-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                Back to Chart
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                    <h3 className="text-sm font-medium text-gray-400 mb-4">Planet Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Radius</span>
                                            <span className="text-white font-mono">{selectedPlanet.radius} R⊕</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Mass</span>
                                            <span className="text-white font-mono">{selectedPlanet.mass} M⊕</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Temperature</span>
                                            <span className="text-white font-mono">{selectedPlanet.temperature} K</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Orbital Period</span>
                                            <span className="text-white font-mono">{selectedPlanet.period} days</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                    <h3 className="text-sm font-medium text-gray-400 mb-4">Discovery Info</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Year</span>
                                            <span className="text-white font-mono">{selectedPlanet.discoveryYear}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Method</span>
                                            <span className="text-white font-mono">Transit</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Visual */}
                            <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-xl border border-white/5 relative">
                                <h3 className="absolute top-4 left-4 text-sm font-medium text-gray-400">Size Comparison</h3>

                                <div className="flex items-end gap-8 mt-8">
                                    {/* Earth */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                                        <span className="text-xs text-gray-400">Earth</span>
                                    </div>

                                    {/* Selected Planet */}
                                    <div className="flex flex-col items-center gap-2">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                            style={{
                                                width: `${Math.max(32, Math.min(160, 32 * selectedPlanet.radius))}px`,
                                                height: `${Math.max(32, Math.min(160, 32 * selectedPlanet.radius))}px`,
                                                backgroundColor: getCategoryColor(selectedPlanet.category)
                                            }}
                                        />
                                        <span className="text-xs text-white font-medium">{selectedPlanet.name}</span>
                                    </div>

                                    {/* Jupiter (only show if planet is large) */}
                                    {selectedPlanet.radius > 4 && (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-32 h-32 rounded-full bg-orange-400/20 border-2 border-orange-400/50" />
                                            <span className="text-xs text-gray-400">Jupiter</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
                            <p>Data from NASA Exoplanet Archive</p>
                            <button
                                onClick={() => window.open(`https://exoplanetarchive.ipac.caltech.edu/overview/${selectedPlanet.name}`, '_blank')}
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                            >
                                View Official Record <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    // Scatter Plot View
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Exoplanet Population</h2>
                                <p className="text-sm text-gray-400">Radius vs. Orbital Period (Log Scale)</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                {['Terrestrial', 'Super Earth', 'Neptunian', 'Gas Giant'].map(cat => (
                                    <div key={cat} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: getCategoryColor(cat as any) }}
                                        />
                                        <span className="text-gray-300">{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis
                                        type="number"
                                        dataKey="period"
                                        name="Period"
                                        unit="d"
                                        stroke="#9ca3af"
                                        scale="log"
                                        domain={['auto', 'auto']}
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(val) => val.toFixed(0)}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="radius"
                                        name="Radius"
                                        unit="R⊕"
                                        stroke="#9ca3af"
                                        domain={[0, 20]} // Cap visual at 20 Re
                                        tick={{ fontSize: 12 }}
                                    />
                                    <ZAxis dataKey="radius" range={[60, 400]} name="Score" />
                                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter
                                        name="Exoplanets"
                                        data={filteredData}
                                        fill="#8884d8"
                                        onClick={(data) => onSelectPlanet(data)}
                                    >
                                        {filteredData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getCategoryColor(entry.category)}
                                                strokeWidth={hoveredPlanet === entry.id ? 2 : 0}
                                                stroke="#fff"
                                                className="transition-all duration-300 cursor-pointer hover:opacity-80"
                                            />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="text-center text-xs text-gray-500 mt-4">
                            Click on a planet bubble to view details
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
