import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Sparkles, AlertCircle, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { UserTrial } from '../types';

interface TrialBannerProps {
  userTrial: UserTrial;
  onUpdateTrial: (updates: Partial<UserTrial>) => void;
  onOpenUpgradeModal: () => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({
  userTrial,
  onUpdateTrial,
  onOpenUpgradeModal,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    // 3 days = 3 * 24 * 3600 = 259200 seconds
    const totalTrialSeconds = 3 * 24 * 3600;
    const elapsedSeconds = userTrial.diasTranscurridos * 86400;
    const remaining = Math.max(0, Math.floor(totalTrialSeconds - elapsedSeconds));
    setSecondsRemaining(remaining);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (!userTrial.estadoPago && userTrial.diasTranscurridos <= 3) {
            onUpdateTrial({ diasTranscurridos: 3.01 });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userTrial.diasTranscurridos, userTrial.estadoPago]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const isExpired = userTrial.diasTranscurridos > 3 && !userTrial.estadoPago;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border-b border-slate-800 p-4 sm:p-5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Logic explanation and live countdown */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              REGLA MATEMÁTICA EN BACKEND
            </span>
            <span className="text-xs font-mono text-slate-400">
              Días Transcurridos = Fecha Actual - Fecha Registro
            </span>
          </div>

          <div className="flex items-center gap-3">
            {userTrial.estadoPago ? (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>Estado de Pago: APROBADO (Acceso Permanente Vitalicio)</span>
              </div>
            ) : isExpired ? (
              <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                <span>Prueba Gratuita Caducada ({userTrial.diasTranscurridos.toFixed(1)} días transcurridos &gt; 3.0 días)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>
                  Prueba de 3 Días Activa:
                </span>
                <span className="font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 text-sm tracking-wider">
                  {String(hours).padStart(2, '0')}h : {String(minutes).padStart(2, '0')}m : {String(seconds).padStart(2, '0')}s
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {userTrial.estadoPago ? (
              <span className="text-emerald-300/90">
                La variable <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-200">estado_pago == True</code>. Todas las funciones de auditoría forense están 100% desbloqueadas.
              </span>
            ) : isExpired ? (
              <span className="text-red-300/90">
                El decorador <code className="bg-slate-800 px-1 py-0.5 rounded text-red-200">@requiere_trial_o_pago</code> en <code className="text-slate-200">app.py</code> ha bloqueado las solicitudes por haber excedido los 3 días sin pago.
              </span>
            ) : (
              <span>
                Usuario registrado: <strong className="text-slate-200">{userTrial.email}</strong>. El decorador en Flask concede acceso hasta completar las 72 horas continuas.
              </span>
            )}
          </p>
        </div>

        {/* Right: Quick State Simulator Buttons to test live in 1 click */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 w-full lg:w-auto">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Simulador de Estado en Tiempo Real:</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Prueba en vivo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              onClick={() => onUpdateTrial({ diasTranscurridos: 0.1, estadoPago: false })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${
                userTrial.diasTranscurridos < 1 && !userTrial.estadoPago
                  ? 'bg-cyan-600 text-white font-bold ring-1 ring-cyan-400'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Día 1 (Nuevo)
            </button>

            <button
              onClick={() => onUpdateTrial({ diasTranscurridos: 1.8, estadoPago: false })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${
                userTrial.diasTranscurridos >= 1 && userTrial.diasTranscurridos <= 3 && !userTrial.estadoPago
                  ? 'bg-cyan-600 text-white font-bold ring-1 ring-cyan-400'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Día 2 (Activo)
            </button>

            <button
              onClick={() => onUpdateTrial({ diasTranscurridos: 3.5, estadoPago: false })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${
                isExpired
                  ? 'bg-red-600 text-white font-bold ring-1 ring-red-400'
                  : 'bg-slate-900 text-red-300 hover:bg-red-950/60'
              }`}
            >
              Día &gt; 3 (Bloquear)
            </button>

            <button
              onClick={() => onUpdateTrial({ estadoPago: !userTrial.estadoPago })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${
                userTrial.estadoPago
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-emerald-400'
                  : 'bg-slate-900 text-emerald-300 hover:bg-emerald-950/60'
              }`}
            >
              {userTrial.estadoPago ? 'Quitar Pago' : 'Simular Pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
