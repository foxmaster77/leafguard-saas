'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot
} from 'recharts';
import {
  Play, Pause, RotateCcw, AlertTriangle, TrendingUp, Info, Activity, ShieldAlert, Zap
} from 'lucide-react';

export interface PincodeCluster {
  pincode: string;
  district: string;
  latitude: number;
  longitude: number;
  topDisease: string;
  cropType: string;
  totalCases: number;
  cases48h: number;
  outbreakLevel: 'RED' | 'YELLOW' | 'GREEN';
  latestTimestamp: string;
}

type Props = {
  baseClusters: PincodeCluster[];
  onClustersUpdate: (simulatedClusters: PincodeCluster[], activeDay: number) => void;
};

const GROWTH_RATE = 0.18; // 18% daily growth rate (tunable illustrative model)

export default function SpreadSimulator({ baseClusters = [], onClustersUpdate }: Props) {
  const [activeDay, setActiveDay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate 7-day projection dataset for the line/area chart
  const chartData = React.useMemo(() => {
    try {
      const days = [0, 1, 2, 3, 4, 5, 6, 7];
      return days.map((day) => {
        let total = 0;
        let redCount = 0;
        let yellowCount = 0;

        baseClusters.forEach((c) => {
          const base = c.totalCases || 1;
          const projected = Math.round(base * Math.pow(1 + GROWTH_RATE, day));
          total += projected;
          if (projected >= 5) redCount++;
          else if (projected >= 3) yellowCount++;
        });

        return {
          day,
          name: day === 0 ? 'Today (Live)' : `Day ${day}`,
          shortName: day === 0 ? 'Live' : `D${day}`,
          projectedCases: total,
          redCount,
          yellowCount
        };
      });
    } catch (e) {
      console.warn('Projection calculation error:', e);
      return [];
    }
  }, [baseClusters]);

  // Compute simulated clusters for the current activeDay and notify parent
  const applyDaySimulation = (day: number) => {
    try {
      if (day === 0) {
        onClustersUpdate(baseClusters, 0);
        return;
      }

      const simulated = baseClusters.map((c) => {
        const base = c.totalCases || 1;
        const projectedCases = Math.round(base * Math.pow(1 + GROWTH_RATE, day));
        const projected48h = Math.round((c.cases48h || 1) * Math.pow(1 + GROWTH_RATE, day));

        let level: 'RED' | 'YELLOW' | 'GREEN' = 'GREEN';
        if (projectedCases >= 5) level = 'RED';
        else if (projectedCases >= 3) level = 'YELLOW';

        return {
          ...c,
          totalCases: projectedCases,
          cases48h: projected48h,
          outbreakLevel: level
        };
      });

      onClustersUpdate(simulated, day);
    } catch (e) {
      console.warn('Simulation update failed, falling back to base clusters:', e);
      onClustersUpdate(baseClusters, 0);
    }
  };

  // Handle Play/Pause Auto-cycling animation (every ~800ms per day)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveDay((prev) => {
          if (prev >= 7) {
            setIsPlaying(false);
            return 7;
          }
          const next = prev + 1;
          applyDaySimulation(next);
          return next;
        });
      }, 850);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, baseClusters]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (activeDay >= 7) {
        // Reset to day 1 if already at end
        setActiveDay(1);
        applyDaySimulation(1);
      }
      setIsPlaying(true);
    }
  };

  const handleSelectDay = (day: number) => {
    setIsPlaying(false);
    setActiveDay(day);
    applyDaySimulation(day);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveDay(0);
    applyDaySimulation(0);
  };

  const currentStats = chartData[activeDay] || chartData[0] || { projectedCases: 0, redCount: 0 };
  const baselineCases = chartData[0]?.projectedCases || 1;
  const percentGrowth = Math.round(((currentStats.projectedCases - baselineCases) / baselineCases) * 100);

  return (
    <div className="bg-[#0F1409] rounded-3xl border border-white/10 p-5 sm:p-6 space-y-5">
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#C8F53E]/10 border border-[#C8F53E]/20 text-[#C8F53E]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider flex items-center gap-2">
              Predictive Spread Simulator
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeDay > 0
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : 'bg-[#C8F53E]/10 text-[#C8F53E] border border-[#C8F53E]/30'
              }`}>
                {activeDay > 0 ? `DAY ${activeDay} OF 7 SIMULATED` : 'LIVE DATA (DAY 0)'}
              </span>
            </h3>
          </div>
          <p className="text-xs text-gray-400 font-sans">
            Client-side temporal projection based on current cluster pathogen density (R₀ = 1.18).
          </p>
        </div>

        {/* Buttons: Play/Pause & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-lg ${
              isPlaying
                ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-amber-400/20'
                : 'bg-[#C8F53E] text-black hover:bg-[#b8e52e] shadow-[#C8F53E]/20 hover:scale-[1.02]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{activeDay === 0 ? '▶ Simulate 7-Day Spread' : 'Resume Simulation'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={activeDay === 0 && !isPlaying}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-900 border border-white/10 hover:border-[#C8F53E]/40 text-gray-300 hover:text-white font-mono text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Reset to live current detections"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Interactive Day Scrubber Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span>Simulation Timeline:</span>
          <span className="text-[#C8F53E] font-bold">
            {activeDay === 0 ? 'Baseline (Live)' : `Projected Day +${activeDay}`}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {chartData.map((d) => {
            const isActive = activeDay === d.day;
            return (
              <button
                key={`btn-day-${d.day}`}
                onClick={() => handleSelectDay(d.day)}
                className={`py-2 px-1 rounded-xl text-xs font-mono transition-all text-center cursor-pointer ${
                  isActive
                    ? 'bg-[#C8F53E] text-black font-bold shadow-[0_0_12px_rgba(200,245,62,0.4)] scale-105'
                    : 'bg-black/40 text-gray-400 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="block text-[10px] opacity-70">
                  {d.day === 0 ? '🔴' : `+${d.day}d`}
                </span>
                <span className="font-bold">{d.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Simulated Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">
            Projected Cases
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-white font-mono">
              {currentStats.projectedCases}
            </span>
            {activeDay > 0 && (
              <span className="text-[10px] font-mono font-bold text-red-400">
                (+{percentGrowth}%)
              </span>
            )}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">
            High-Risk Zones
          </span>
          <span className="text-xl font-black text-red-400 font-mono">
            {currentStats.redCount} Districts
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">
            Growth Rate
          </span>
          <span className="text-xl font-black text-[#C8F53E] font-mono">
            +18% / day
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">
            Containment Window
          </span>
          <span className="text-xl font-black text-amber-300 font-mono">
            {activeDay < 3 ? '48h Critical' : 'Intervention Needed'}
          </span>
        </div>
      </div>

      {/* Projection Line/Area Chart */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#C8F53E]" />
            Cumulative Regional Disease Trajectory
          </span>
          <span className="text-gray-500 text-[10px]">
            Values in total cases across surveyed districts
          </span>
        </div>

        <div className="h-44 w-full bg-black/30 rounded-2xl p-3 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spreadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeDay > 0 ? '#FF4F4F' : '#C8F53E'} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={activeDay > 0 ? '#FF4F4F' : '#C8F53E'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis
                dataKey="shortName"
                stroke="#ffffff30"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#ffffff30"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1409',
                  borderColor: activeDay > 0 ? '#FF4F4F' : '#C8F53E',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#fff'
                }}
                formatter={(value: any) => [`${value} Cases`, 'Projected Total']}
                labelFormatter={(label: any) => `Timeline: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="projectedCases"
                stroke={activeDay > 0 ? '#FF4F4F' : '#C8F53E'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spreadGradient)"
              />
              {/* Highlight active day marker */}
              {chartData[activeDay] && (
                <ReferenceDot
                  x={chartData[activeDay].shortName}
                  y={chartData[activeDay].projectedCases}
                  r={5}
                  fill={activeDay > 0 ? '#FF4F4F' : '#C8F53E'}
                  stroke="#fff"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Illustrative Model Disclaimer (Requirement 2) */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-black/50 border border-white/5 text-[11px] text-gray-400">
        <Info className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
        <p className="leading-tight">
          Simulated projection based on current detection density — illustrative, not a certified epidemiological forecast.
        </p>
      </div>
    </div>
  );
}
