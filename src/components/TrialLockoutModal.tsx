import React, { useState } from 'react';
import { Lock, Sparkles, Check, CreditCard, Key, ShieldCheck, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserTrial } from '../types';

interface TrialLockoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTrial: UserTrial;
  onConfirmPayment: () => void;
}

export const TrialLockoutModal: React.FC<TrialLockoutModalProps> = ({
  isOpen,
  onClose,
  userTrial,
  onConfirmPayment,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro');
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [activeTab, setActiveTab] = useState<'bhd' | 'checkout' | 'licenseKey'>('bhd');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPayment();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      onClose();
    }, 700);
  };

  const handleApplyLicenseKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (licenseKeyInput.trim().toUpperCase().includes('BHD') || licenseKeyInput.trim().toUpperCase().includes('USA') || licenseKeyInput.trim().length >= 8) {
      handleSimulatePayment();
    } else {
      setErrorMsg('Clave de activación inválida. Usa por ejemplo: BHD-08694150021-BALDERA');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-black text-white">
            Desbloquear Audit Intelligence USA (BASA V7)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tu prueba de 3 días finalizó. Activa tu licencia permanente con <strong className="text-emerald-400">Banco BHD León</strong> o simula el pago en el sistema.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bhd')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bhd'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Banco BHD León (Oficial)</span>
          </button>

          <button
            onClick={() => setActiveTab('checkout')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'checkout'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Simular Pago</span>
          </button>

          <button
            onClick={() => setActiveTab('licenseKey')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'licenseKey'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Clave Clave</span>
          </button>
        </div>

        {activeTab === 'bhd' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">DATOS OFICIALES PARA TRANSFERENCIA</span>
                <span className="text-white font-mono bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/40">RD$ / USD</span>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Banco:</span>
                  <strong className="text-white">Banco BHD León</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cuenta de Ahorros:</span>
                  <strong className="text-emerald-400 text-sm">08694150021</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Titular de Cuenta:</span>
                  <strong className="text-white">Pedro Baldera</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email de Contacto:</span>
                  <span className="text-cyan-300">licpedrobaldera@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp Directo:</span>
                  <strong className="text-emerald-400">+1 829-771-7390</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://wa.me/18297717390?text=Hola%20Pedro%20Baldera,%20acabo%20de%20realizar%20la%20transferencia%20al%20BHD%20para%20activar%20mi%20licencia%20de%20Audit%20Intelligence%20USA"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notificar Comprobante por WhatsApp</span>
                </a>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Simular Aprobación en app.py (estado_pago = True)</span>
            </button>
          </div>
        )}

        {activeTab === 'checkout' && (
          <div className="space-y-4">
            {/* Plans selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedPlan('pro')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'pro'
                    ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-white">Plan Pro</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">RD$ 40,000</span>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-cyan-400" /> Auditoría DuckDB ilimitada
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-cyan-400" /> Ley de Benford completa
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-cyan-400" /> Factura BHD León PDF
                  </li>
                </ul>
              </div>

              <div
                onClick={() => setSelectedPlan('enterprise')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'enterprise'
                    ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-white">Enterprise</span>
                  <span className="text-xs font-mono font-bold text-amber-400">RD$ 90,000</span>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400" /> Múltiples auditores
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400" /> ChromaDB Vector Search
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400" /> Soporte directo Baldera
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>Cuenta de usuario:</span>
                <span className="text-white">{userTrial.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Acción en backend:</span>
                <span className="text-emerald-400 font-bold">clientes.json: estado_pago = True</span>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Confirmando transacción en el backend...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar Pago &amp; Desbloquear Inmediatamente</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'licenseKey' && (
          <form onSubmit={handleApplyLicenseKey} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Clave de Licencia Pro / Enterprise
              </label>
              <input
                type="text"
                placeholder="Ej: BHD-08694150021-BALDERA-PRO"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Clave de prueba sugerida: <code className="text-cyan-300 cursor-pointer" onClick={() => setLicenseKeyInput('BHD-08694150021-BALDERA-PRO')}>BHD-08694150021-BALDERA-PRO</code>
              </p>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-lg border border-red-500/30">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <Key className="w-4 h-4" />
              <span>Validar Clave y Desbloquear</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
