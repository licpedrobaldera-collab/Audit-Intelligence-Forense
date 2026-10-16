import React, { useState } from 'react';
import { Clock, ShieldAlert, CheckCircle2, Play, RefreshCw, Database, Code, Sliders, AlertTriangle } from 'lucide-react';
import { UserTrial } from '../types';

interface TrialSimulatorViewProps {
  userTrial: UserTrial;
  onUpdateTrial: (updates: Partial<UserTrial>) => void;
  onOpenUpgradeModal: () => void;
}

export const TrialSimulatorView: React.FC<TrialSimulatorViewProps> = ({
  userTrial,
  onUpdateTrial,
  onOpenUpgradeModal,
}) => {
  const [testEndpointResult, setTestEndpointResult] = useState<{
    status: number;
    mensaje: string;
    tiempo: string;
    payload: any;
  } | null>(null);

  const [simulatedDays, setSimulatedDays] = useState(userTrial.diasTranscurridos);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSimulatedDays(val);
    onUpdateTrial({ diasTranscurridos: val });
  };

  const handleTestApiCall = () => {
    const isBlocked = userTrial.diasTranscurridos > 3 && !userTrial.estadoPago;
    const now = new Date();

    if (isBlocked) {
      setTestEndpointResult({
        status: 403,
        mensaje: 'HTTP 403 Forbidden - TRIAL_EXPIRADO',
        tiempo: now.toLocaleTimeString(),
        payload: {
          bloqueado: true,
          codigo: 'TRIAL_EXPIRADO',
          mensaje: 'Tu periodo de prueba de 3 días ha vencido. Actualiza tu suscripción para continuar.',
          dias_transcurridos: Number(userTrial.diasTranscurridos.toFixed(2)),
          limite_dias: 3.0,
          estado_pago: false,
          url_pago: `https://audit-intelligence-usa.com/checkout?email=${userTrial.email}`
        }
      });
    } else {
      setTestEndpointResult({
        status: 200,
        mensaje: 'HTTP 200 OK - ACCESO_AUTORIZADO',
        tiempo: now.toLocaleTimeString(),
        payload: {
          auditor: userTrial.email,
          empresa: userTrial.empresa,
          dias_transcurridos: Number(userTrial.diasTranscurridos.toFixed(2)),
          horas_restantes: Number(Math.max(0, 72 - userTrial.diasTranscurridos * 24).toFixed(1)),
          estado_pago: userTrial.estadoPago,
          tipo_licencia: userTrial.estadoPago ? 'pro' : 'trial',
          status: 'ACCESO_AUTORIZADO_MOTOR_FORENSE'
        }
      });
    }
  };

  const isExpired = userTrial.diasTranscurridos > 3 && !userTrial.estadoPago;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Clock className="w-3.5 h-3.5" />
          SIMULADOR DE REGLAS DE NEGOCIO &amp; BASE DE DATOS
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Control de Acceso Matemático por 3 Días
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Verifica en vivo cómo reacciona el backend de Python según la regla matemática: si los días transcurridos superan los 3 días y el pago no está confirmado, la llamada al motor forense se bloquea de inmediato.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive State Controls */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Variables del Usuario en SQLite</span>
          </h2>

          {/* Slider for days elapsed */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                Días Transcurridos ({simulatedDays.toFixed(2)} días / {(simulatedDays * 24).toFixed(0)} horas)
              </span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                simulatedDays <= 3 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
              }`}>
                {simulatedDays <= 3 ? 'DENTRO DE PRUEBA (≤ 3.0)' : 'PRUEBA VENCIDA (> 3.0)'}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="6"
              step="0.1"
              value={simulatedDays}
              onChange={handleSliderChange}
              className="w-full accent-cyan-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 Días (Inicio)</span>
              <span>1.5 Días</span>
              <span className="text-red-400 font-bold">3 Días (Límite)</span>
              <span>4.5 Días</span>
              <span>6 Días</span>
            </div>
          </div>

          {/* Estado de Pago switch */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">
                Columna `estado_pago` (Booleano)
              </span>
              <span className="text-[11px] text-slate-400">
                Almacenado como 0 o 1 en SQLite
              </span>
            </div>

            <button
              onClick={() => onUpdateTrial({ estadoPago: !userTrial.estadoPago })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                userTrial.estadoPago
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {userTrial.estadoPago ? 'True (Pagado - Ilimitado)' : 'False (No Pagado)'}
            </button>
          </div>

          {/* Quick preset buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">
              Escenarios Predefinidos de Prueba:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSimulatedDays(0.2);
                  onUpdateTrial({ diasTranscurridos: 0.2, estadoPago: false });
                }}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left hover:border-cyan-500/50 transition-colors"
              >
                <div className="text-xs font-bold text-cyan-300">Día 1: Registro Nuevo</div>
                <div className="text-[10px] text-slate-400">0.2 días, pago=False (Acceso OK)</div>
              </button>

              <button
                onClick={() => {
                  setSimulatedDays(2.8);
                  onUpdateTrial({ diasTranscurridos: 2.8, estadoPago: false });
                }}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left hover:border-cyan-500/50 transition-colors"
              >
                <div className="text-xs font-bold text-amber-300">Día 3: Últimas Horas</div>
                <div className="text-[10px] text-slate-400">2.8 días, pago=False (Alerta)</div>
              </button>

              <button
                onClick={() => {
                  setSimulatedDays(3.8);
                  onUpdateTrial({ diasTranscurridos: 3.8, estadoPago: false });
                }}
                className="p-2.5 rounded-xl bg-slate-950 border border-red-500/40 text-left hover:border-red-500 transition-colors"
              >
                <div className="text-xs font-bold text-red-400">Día 4: Bloqueado (403)</div>
                <div className="text-[10px] text-slate-400">3.8 días, pago=False (Cerrado)</div>
              </button>

              <button
                onClick={() => {
                  setSimulatedDays(4.5);
                  onUpdateTrial({ diasTranscurridos: 4.5, estadoPago: true });
                }}
                className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-left hover:border-emerald-500 transition-colors"
              >
                <div className="text-xs font-bold text-emerald-400">Día 5: Cliente Pro</div>
                <div className="text-[10px] text-slate-400">&gt; 3 días pero pago=True (OK)</div>
              </button>
            </div>
          </div>

          {/* Test API request button */}
          <button
            onClick={handleTestApiCall}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Simular Petición POST /api/analizar-forense</span>
          </button>
        </div>

        {/* Right Column: API Response Inspector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Respuesta del Middleware Python en Tiempo Real</span>
              </span>
              {testEndpointResult && (
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  testEndpointResult.status === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-500/40'
                }`}>
                  {testEndpointResult.mensaje}
                </span>
              )}
            </h2>

            {testEndpointResult ? (
              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
                  <pre>{JSON.stringify(testEndpointResult.payload, null, 2)}</pre>
                </div>

                {testEndpointResult.status === 403 && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center justify-between">
                    <span>El sistema detiene la ejecución del análisis forense.</span>
                    <button
                      onClick={onOpenUpgradeModal}
                      className="px-3 py-1 rounded bg-red-500 text-white font-bold hover:bg-red-400"
                    >
                      Pagar Suscripción
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center space-y-2">
                <Database className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Presiona el botón <strong className="text-cyan-400">"Simular Petición POST"</strong> para evaluar el decorador de Python con los valores actuales.
                </p>
              </div>
            )}
          </div>

          {/* SQLite Table Record Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              Registro en tabla SQLite: `usuarios`
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2">email</th>
                    <th className="p-2">fecha_registro</th>
                    <th className="p-2">estado_pago</th>
                    <th className="p-2">tipo_licencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr>
                    <td className="p-2 text-cyan-300">{userTrial.email}</td>
                    <td className="p-2 text-slate-400">
                      {new Date(Date.now() - simulatedDays * 86400 * 1000).toISOString().slice(0, 19)}
                    </td>
                    <td className="p-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        userTrial.estadoPago ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                      }`}>
                        {userTrial.estadoPago ? '1 (True)' : '0 (False)'}
                      </span>
                    </td>
                    <td className="p-2 uppercase text-slate-400">
                      {userTrial.estadoPago ? 'pro' : 'trial'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
