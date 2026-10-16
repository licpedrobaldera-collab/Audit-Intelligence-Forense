import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, Clock, Sparkles, Building, Mail, Globe2, FileText, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserTrial } from '../types';

interface TrialRegistrationViewProps {
  onRegisterSuccess: (newUser: UserTrial) => void;
  onNavigateToForensic: () => void;
}

export const TrialRegistrationView: React.FC<TrialRegistrationViewProps> = ({
  onRegisterSuccess,
  onNavigateToForensic,
}) => {
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [jurisdiccion, setJurisdiccion] = useState('Estados Unidos (Federal & Delaware)');
  const [tipoAuditoria, setTipoAuditoria] = useState('Auditoría Forense y Detección de Fraude');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const newUser: UserTrial = {
        id: `USR-${Date.now().toString().slice(-6)}`,
        email: email.trim().toLowerCase(),
        empresa: empresa.trim() || 'Firma Independiente de Auditoría',
        fechaRegistro: now.toISOString(),
        diasTranscurridos: 0.0,
        estadoPago: false,
        tipoLicencia: 'trial',
        tokenAcceso: `jwt_trial_${Math.random().toString(36).substring(2)}_${Date.now()}`,
        pais: jurisdiccion
      };

      onRegisterSuccess(newUser);
      setIsSubmitting(false);
      setJustActivated(true);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* URL Breadcrumb Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-sm">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          Ruta Oficial: https://audit-intelligence-usa.com/trial
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Prueba Gratuita por 3 Días
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm sm:text-base">
          Acceso instantáneo de 72 horas completas al motor forense de detección de anomalías contables, Ley de Benford y pagos estructurados.
        </p>
      </div>

      {justActivated ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center shadow-xl shadow-emerald-950/20 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            ¡Prueba de 3 Días Activada Exitosamente!
          </h2>
          <p className="text-sm text-slate-300 mb-6">
            Tu cuenta ha sido inicializada en la base de datos SQLite con <strong className="text-emerald-300">estado_pago = False</strong> y <strong className="text-emerald-300">fecha_registro = AHORA</strong>. Tienes 72:00:00 horas para procesar asientos contables.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs text-slate-300 space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="text-cyan-300">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Duración:</span>
              <span className="text-emerald-400 font-bold">3 Días (72 Horas)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Motor Forense:</span>
              <span className="text-slate-200">Ley de Benford + Anti-Lavado FinCEN</span>
            </div>
          </div>

          <button
            onClick={onNavigateToForensic}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>Ingresar al Motor Forense</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Registration Form Card */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Registro de Licencia Demo</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Sin tarjeta de crédito requerida. Acceso directo por 3 días hábiles.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Correo Electrónico Corporativo</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="auditor@tu-firma-contable.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Firma o Empresa Contable</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Deloitte & Touche, PwC, Auditor Independiente"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Jurisdicción / Normativa
                  </label>
                  <select
                    value={jurisdiccion}
                    onChange={(e) => setJurisdiccion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Estados Unidos (Federal & Delaware)">Estados Unidos (Federal)</option>
                    <option value="Estados Unidos (Florida / Miami)">Estados Unidos (Florida)</option>
                    <option value="Estados Unidos (California)">Estados Unidos (California)</option>
                    <option value="Latinoamérica (Normas NIA / IFRS)">Latinoamérica (NIA/IFRS)</option>
                    <option value="Internacional / Multijurisdiccional">Internacional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Área Forense Principal
                  </label>
                  <select
                    value={tipoAuditoria}
                    onChange={(e) => setTipoAuditoria(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Auditoría Forense y Detección de Fraude">Fraude Contable Ocupacional</option>
                    <option value="Prevención de Lavado de Dinero (FinCEN)">Prevención Lavado (AML/FinCEN)</option>
                    <option value="Auditoría de Proveedores y Compras">Auditoría Compras y Proveedores</option>
                    <option value="Diligencia Debida (Due Diligence M&A)">Diligencia Debida M&A</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Registrando en Base de Datos SQLite...</span>
                  ) : (
                    <>
                      <span>Comenzar Prueba Gratuita (3 Días)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> Sin tarjeta de crédito
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> 72 horas automáticas
                </span>
              </div>
            </form>
          </div>

          {/* Right Architecture Breakdown */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                Cómo opera el backend durante el Trial
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    1
                  </div>
                  <p>
                    <strong>Al registrarse:</strong> Guarda tu email, <code className="text-cyan-300">fecha_registro = ahora</code> y <code className="text-amber-300">estado_pago = False</code> en la tabla SQLite <code className="text-slate-400">usuarios</code>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    2
                  </div>
                  <p>
                    <strong>Control de Bloqueo:</strong> Cada solicitud ejecuta la fórmula <code className="text-cyan-300">Días = Fecha Actual - Fecha Registro</code>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    3
                  </div>
                  <p>
                    <strong>Bloqueo Inmediato:</strong> Si <code className="text-red-300">Días &gt; 3</code> y no ha pagado, el decorador de Python bloquea el sistema inmediatamente y redirige al checkout.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Capacidades incluidas en la prueba
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Motor de Ley de Benford (distribución logarítmica)</li>
                <li>Detección de pagos estructurados (&lt; $10k FinCEN)</li>
                <li>Identificación de facturas duplicadas</li>
                <li>Alertas de registros en fines de semana</li>
                <li>Generación del Dictamen Pericial Forense</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
