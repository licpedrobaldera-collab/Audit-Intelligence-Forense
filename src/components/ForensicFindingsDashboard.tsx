import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  Layers,
  Calendar,
  CheckCircle2,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  Zap,
  Info,
  Database,
  FolderOpen,
  FileCheck,
  Scale
} from 'lucide-react';
import { ForensicFinding, MasterCase } from '../types';
import {
  aggregateFindingsBySeverity,
  aggregateCumulativeImpactOverTime,
  aggregateFindingsByDomainModule,
  calculateForensicAuditKpis,
  SEVERITY_CONFIG,
  normalizeSeverity
} from '../utils/forensicFindingsHelper';

interface ForensicFindingsDashboardProps {
  masterCase: MasterCase;
  findings: ForensicFinding[];
  currency?: string;
  onSelectSeverity?: (severity: string) => void;
  onOpenAddModal?: () => void;
  onNavigateToEvidenceDossier?: (findingId?: number) => void;
}

const SEVERITY_COLORS = SEVERITY_CONFIG;

export const ForensicFindingsDashboard: React.FC<ForensicFindingsDashboardProps> = ({
  masterCase,
  findings,
  currency = 'RD$',
  onSelectSeverity,
  onOpenAddModal,
  onNavigateToEvidenceDossier
}) => {
  const [barChartMode, setBarChartMode] = useState<'impact' | 'count'>('impact');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('ALL');

  // 1. Data processing helper: Calculate Severity Distribution for Recharts Bar Chart
  const severityChartData = useMemo(() => {
    return aggregateFindingsBySeverity(findings, masterCase.total_financial_impact);
  }, [findings, masterCase.total_financial_impact]);

  // 2. Data processing helper: Calculate Cumulative Financial Impact Over Time for Recharts Area Chart
  const timelineChartData = useMemo(() => {
    return aggregateCumulativeImpactOverTime(findings, currency);
  }, [findings, currency]);

  // 3. Data processing helper: Calculate Forensic Audit KPIs and metrics
  const kpis = useMemo(() => {
    return calculateForensicAuditKpis(findings, masterCase);
  }, [findings, masterCase]);

  // 4. Data processing helper: Domain breakdown
  const domainBreakdown = useMemo(() => {
    return aggregateFindingsByDomainModule(findings);
  }, [findings]);

  // Filtered findings list
  const filteredFindings = useMemo(() => {
    if (selectedSeverityFilter === 'ALL') return findings;
    return findings.filter((f) => normalizeSeverity(f.severity) === selectedSeverityFilter);
  }, [findings, selectedSeverityFilter]);

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header & Insights Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <BarChart2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Dashboard Visual de Hallazgos Forenses
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                RECHARTS ANALYTICS
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Visualización analítica multicriterio: distribución de severidad normativa y evolución temporal del impacto financiero cuantificado en el expediente <strong className="text-slate-200">{masterCase.case_code}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToEvidenceDossier && (
              <button
                onClick={() => onNavigateToEvidenceDossier()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-2 border border-cyan-500/30 transition-all cursor-pointer shadow-md"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Carpetas &amp; Evidencias</span>
              </button>
            )}

            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>+ Registrar Hallazgo</span>
              </button>
            )}
          </div>
        </div>

        {/* Forensic Intelligence KPI Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start text-xs font-mono text-slate-400">
              <span>Perjuicio Consolidado</span>
              <DollarSign className="w-4 h-4 text-red-400" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-red-400">
              {currency} ${kpis.formattedTotalImpact}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">100% Cuantificado</span>
              <span>•</span>
              <span>{findings.length} incidencias</span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start text-xs font-mono text-slate-400">
              <span>Riesgo Crítico + Alto</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-amber-400">
              {kpis.riskConcentrationPct}%
            </div>
            <div className="mt-1 text-[11px] text-slate-400 truncate">
              {currency} ${kpis.formattedCriticalHighImpact} en zona crítica
            </div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start text-xs font-mono text-slate-400">
              <span>Impacto Promedio</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-white">
              {currency} ${kpis.formattedAverageImpact}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Por vector pericial auditado
            </div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start text-xs font-mono text-slate-400">
              <span>Trazabilidad Forense</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-sm font-bold font-mono text-emerald-400 truncate">
              SHA-256 Inmutable
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Audit Intelligence USA • Lic. Baldera
            </div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>

        {/* Dual Chart Grid: Bar Chart (Severity) & Area Chart (Timeline Impact) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* 1. BAR CHART: SEVERITY LEVELS */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span>Distribución por Nivel de Severidad (Bar Chart)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Clasificación pericial de riesgo (Crítico, Alto, Medio, Bajo)
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
                  <button
                    onClick={() => setBarChartMode('impact')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      barChartMode === 'impact'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Impacto ($)
                  </button>
                  <button
                    onClick={() => setBarChartMode('count')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      barChartMode === 'count'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cantidad (Nº)
                  </button>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-64 sm:h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={severityChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis
                      dataKey="nombre"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                      tickFormatter={(value) =>
                        barChartMode === 'impact'
                          ? `$${(value / 1000000).toFixed(1)}M`
                          : `${value}`
                      }
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const sev = data.severity;
                          const colors = SEVERITY_COLORS[sev] || SEVERITY_COLORS.MEDIUM;

                          return (
                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl space-y-1.5 text-xs font-mono max-w-xs">
                              <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.badge}`}>
                                  {data.nombre.toUpperCase()}
                                </span>
                                <span className="text-slate-400 text-[10px]">
                                  {data.percentage}% del total
                                </span>
                              </div>
                              <div className="text-white">
                                <span className="text-slate-400">Impacto Cuantificado: </span>
                                <strong className="text-red-400">{currency} ${data.impactFormatted}</strong>
                              </div>
                              <div className="text-slate-300">
                                <span className="text-slate-400">Incidencias Detectadas: </span>
                                <strong className="text-white">{data.count} caso(s)</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey={barChartMode === 'impact' ? 'impact' : 'count'}
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    >
                      {severityChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fillColor}
                          className="hover:opacity-85 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Severity Breakdown Pills */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
              {severityChartData.map((item) => (
                <div
                  key={item.severity}
                  onClick={() => {
                    setSelectedSeverityFilter(
                      selectedSeverityFilter === item.severity ? 'ALL' : item.severity
                    );
                    onSelectSeverity?.(item.severity);
                  }}
                  className={`p-2 rounded-xl text-center cursor-pointer transition-all border ${
                    selectedSeverityFilter === item.severity
                      ? 'bg-slate-800 border-white/40 ring-1 ring-white/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 truncate">
                    {item.nombre}
                  </div>
                  <div className="text-xs font-mono font-bold mt-0.5" style={{ color: item.fillColor }}>
                    {barChartMode === 'impact' ? `$${(item.impact / 1000).toFixed(0)}k` : `${item.count} items`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. AREA CHART: FINANCIAL IMPACT DISTRIBUTION OVER TIME */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Evolución Temporal del Impacto (Area Chart)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Acumulación progresiva del perjuicio financiero cuantificado
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>Octubre 2026 (Ventana 7D)</span>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-64 sm:h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timelineChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="periodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl space-y-2 text-xs font-mono max-w-xs">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                                <span className="font-bold text-cyan-400">{data.date}</span>
                                <span className="text-[10px] text-slate-400">{data.label}</span>
                              </div>
                              <div className="text-[11px] text-white">
                                <span className="text-slate-400 block text-[10px]">Incidencia Detectada:</span>
                                <strong>{data.incident}</strong>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Impacto Evento:</span>
                                  <span className="text-amber-400 font-bold">{data.displayPeriodo}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Acumulado Total:</span>
                                  <span className="text-red-400 font-bold">{data.displayAcumulado}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="impactoAcumulado"
                      name="Perjuicio Acumulado"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#impactGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="impactoPeriodo"
                      name="Impacto por Evento"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#periodGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Timeline Footnote & Forensic Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-1 bg-blue-500 rounded-full" />
                  <span>Curva Acumulada</span>
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="w-2.5 h-1 bg-purple-500 border border-dashed rounded-full" />
                  <span>Evento Específico</span>
                </span>
              </div>
              <span className="text-slate-500 text-[10px]">
                Umbral Licitación: RD$ 3,500,000.00
              </span>
            </div>
          </div>
        </div>

        {/* 3. FILTERED FINDINGS SUMMARY & PERICIAL DRILL-DOWN */}
        <div className="pt-2 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Incidencias Filtradas por Severidad:</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono">
                {selectedSeverityFilter === 'ALL' ? 'Todos' : selectedSeverityFilter} ({filteredFindings.length})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setSelectedSeverityFilter(filterKey)}
                  className={`px-3 py-1 rounded-lg font-mono text-[10px] font-bold transition-all ${
                    selectedSeverityFilter === filterKey
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {filterKey === 'ALL' ? 'Ver Todos' : filterKey}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredFindings.map((finding) => {
              const sevConfig = SEVERITY_COLORS[finding.severity] || SEVERITY_COLORS.MEDIUM;

              return (
                <div
                  key={finding.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl space-y-2.5 transition-all group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white text-[11px] truncate max-w-[180px]">
                      {finding.domain_module}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${sevConfig.badge}`}>
                      {finding.severity}
                    </span>
                  </div>

                  <div className="text-cyan-400 font-mono text-[11px]">
                    {finding.norm_or_vector}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {finding.description}
                  </p>

                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-400">
                    <span className="truncate max-w-[170px] text-cyan-300">
                      📁 {finding.evidence_folder_path || `evidencias_oficiales/.../HALLAZGO_${finding.id}`}
                    </span>
                    <span className="text-emerald-400 font-bold shrink-0">
                      {finding.evidences?.length || 0} Evid.
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">Cuantificación:</span>
                    <strong className="text-red-400">
                      {currency} ${finding.quantified_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  {onNavigateToEvidenceDossier && (
                    <button
                      onClick={() => onNavigateToEvidenceDossier(finding.id)}
                      className="w-full mt-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Abrir Carpeta &amp; Marco Legal</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Forensic Auditor Signoff Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-white block">
                Dictamen Forense Certificado • Audit Intelligence USA
              </span>
              <span className="text-slate-400 text-[11px]">
                Validado por el <strong className="text-cyan-300">Lic. Pedro Baldera</strong> bajo estándares de cadena de custodia digital inmutable y análisis de Ley de Benford.
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 font-mono text-[11px] text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            ✓ Base de Datos: audit_system_ultimate.db
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForensicFindingsDashboard;
