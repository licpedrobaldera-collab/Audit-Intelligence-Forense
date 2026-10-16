import React from 'react';
import { ShieldCheck, Lock, Clock, Download, BookOpen, AlertTriangle, CheckCircle2, Globe, Terminal, GitBranch, Server, Users, PieChart, MonitorPlay, Cpu, Zap } from 'lucide-react';
import { UserTrial } from '../types';

interface NavbarProps {
  currentTab: 'forensic' | 'simulator' | 'zip' | 'guide' | 'trial_register' | 'render_settings' | 'admin' | 'analytics' | 'tutorials' | 'ai_command' | 'yoelfri_agil';
  setCurrentTab: (tab: 'forensic' | 'simulator' | 'zip' | 'guide' | 'trial_register' | 'render_settings' | 'admin' | 'analytics' | 'tutorials' | 'ai_command' | 'yoelfri_agil') => void;
  userTrial: UserTrial;
  onOpenUpgradeModal: () => void;
  onDownloadZip: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userTrial,
  onOpenUpgradeModal,
  onDownloadZip,
}) => {
  const isExpired = userTrial.diasTranscurridos > 3 && !userTrial.estadoPago;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top micro-bar: Domain & Security status */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              HTTPS // 256-BIT TLS
            </span>
            <span className="font-mono text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              https://audit-intelligence-usa.com/trial
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <a 
              href="https://github.com/balderasantosyasociados/BASA_V7-system-/tree/main" 
              target="_blank" 
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub: balderasantosyasociados/BASA_V7-system-</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline font-mono">
              BHD León: <strong className="text-slate-200">08694150021</strong> (Pedro Baldera)
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab('forensic')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                AUDIT INTELLIGENCE
              </span>
              <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-500/30">
                USA
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                BASA V7
              </span>
            </div>
            <p className="text-[11px] text-cyan-400/90 font-mono">
              Pedro Baldera • 3-Day Trial &amp; Cloudflare Tunnel
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentTab('forensic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'forensic'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Auditoría Forense</span>
          </button>

          <button
            onClick={() => setCurrentTab('tutorials')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'tutorials'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm font-bold'
                : 'text-indigo-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mini-Videos (Paso a Paso)</span>
          </button>

          <button
            onClick={() => setCurrentTab('yoelfri_agil')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'yoelfri_agil'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm font-bold'
                : 'text-blue-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold">Yoelfri Auditoría Ágil</span>
          </button>

          <button
            onClick={() => setCurrentTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'simulator'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Control 3 Días</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm font-bold'
                : 'text-cyan-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-cyan-400" />
            <span>Métricas Trial</span>
          </button>

          <button
            onClick={() => setCurrentTab('zip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'zip'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-sm'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold text-amber-300">Descargar ZIP</span>
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-sm'
                : 'text-emerald-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Panel Admin</span>
          </button>

          <button
            onClick={() => setCurrentTab('ai_command')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'ai_command'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-bold'
                : 'text-purple-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold">Comando IA</span>
          </button>

          <button
            onClick={() => setCurrentTab('render_settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'render_settings'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Render</span>
          </button>

          <button
            onClick={() => setCurrentTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'guide'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Cloudflare Tunnel</span>
          </button>
        </nav>

        {/* User Trial Status & CTA */}
        <div className="flex items-center gap-3">
          {userTrial.estadoPago ? (
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Licencia BHD Activa</span>
            </div>
          ) : isExpired ? (
            <button
              onClick={onOpenUpgradeModal}
              className="flex items-center gap-2 bg-red-950/80 border border-red-500/60 text-red-300 hover:bg-red-900/60 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Trial Vencido (BHD 08694150021)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 px-3 py-1.5 rounded-xl text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>
                Trial: {Math.max(0, 3 - Math.floor(userTrial.diasTranscurridos))}d{' '}
                {Math.max(0, Math.floor((3 - userTrial.diasTranscurridos) * 24) % 24)}h
              </span>
            </div>
          )}

          <button
            onClick={onDownloadZip}
            className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/10"
            title="Descargar paquete BASA_V7 en .zip para GitHub"
          >
            <Download className="w-4 h-4" />
            <span>Descargar ZIP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
