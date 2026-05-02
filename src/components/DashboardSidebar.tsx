'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Satellite, 
  Map as MapIcon, 
  Activity, 
  Settings, 
  ShieldCheck, 
  ChevronRight,
  LogOut,
  Bell,
  Newspaper
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: <LayoutDashboard size={22} />, label: 'COMMAND CENTER', href: '#overview' },
  { icon: <Satellite size={22} />, label: 'NEURAL SCANNER', href: '#ai-analyzer' },
  { icon: <MapIcon size={22} />, label: 'GRID GEOGRAPHY', href: '#overview' },
  { icon: <Activity size={22} />, label: 'VITALITY FEED', href: '#ai-analyzer' },
  { icon: <ShieldCheck size={22} />, label: 'BACKBONE INFRA', href: '#infrastructure' },
  { icon: <Settings size={22} />, label: 'SYSTEM CONFIG', href: '#infrastructure' },
];

const agriNews = [
  "RICE PRICES UP 12%",
  "SWARM WARNING: NORTH",
  "SUBSIDY PROGRAM OPEN",
  "PADDY SOWING: 48H",
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar: Fixed 260px */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] bg-[#060A04] border-r border-white/5 flex-col z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_#C8F53E]">
              <Satellite size={20} className="text-dark" />
            </div>
            <span className="font-black tracking-tighter text-xl uppercase italic">AGRO_OS V4</span>
          </div>

          <nav className="space-y-1 overflow-y-auto custom-scrollbar pr-2">
            {menuItems.map((item) => (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between group p-4 rounded-xl transition-all duration-300 border-l-[3px] ${
                  pathname === item.href 
                  ? 'bg-brand/10 text-brand border-brand shadow-[inset_4px_0_0_rgba(200,245,62,0.1)]' 
                  : 'hover:bg-brand/5 text-text-muted hover:text-text-main border-transparent hover:border-brand/20'
                }`}
              >
                <div className="flex items-center gap-[12px]">
                  <span className="text-brand group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-[0.75rem] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Pinned Bottom Section */}
        <div className="mt-auto p-6 bg-[#060A04]/80 backdrop-blur-xl border-t border-white/5 space-y-6 sticky bottom-0">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 overflow-hidden group">
             <div className="flex items-center gap-2 mb-3 text-brand">
                <Newspaper size={14} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Agri Bulletin</span>
             </div>
             <div className="relative h-6 overflow-hidden">
                <div className="absolute whitespace-nowrap flex animate-marquee gap-10">
                   {agriNews.map((news, i) => (
                     <span key={i} className="text-[11px] font-black text-text-muted uppercase tracking-wider">{news}</span>
                   ))}
                   {agriNews.map((news, i) => (
                     <span key={`dup-${i}`} className="text-[11px] font-black text-text-muted uppercase tracking-wider">{news}</span>
                   ))}
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                  <div className="relative">
                      <Bell size={20} className="text-text-muted group-hover:text-brand transition-colors" />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-danger rounded-full border border-dark animate-pulse"></span>
                  </div>
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">System Alerts</span>
              </div>
              <span className="text-[11px] bg-danger/20 text-danger px-2 py-0.5 rounded font-black border border-danger/20">03</span>
          </div>
          
          <button className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-danger/10 text-text-muted hover:text-danger transition-all font-black uppercase tracking-widest text-[11px] border border-transparent hover:border-danger/30 group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Rail: Visible < 1024px */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-dark/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-around px-4 z-50">
        <div className="flex items-center gap-2">
           <Satellite size={20} className="text-brand" />
           <span className="font-black text-xs">AGRO_OS</span>
        </div>
        <div className="flex gap-4">
          {menuItems.slice(0, 3).map((item, i) => (
            <Link key={i} href={item.href} className="text-text-muted hover:text-brand transition-colors">
              {item.icon}
            </Link>
          ))}
        </div>
        <Bell size={20} className="text-text-muted" />
      </nav>
    </>
  );
}
