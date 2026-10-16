import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TrialBanner } from './components/TrialBanner';
import { ForensicWorkspace } from './components/ForensicWorkspace';
import { TrialSimulatorView } from './components/TrialSimulatorView';
import { ZipDownloadHub } from './components/ZipDownloadHub';
import { DeploymentGuide } from './components/DeploymentGuide';
import { RenderSettingsValidator } from './components/RenderSettingsValidator';
import { TrialRegistrationView } from './components/TrialRegistrationView';
import { AdminPortal } from './components/AdminPortal';
import { TrialAnalytics } from './components/TrialAnalytics';
import { MiniVideoTutorials } from './components/MiniVideoTutorials';
import { AdminAiCommandCenter } from './components/AdminAiCommandCenter';
import { YoelfriAuditoriaAgil } from './components/YoelfriAuditoriaAgil';
import { TrialLockoutModal } from './components/TrialLockoutModal';
import { UserTrial } from './types';
import { generateAndDownloadZip } from './utils/zipGenerator';
import { ShieldCheck, Globe, Download, Terminal, Database, FileText, PieChart, MonitorPlay, Cpu, Zap } from 'lucide-react';

const DEFAULT_USER: UserTrial = {
  id: 'USR-2026-081',
  email: 'auditor.lead@audit-intelligence-usa.com',
  empresa: 'Forensic & Financial Partners USA',
  fechaRegistro: new Date(Date.now() - 0.5 * 86400 * 1000).toISOString(),
  diasTranscurridos: 0.5,
  estadoPago: false,
  tipoLicencia: 'trial',
  tokenAcceso: 'jwt_trial_valid_token_2026',
  pais: 'Estados Unidos (Federal & Florida)'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'forensic' | 'simulator' | 'zip' | 'guide' | 'trial_register' | 'render_settings' | 'admin' | 'analytics' | 'tutorials' | 'ai_command' | 'yoelfri_agil'>('yoelfri_agil');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Initialize trial user from localStorage or default
  const [userTrial, setUserTrial] = useState<UserTrial>(() => {
    try {
      const saved = localStorage.getItem('audit_intelligence_user_trial');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('audit_intelligence_user_trial', JSON.stringify(userTrial));
    } catch (e) {
      console.error(e);
    }
  }, [userTrial]);

  const handleUpdateTrial = (updates: Partial<UserTrial>) => {
    setUserTrial((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const handleConfirmPayment = () => {
    handleUpdateTrial({
      estadoPago: true,
      tipoLicencia: 'pro'
    });
  };

  const handleRegisterSuccess = (newUser: UserTrial) => {
    setUserTrial(newUser);
  };

  const handleDownloadZip = () => {
    generateAndDownloadZip();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userTrial={userTrial}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        onDownloadZip={handleDownloadZip}
      />

      {/* Interactive 3-Day Rule Status & Simulator Banner */}
      <TrialBanner
        userTrial={userTrial}
        onUpdateTrial={handleUpdateTrial}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'yoelfri_agil' && (
          <YoelfriAuditoriaAgil
            onNavigateToTab={(tab) => setCurrentTab(tab as any)}
            onDownloadZip={handleDownloadZip}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPortal onUpdateGlobalTrial={handleUpdateTrial} />
        )}

        {currentTab === 'ai_command' && (
          <AdminAiCommandCenter onUpdateGlobalTrial={handleUpdateTrial} />
        )}

        {currentTab === 'tutorials' && (
          <MiniVideoTutorials onNavigateToTab={(tab) => setCurrentTab(tab as any)} />
        )}

        {currentTab === 'analytics' && (
          <TrialAnalytics
            onNavigateToRegister={() => setCurrentTab('trial_register')}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          />
        )}

        {currentTab === 'forensic' && (
          <ForensicWorkspace
            userTrial={userTrial}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            onDownloadZip={handleDownloadZip}
          />
        )}

        {currentTab === 'simulator' && (
          <TrialSimulatorView
            userTrial={userTrial}
            onUpdateTrial={handleUpdateTrial}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          />
        )}

        {currentTab === 'zip' && (
          <ZipDownloadHub />
        )}

        {currentTab === 'guide' && (
          <DeploymentGuide />
        )}

        {currentTab === 'render_settings' && (
          <RenderSettingsValidator />
        )}

        {currentTab === 'trial_register' && (
          <TrialRegistrationView
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToForensic={() => setCurrentTab('forensic')}
          />
        )}
      </main>

      {/* Lockout / Upgrade Modal */}
      <TrialLockoutModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        userTrial={userTrial}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Persistent Floating Bottom Bar for Quick ZIP Download */}
      <aside aria-label="Descarga de paquete ZIP" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[94%] bg-slate-900/95 backdrop-blur-md border border-amber-500/50 shadow-2xl shadow-amber-950/40 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 animate-bounce" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>Archivo ZIP Final Listo</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-500/30">BASA_V7</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Descarga directa para cargar a tu portal o servidor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentTab('zip')}
            className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1"
          >
            Ver Archivos
          </button>
          <button
            onClick={handleDownloadZip}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar ZIP</span>
          </button>
        </div>
      </aside>

      {/* Corporate Forensic Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 font-black">
              AI
            </div>
            <div>
              <div className="font-bold text-slate-300">
                Audit Intelligence USA Inc.
              </div>
              <div className="text-[11px] text-slate-500">
                Sistemas de Detección de Fraude &amp; Auditoría Forense // Enlace de prueba: https://audit-intelligence-usa.com/trial
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => setCurrentTab('yoelfri_agil')}
              className="text-blue-400 font-bold hover:text-white transition-colors flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Yoelfri Auditoría Ágil</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('tutorials')}
              className="text-indigo-400 font-bold hover:text-white transition-colors flex items-center gap-1"
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Mini-Videos de Uso</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('ai_command')}
              className="text-purple-400 font-bold hover:text-white transition-colors flex items-center gap-1"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Comando IA Lic. Pedro Baldera</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('analytics')}
              className="text-cyan-400 font-bold hover:text-white transition-colors flex items-center gap-1"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Métricas Trial (Pie Chart)</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('admin')}
              className="text-emerald-400 font-bold hover:text-white transition-colors"
            >
              Panel Admin (BHD 08694150021)
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('trial_register')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Registro /trial
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('simulator')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Simulador Matemático
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('zip')}
              className="text-amber-400 hover:underline font-semibold"
            >
              Descargar Paquete ZIP
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('guide')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Guía Cloudflare/Render
            </button>
          </div>

          <div className="text-right text-[11px] font-mono text-slate-600">
            SHA-256 Verified Build • Port 5000 / Reverse Proxy Ready
          </div>
        </div>
      </footer>
    </div>
  );
}
