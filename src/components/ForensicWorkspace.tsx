import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  Plus, 
  DollarSign, 
  Search, 
  Calendar, 
  Download, 
  Lock, 
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ForensicTransaction, UserTrial } from '../types';
import { INITIAL_TRANSACTIONS, calculateBenfordStats, generateAuditSummary } from '../utils/forensicEngine';

interface ForensicWorkspaceProps {
  userTrial: UserTrial;
  onOpenUpgradeModal: () => void;
  onDownloadZip: () => void;
}

export const ForensicWorkspace: React.FC<ForensicWorkspaceProps> = ({
  userTrial,
  onOpenUpgradeModal,
  onDownloadZip,
}) => {
  const isExpired = userTrial.diasTranscurridos > 3 && !userTrial.estadoPago;

  const [transactions, setTransactions] = useState<ForensicTransaction[]>(INITIAL_TRANSACTIONS);
  const [filter, setFilter] = useState<'ALL' | 'STRUCT' | 'DUPLICATE' | 'WEEKEND'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDictamenModal, setShowDictamenModal] = useState(false);

  // New Transaction Modal State
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [newMonto, setNewMonto] = useState('9940.00');
  const [newProveedor, setNewProveedor] = useState('Servicios Off-Shore Islas Caimán');
  const [newConcepto, setNewConcepto] = useState('Consultoría en Optimización Patrimonial');
  const [newEsFinSemana, setNewEsFinSemana] = useState(false);

  const benfordStats = calculateBenfordStats(transactions);
  const summary = generateAuditSummary(transactions);

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'STRUCT') return tx.esMontoEstructurado;
    if (filter === 'DUPLICATE') return tx.esDuplicadoSospechoso;
    if (filter === 'WEEKEND') return tx.esFinDeSemana;
    return true;
  });

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 700);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(newMonto) || 0;
    const esEstructurado = (monto >= 4900 && monto <= 4999) || (monto >= 9800 && monto <= 9999);
    
    const newTx: ForensicTransaction = {
      id: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: new Date().toISOString().split('T')[0],
      proveedor: newProveedor,
      concepto: newConcepto,
      monto,
      categoria: 'Gasto Extraordinario',
      cuentaContable: '5900-88 Gastos No Clasificados',
      esFinDeSemana: newEsFinSemana,
      esMontoEstructurado: esEstructurado,
      esDuplicadoSospechoso: false,
      scoreRiesgo: esEstructurado ? 89 : monto > 20000 ? 70 : 25,
      nivelAlerta: esEstructurado ? 'CRITICO' : monto > 20000 ? 'ALTO' : 'BAJO'
    };

    setTransactions([newTx, ...transactions]);
    setShowAddTxModal(false);
  };

  // IF TRIAL HAS EXPIRED AND NOT PAID, RENDER THE BLOCKED SYSTEM INTERFACE
  if (isExpired) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-slate-900 border-2 border-red-500/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-950/40 text-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-20 h-20 rounded-2xl bg-red-950/90 border border-red-500/60 text-red-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-950/50">
            <Lock className="w-10 h-10 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-300 font-mono text-xs mb-4">
            <span>HTTP 403 // TRIAL_EXPIRADO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Periodo de Prueba de 3 Días Vencido
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base mb-6 leading-relaxed">
            Tu acceso a <strong className="text-white">Audit Intelligence USA</strong> ha sido bloqueado automáticamente por la regla de seguridad del backend en Python:
          </p>

          {/* Logic check breakdown card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 max-w-lg mx-auto text-left font-mono text-xs space-y-2 mb-8 text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Regla Evaluada:</span>
              <span className="text-cyan-400">Días &gt; 3.0 AND estado_pago == False</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha de Registro:</span>
              <span className="text-slate-200">{new Date(userTrial.fechaRegistro).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Días Transcurridos:</span>
              <span className="text-red-400 font-bold">{userTrial.diasTranscurridos.toFixed(2)} días (Límite: 3.0)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estado de Pago:</span>
              <span className="text-red-400 font-bold">False (Pendiente de Suscripción)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenUpgradeModal}
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 via-rose-600 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-extrabold py-3.5 px-8 rounded-xl text-sm transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Activar Licencia Completa / Desbloquear</span>
            </button>

            <button
              onClick={onDownloadZip}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 px-6 rounded-xl text-sm border border-slate-700 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Descargar Archivos ZIP del Backend</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Para continuar la prueba en modo desarrollo, puedes hacer clic en "Día 1" o "Simular Pago" en la barra superior.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header of Forensic Suite */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30">
              AUDIT INTELLIGENCE USA // MOTOR v4.2
            </span>
            <span className="text-xs text-slate-400">
              Caso: Auditoría Libro Mayor & Cuentas por Pagar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Tablero Forense Financiero
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Detección de patrones fraudulentos según Ley de Benford, fragmentación (Structuring) y facturas espejo.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setShowAddTxModal(true)}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Inyectar Transacción</span>
          </button>

          <button
            onClick={() => setShowDictamenModal(true)}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Emitir Dictamen Pericial</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-mono text-slate-400">Transacciones Auditadas</span>
          <div className="text-2xl font-black text-white mt-1">
            {summary.totalTransacciones}
          </div>
          <span className="text-[10px] text-cyan-400">100% de la muestra verificada</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-mono text-slate-400">Monto Total Auditado</span>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            ${summary.montoTotalAuditado.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Dólares USD</span>
        </div>

        <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-4 bg-red-950/20">
          <span className="text-[11px] font-mono text-red-300">Monto en Riesgo Crítico</span>
          <div className="text-2xl font-black text-red-400 mt-1 font-mono">
            ${summary.montoEnRiesgo.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-red-300/80">Transacciones bajo sospecha</span>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 bg-amber-950/20">
          <span className="text-[11px] font-mono text-amber-300">Score de Riesgo Global</span>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
            {summary.scoreRiesgoGlobal} / 100
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div 
              className={`h-full ${summary.scoreRiesgoGlobal > 70 ? 'bg-red-500' : 'bg-amber-400'}`}
              style={{ width: `${summary.scoreRiesgoGlobal}%` }}
            ></div>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-mono text-slate-400">Dictamen Preliminar</span>
          <div className="text-xs font-bold text-red-400 mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>EVIDENCIA DE FRAUDE</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Conforme AICPA SAS 99</span>
        </div>
      </div>

      {/* Main Grid: Benford Law Chart + Key Fraud Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Benford's Law Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Test de Ley de Benford (Primer Dígito)
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  P(d) = log₁₀(1 + 1/d) vs Frecuencia Observada en Asientos
                </p>
              </div>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center gap-1 border border-slate-700 transition-all"
            >
              <Cpu className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Calculando...' : 'Recalcular Curva'}</span>
            </button>
          </div>

          {/* Bar Chart comparing Theoretical vs Observed */}
          <div className="space-y-2.5 pt-2">
            {benfordStats.map((item) => (
              <div key={item.digit} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-bold text-white bg-slate-800 rounded px-1">
                      {item.digit}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Teórico: <strong className="text-slate-200">{item.esperado}%</strong> | Observado: <strong className={item.esAnomalo ? 'text-red-400 font-bold' : 'text-cyan-400'}>{item.observado}%</strong>
                    </span>
                  </div>

                  {item.esAnomalo && (
                    <span className="text-[10px] font-bold text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-500/40">
                      DESVIACIÓN ANÓMALA (+{item.desviacion}%)
                    </span>
                  )}
                </div>

                {/* Progress bars comparison */}
                <div className="grid grid-cols-1 gap-1">
                  {/* Theoretical Line/Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 relative overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full opacity-60"
                      style={{ width: `${Math.min(100, item.esperado * 3)}%` }}
                    ></div>
                    {/* Observed Overlay */}
                    <div
                      className={`h-full rounded-full absolute top-0 left-0 transition-all duration-500 ${
                        item.esAnomalo ? 'bg-red-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, item.observado * 3)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-600 inline-block"></span> Curva Benford Teórica
              <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block ml-3"></span> Normal
              <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block ml-3"></span> Pico Sospechoso
            </span>
            <span className="text-red-300 font-mono font-semibold">
              Pico anómalo en dígito 9: Pagos de $9,850 y $9,920
            </span>
          </div>
        </div>

        {/* Right: Key Fraud Flags Found (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Hallazgos Forenses Críticos
              </h3>
              <p className="text-[11px] text-slate-400">
                Patrones de estructuración y riesgo penal
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Finding 1 */}
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-red-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Estructuración FinCEN / BSA ($9,850 & $9,920)
                </span>
                <span className="text-[10px] font-mono bg-red-900/60 px-1.5 py-0.5 rounded text-red-200">
                  CRÍTICO
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dos transferencias inmediatas a <strong className="text-white">Apex Global Logistics LLC</strong> diseñadas para evitar el umbral de reporte CTR de $10,000 USD.
              </p>
            </div>

            {/* Finding 2 */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Factura Espejo / Duplicada ($7,500.00)
                </span>
                <span className="text-[10px] font-mono bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-200">
                  ALTO
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Mismo proveedor (<strong className="text-white">Insumos del Golfo SA</strong>) y monto exacto cobrado con 24 horas de diferencia.
              </p>
            </div>

            {/* Finding 3 */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Asiento en Fin de Semana ($35,000.00)
                </span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                  NO LABORAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ajuste contable extraordinario registrado el domingo 4 de octubre sin orden de compra.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 text-xs text-blue-200 flex items-center justify-between">
            <span>¿Deseas conectar tu base de datos SQLite propia?</span>
            <button
              onClick={onDownloadZip}
              className="text-[11px] font-bold text-cyan-300 hover:text-white underline"
            >
              Ver app.py &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table with Search & Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Libro Diario de Transacciones Auditadas
            </h3>
            <p className="text-xs text-slate-400">
              Registros bajo evaluación algorítmica y análisis de riesgo
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar proveedor o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg ${filter === 'ALL' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('STRUCT')}
                className={`px-2.5 py-1 rounded-lg ${filter === 'STRUCT' ? 'bg-red-600 text-white font-bold' : 'text-red-400 hover:text-white'}`}
              >
                Estructuradas
              </button>
              <button
                onClick={() => setFilter('DUPLICATE')}
                className={`px-2.5 py-1 rounded-lg ${filter === 'DUPLICATE' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400 hover:text-white'}`}
              >
                Duplicadas
              </button>
              <button
                onClick={() => setFilter('WEEKEND')}
                className={`px-2.5 py-1 rounded-lg ${filter === 'WEEKEND' ? 'bg-purple-600 text-white font-bold' : 'text-purple-400 hover:text-white'}`}
              >
                Fin Semana
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">ID / Fecha</th>
                <th className="px-4 py-3">Beneficiario / Proveedor</th>
                <th className="px-4 py-3">Concepto Contable</th>
                <th className="px-4 py-3 text-right">Monto (USD)</th>
                <th className="px-4 py-3">Indicador de Fraude</th>
                <th className="px-4 py-3 text-center">Riesgo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className={`hover:bg-slate-800/40 transition-colors ${
                    tx.nivelAlerta === 'CRITICO' ? 'bg-red-950/20' : tx.nivelAlerta === 'ALTO' ? 'bg-amber-950/15' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono">
                    <span className="text-white font-semibold block">{tx.id}</span>
                    <span className="text-[10px] text-slate-400">{tx.fecha}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-200 block">{tx.proveedor}</span>
                    <span className="text-[10px] text-slate-500">{tx.categoria}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-slate-300 block max-w-xs truncate">{tx.concepto}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{tx.cuentaContable}</span>
                  </td>

                  <td className="px-4 py-3 text-right font-mono font-bold text-white">
                    ${tx.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3">
                    {tx.esMontoEstructurado && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40 mr-1.5">
                        <AlertTriangle className="w-3 h-3" /> Estructuración &lt; $10k
                      </span>
                    )}
                    {tx.esDuplicadoSospechoso && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 mr-1.5">
                        <AlertTriangle className="w-3 h-3" /> Factura Duplicada
                      </span>
                    )}
                    {tx.esFinDeSemana && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
                        <Calendar className="w-3 h-3" /> Fin de Semana
                      </span>
                    )}
                    {!tx.esMontoEstructurado && !tx.esDuplicadoSospechoso && !tx.esFinDeSemana && (
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> Sin anomalías aparentes
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block font-mono font-extrabold px-2 py-0.5 rounded text-[10px] ${
                      tx.nivelAlerta === 'CRITICO' ? 'bg-red-500 text-white' :
                      tx.nivelAlerta === 'ALTO' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      tx.nivelAlerta === 'MEDIO' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {tx.scoreRiesgo} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Inject / Add Transaction */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              <span>Inyectar Transacción para Prueba Forense</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ingresa un monto sospechoso (ej. $9,940 para probar evasión de umbral FinCEN o $4,990)
            </p>

            <form onSubmit={handleAddTransaction} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Monto en Dólares (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newMonto}
                  onChange={(e) => setNewMonto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proveedor / Beneficiario
                </label>
                <input
                  type="text"
                  required
                  value={newProveedor}
                  onChange={(e) => setNewProveedor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Concepto Contable
                </label>
                <input
                  type="text"
                  required
                  value={newConcepto}
                  onChange={(e) => setNewConcepto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="esFin"
                  checked={newEsFinSemana}
                  onChange={(e) => setNewEsFinSemana(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700"
                />
                <label htmlFor="esFin" className="text-xs text-slate-300">
                  Marcar como registro de fin de semana (Sábado/Domingo)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                >
                  Agregar y Analizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Forensic Audit Opinion Dossier */}
      {showDictamenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  AUDIT INTELLIGENCE USA // CERTIFICATE OF FORENSIC FINDINGS
                </span>
                <h3 className="text-xl font-bold text-white">
                  Dictamen Pericial de Auditoría Forense
                </h3>
              </div>
              <button
                onClick={() => setShowDictamenModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Expediente Pericial:</span>
                  <span className="text-white font-bold">USA-FOR-2026-089A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha de Emisión:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Auditor Responsable:</span>
                  <span className="text-cyan-300">{userTrial.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Licencia Aplicada:</span>
                  <span className="text-amber-300 uppercase">{userTrial.tipoLicencia} (3 Días)</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  1. Objeto y Alcance del Peritaje
                </h4>
                <p>
                  Se realizó el cotejo automatizado de <strong>{summary.totalTransacciones} partidas contables</strong> por un importe agregado de <strong>${summary.montoTotalAuditado.toLocaleString('en-US')} USD</strong>, aplicando pruebas de conformidad con la Ley de Benford, detección de fragmentación (Structuring) bajo normativas FinCEN, y búsqueda de asientos extracontables.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1 text-red-300">
                  2. Conclusión y Dictamen Forense
                </h4>
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200">
                  <strong>DICTAMEN: EVIDENCIA SIGNIFICATIVA DE FRAUDE Y EVASIÓN DE CONTROLES.</strong>
                  <p className="mt-1">
                    Se detectaron indicios consistentes de estructuración deliberada de pagos para eludir el umbral de reporte de $10,000 USD, así como duplicidad de comprobantes fiscales por $7,500 USD y ajustes de fin de semana no autorizados.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Sello Digital SHA-256: d8f3a...b8201
                </span>
                <button
                  onClick={() => setShowDictamenModal(false)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Cerrar Dictamen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
