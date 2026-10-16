import React, { useState, useMemo } from 'react';
import { 
  PieChart as PieChartIcon, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Calendar, 
  Globe, 
  TrendingUp, 
  DollarSign, 
  Share2, 
  MessageSquare,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrialSignup } from '../types';

interface TrialAnalyticsProps {
  onNavigateToRegister?: () => void;
  onOpenUpgradeModal?: () => void;
}

const INITIAL_SIGNUPS: TrialSignup[] = [
  {
    id: 'TRL-9041',
    email: 'marcos.santos@consultoresbasa.com',
    nombreAuditor: 'Marcos Santos',
    empresa: 'Santos & Asociados Contabilidad',
    pais: 'República Dominicana',
    fechaRegistro: new Date(Date.now() - 0.4 * 86400 * 1000).toISOString(),
    diasTranscurridos: 0.4,
    horasRestantes: 62.4,
    estado: 'ACTIVO',
    estadoPago: false,
    ultimoAcceso: 'Hace 22 minutos',
    planInteres: 'PRO'
  },
  {
    id: 'TRL-9042',
    email: 'patricia.velez@audit-forensic.us',
    nombreAuditor: 'Patricia Vélez CPA',
    empresa: 'Vélez Financial Investigation',
    pais: 'Estados Unidos (Florida)',
    fechaRegistro: new Date(Date.now() - 1.1 * 86400 * 1000).toISOString(),
    diasTranscurridos: 1.1,
    horasRestantes: 45.6,
    estado: 'ACTIVO',
    estadoPago: false,
    ultimoAcceso: 'Hace 1 hora',
    planInteres: 'ENTERPRISE'
  },
  {
    id: 'TRL-9043',
    email: 'carlos.mendoza@auditorias-usa.com',
    nombreAuditor: 'Carlos Mendoza',
    empresa: 'Mendoza & Partners CPA',
    pais: 'Estados Unidos (Delaware)',
    fechaRegistro: new Date(Date.now() - 1.8 * 86400 * 1000).toISOString(),
    diasTranscurridos: 1.8,
    horasRestantes: 28.8,
    estado: 'ACTIVO',
    estadoPago: false,
    ultimoAcceso: 'Hace 3 horas',
    planInteres: 'PRO'
  },
  {
    id: 'TRL-9044',
    email: 'rodriguez.forense@miami-audit.com',
    nombreAuditor: 'Elena Rodríguez',
    empresa: 'Miami Forensic Audit LLC',
    pais: 'Estados Unidos (Florida)',
    fechaRegistro: new Date(Date.now() - 3.4 * 86400 * 1000).toISOString(),
    diasTranscurridos: 3.4,
    horasRestantes: 0,
    estado: 'EXPIRADO',
    estadoPago: false,
    ultimoAcceso: 'Ayer a las 16:20',
    planInteres: 'PRO'
  },
  {
    id: 'TRL-9045',
    email: 'auditor.delaware@corp-checks.com',
    nombreAuditor: 'James K. Wilson',
    empresa: 'Delaware Compliance Group',
    pais: 'Estados Unidos (Delaware)',
    fechaRegistro: new Date(Date.now() - 4.1 * 86400 * 1000).toISOString(),
    diasTranscurridos: 4.1,
    horasRestantes: 0,
    estado: 'EXPIRADO',
    estadoPago: false,
    ultimoAcceso: 'Hace 2 días',
    planInteres: 'BASIC'
  },
  {
    id: 'TRL-9046',
    email: 'javier.ortiz@ibero-audit.com',
    nombreAuditor: 'Javier Ortiz',
    empresa: 'Ortiz & Valenzuela Forensics',
    pais: 'México / Latam',
    fechaRegistro: new Date(Date.now() - 3.7 * 86400 * 1000).toISOString(),
    diasTranscurridos: 3.7,
    horasRestantes: 0,
    estado: 'EXPIRADO',
    estadoPago: false,
    ultimoAcceso: 'Hace 1 día',
    planInteres: 'PRO'
  },
  {
    id: 'TRL-9047',
    email: 'licpedrobaldera@gmail.com',
    nombreAuditor: 'Pedro Baldera',
    empresa: 'Baldera Santos & Asociados',
    pais: 'República Dominicana (Admin)',
    fechaRegistro: '2026-09-01T00:00:00Z',
    diasTranscurridos: 30.0,
    horasRestantes: 0,
    estado: 'CONVERTIDO_PRO',
    estadoPago: true,
    ultimoAcceso: 'En línea ahora',
    planInteres: 'PRO'
  },
  {
    id: 'TRL-9048',
    email: 'diana.silva@colombia-forense.co',
    nombreAuditor: 'Diana Silva',
    empresa: 'Silva Consultoría Antifraude',
    pais: 'Colombia',
    fechaRegistro: new Date(Date.now() - 2.2 * 86400 * 1000).toISOString(),
    diasTranscurridos: 2.2,
    horasRestantes: 19.2,
    estado: 'CONVERTIDO_PRO',
    estadoPago: true,
    ultimoAcceso: 'Hace 40 minutos',
    planInteres: 'ENTERPRISE'
  },
  {
    id: 'TRL-9049',
    email: 'alberto.morales@peritajes-cpa.com',
    nombreAuditor: 'Alberto Morales',
    empresa: 'Morales Peritajes Contables',
    pais: 'Estados Unidos (Texas)',
    fechaRegistro: new Date(Date.now() - 0.2 * 86400 * 1000).toISOString(),
    diasTranscurridos: 0.2,
    horasRestantes: 67.2,
    estado: 'ACTIVO',
    estadoPago: false,
    ultimoAcceso: 'Hace 5 minutos',
    planInteres: 'PRO'
  }
];

export const TrialAnalytics: React.FC<TrialAnalyticsProps> = ({
  onNavigateToRegister,
  onOpenUpgradeModal
}) => {
  const [signups, setSignups] = useState<TrialSignup[]>(INITIAL_SIGNUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVO' | 'EXPIRADO' | 'CONVERTIDO_PRO'>('ALL');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'donut' | 'pie'>('donut');
  const [notification, setNotification] = useState<string | null>(null);

  // Computed metrics
  const totalUsers = signups.length;
  const activeUsers = signups.filter((s) => s.estado === 'ACTIVO').length;
  const expiredUsers = signups.filter((s) => s.estado === 'EXPIRADO').length;
  const convertedUsers = signups.filter((s) => s.estado === 'CONVERTIDO_PRO').length;

  const activePercent = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  const expiredPercent = totalUsers > 0 ? (expiredUsers / totalUsers) * 100 : 0;
  const convertedPercent = totalUsers > 0 ? (convertedUsers / totalUsers) * 100 : 0;

  // Filtered signups list
  const filteredSignups = useMemo(() => {
    return signups.filter((s) => {
      const matchesSearch = 
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nombreAuditor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (statusFilter !== 'ALL' && s.estado !== statusFilter) return false;
      return true;
    });
  }, [signups, searchTerm, statusFilter]);

  // Actions on users
  const handleExtendTrial = (id: string, email: string) => {
    setSignups((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            diasTranscurridos: 0.1,
            horasRestantes: 69.6,
            estado: 'ACTIVO'
          };
        }
        return s;
      })
    );
    setNotification(`⏱️ Prueba extendida por 72 horas para ${email}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConvertToPro = (id: string, email: string) => {
    setSignups((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            estado: 'CONVERTIDO_PRO',
            estadoPago: true,
            horasRestantes: 0
          };
        }
        return s;
      })
    );
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setNotification(`💎 Licencia Pro activada para ${email} (Pago BHD León registrado).`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSimulateNewSignup = () => {
    const fakeId = `TRL-${Math.floor(9050 + Math.random() * 900)}`;
    const newAuditor: TrialSignup = {
      id: fakeId,
      email: `auditor.${fakeId.toLowerCase()}@firma-demo.com`,
      nombreAuditor: 'Auditor Nuevo Demo',
      empresa: 'Firma Contable Forense Int.',
      pais: 'Estados Unidos (Florida)',
      fechaRegistro: new Date().toISOString(),
      diasTranscurridos: 0.05,
      horasRestantes: 71.0,
      estado: 'ACTIVO',
      estadoPago: false,
      ultimoAcceso: 'Justo ahora',
      planInteres: 'PRO'
    };

    setSignups([newAuditor, ...signups]);
    setNotification(`✨ Nuevo registro simulado: ${newAuditor.email} en https://audit-intelligence-usa.com/trial.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Auditor,Email,Empresa,Pais,Estado,HorasRestantes,EstadoPago,FechaRegistro\n';
    const rows = signups
      .map(
        (s) =>
          `"${s.id}","${s.nombreAuditor}","${s.email}","${s.empresa}","${s.pais}","${s.estado}",${s.horasRestantes},${s.estadoPago},"${s.fechaRegistro}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trial_signups_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Pie chart calculation
  // Slices:
  // 1. Activos: cyan (#06b6d4)
  // 2. Expirados: red/rose (#f43f5e)
  // 3. Convertidos: emerald (#10b981)
  const pieData = [
    {
      key: 'ACTIVO',
      label: 'Prueba Activa (≤ 72h)',
      count: activeUsers,
      percent: activePercent,
      color: '#06b6d4',
      hoverColor: '#22d3ee',
      tailwindText: 'text-cyan-400',
      tailwindBg: 'bg-cyan-500'
    },
    {
      key: 'EXPIRADO',
      label: 'Prueba Expirada (> 3 días)',
      count: expiredUsers,
      percent: expiredPercent,
      color: '#f43f5e',
      hoverColor: '#fb7185',
      tailwindText: 'text-rose-400',
      tailwindBg: 'bg-rose-500'
    },
    {
      key: 'CONVERTIDO_PRO',
      label: 'Convertidos Pro (BHD León)',
      count: convertedUsers,
      percent: convertedPercent,
      color: '#10b981',
      hoverColor: '#34d399',
      tailwindText: 'text-emerald-400',
      tailwindBg: 'bg-emerald-500'
    }
  ];

  // Build SVG arc paths
  const radius = 100;
  const innerRadius = chartType === 'donut' ? 62 : 0;
  const centerX = 130;
  const centerY = 130;

  let cumulativeAngle = 0;
  const slicesWithPaths = pieData.map((slice) => {
    const sliceAngle = (slice.percent / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const isHovered = hoveredSlice === slice.key;
    const currentRadius = isHovered ? radius + 6 : radius;

    const x1 = centerX + currentRadius * Math.cos(startRad);
    const y1 = centerY + currentRadius * Math.sin(startRad);
    const x2 = centerX + currentRadius * Math.cos(endRad);
    const y2 = centerY + currentRadius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    let path = '';
    if (chartType === 'donut') {
      const ix1 = centerX + innerRadius * Math.cos(endRad);
      const iy1 = centerY + innerRadius * Math.sin(endRad);
      const ix2 = centerX + innerRadius * Math.cos(startRad);
      const iy2 = centerY + innerRadius * Math.sin(startRad);

      path = `M ${x1} ${y1} A ${currentRadius} ${currentRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
    } else {
      path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${currentRadius} ${currentRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    return {
      ...slice,
      path,
      startAngle,
      endAngle
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300">
                <PieChartIcon className="w-3.5 h-3.5 text-cyan-400" />
                ANALYTICS EN TIEMPO REAL // 3-DAY TRIAL FUNNEL
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Ruta: https://audit-intelligence-usa.com/trial
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Métricas de Usuarios de Prueba (Trial Analytics)
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Visualiza en vivo la proporción entre auditores con prueba activa (≤ 72 horas), usuarios expirados que requieren upgrade al Banco BHD León, y cuentas convertidas a permanente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleSimulateNewSignup}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Simula que un nuevo auditor se registra en /trial para ver cómo se actualiza la tarta en vivo"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Simular Registro</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total signups */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Total Auditores</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-sans mt-1">
            {totalUsers}
          </div>
          <p className="text-[11px] text-slate-400">
            Registrados en el portal /trial
          </p>
        </div>

        {/* Active Trials */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 space-y-1 bg-cyan-950/10">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-mono">
            <span>En Prueba Activa (≤ 72h)</span>
            <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="text-3xl font-black text-cyan-400 font-sans mt-1">
            {activeUsers}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-cyan-300/80 font-mono">
            <span>{activePercent.toFixed(1)}% del total</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Acceso concedido</span>
          </div>
        </div>

        {/* Expired Trials */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5 space-y-1 bg-rose-950/10">
          <div className="flex items-center justify-between text-xs text-rose-300 font-mono">
            <span>Pruebas Expiradas (&gt; 3d)</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400 font-sans mt-1">
            {expiredUsers}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-300/80 font-mono">
            <span>{expiredPercent.toFixed(1)}% bloqueados</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Requieren pago BHD</span>
          </div>
        </div>

        {/* Converted Pro */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-1 bg-emerald-950/10">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
            <span>Convertidos a Pro (Pagados)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-sans mt-1">
            {convertedUsers}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-300/80 font-mono">
            <span>{convertedPercent.toFixed(1)}% tasa conversión</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Acceso ilimitado</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pie Chart on Left (5 cols) & Analytics Breakdown on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pie Chart Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-cyan-400" />
                <span>Distribución de Estados Trial</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Proporción visual de usuarios activos vs expirados
              </p>
            </div>

            {/* Toggle Donut / Pie */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setChartType('donut')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartType === 'donut' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dona
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartType === 'pie' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tarta
              </button>
            </div>
          </div>

          {/* SVG Pie Chart */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg width="260" height="260" viewBox="0 0 260 260" className="overflow-visible">
                <g>
                  {slicesWithPaths.map((slice) => (
                    <path
                      key={slice.key}
                      d={slice.path}
                      fill={hoveredSlice === slice.key ? slice.hoverColor : slice.color}
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        filter: hoveredSlice === slice.key ? `drop-shadow(0 0 8px ${slice.color})` : 'none',
                        transformOrigin: `${centerX}px ${centerY}px`
                      }}
                      onMouseEnter={() => setHoveredSlice(slice.key)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  ))}
                </g>
              </svg>

              {/* Center readout in donut mode */}
              {chartType === 'donut' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-2xl font-black text-white font-mono leading-none my-1">
                    {totalUsers}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {hoveredSlice
                      ? pieData.find((p) => p.key === hoveredSlice)?.label.split(' ')[0]
                      : 'Usuarios'}
                  </span>
                </div>
              )}
            </div>

            {/* Hover Tooltip / Detail capsule */}
            <div className="mt-4 min-h-[44px] flex items-center justify-center">
              {hoveredSlice ? (
                (() => {
                  const activeItem = pieData.find((p) => p.key === hoveredSlice);
                  if (!activeItem) return null;
                  return (
                    <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-center animate-fade-in shadow-lg">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: activeItem.color }}
                        ></span>
                        <span>{activeItem.label}</span>
                        <span className={`font-mono ${activeItem.tailwindText}`}>
                          {activeItem.count} ({activeItem.percent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <span className="text-xs text-slate-500 font-mono">
                  Pasa el ratón sobre un segmento para inspeccionar detalles
                </span>
              )}
            </div>
          </div>

          {/* Interactive Legend with Click / Hover */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            {pieData.map((item) => (
              <div
                key={item.key}
                onMouseEnter={() => setHoveredSlice(item.key)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  hoveredSlice === item.key
                    ? 'bg-slate-950 border-cyan-500/60 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.key === 'ACTIVO'
                        ? 'Acceso permitido a motor forense'
                        : item.key === 'EXPIRADO'
                        ? 'Bloqueado por decorador @requiere_trial'
                        : 'Factura BHD León generada'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-bold font-mono ${item.tailwindText}`}>
                    {item.count}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {item.percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signups List & Detailed Status Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Registros Recientes de Prueba (/trial)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Listado en vivo de auditores y estado de sus 3 días de prueba
              </p>
            </div>

            {/* Status Filter buttons */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg ${
                  statusFilter === 'ALL' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({signups.length})
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVO')}
                className={`px-2.5 py-1 rounded-lg ${
                  statusFilter === 'ACTIVO' ? 'bg-cyan-600 text-white font-bold' : 'text-cyan-400 hover:text-white'
                }`}
              >
                Activos ({activeUsers})
              </button>
              <button
                onClick={() => setStatusFilter('EXPIRADO')}
                className={`px-2.5 py-1 rounded-lg ${
                  statusFilter === 'EXPIRADO' ? 'bg-rose-600 text-white font-bold' : 'text-rose-400 hover:text-white'
                }`}
              >
                Expirados ({expiredUsers})
              </button>
              <button
                onClick={() => setStatusFilter('CONVERTIDO_PRO')}
                className={`px-2.5 py-1 rounded-lg ${
                  statusFilter === 'CONVERTIDO_PRO' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400 hover:text-white'
                }`}
              >
                Pro ({convertedUsers})
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por auditor, email, firma o país..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
            />
          </div>

          {/* Signups List */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredSignups.length === 0 ? (
              <div className="text-center p-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No se encontraron usuarios que coincidan con los filtros seleccionados.
              </div>
            ) : (
              filteredSignups.map((user) => {
                const isExpired = user.estado === 'EXPIRADO';
                const isPro = user.estado === 'CONVERTIDO_PRO';
                const isActive = user.estado === 'ACTIVO';

                const progressPercent = Math.min(100, Math.max(0, (user.diasTranscurridos / 3.0) * 100));

                return (
                  <div
                    key={user.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isExpired
                        ? 'bg-rose-950/15 border-rose-500/30'
                        : isPro
                        ? 'bg-emerald-950/15 border-emerald-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {/* Left: User details */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">
                            {user.nombreAuditor}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {user.id}
                          </span>

                          {/* Status Badge */}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                              Prueba Activa ({user.horasRestantes.toFixed(0)}h restantes)
                            </span>
                          )}

                          {isExpired && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
                              <AlertCircle className="w-3 h-3 text-rose-400" />
                              Expirado ({user.diasTranscurridos.toFixed(1)}d &gt; 3.0d)
                            </span>
                          )}

                          {isPro && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Licencia Pro BHD
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-300 font-mono">
                          {user.email}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap pt-0.5">
                          <span>{user.empresa}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-cyan-400" />
                            {user.pais}
                          </span>
                          <span>•</span>
                          <span>{user.ultimoAcceso}</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {isExpired && (
                          <button
                            onClick={() => handleConvertToPro(user.id, user.email)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                            title="Registrar pago recibido en Banco BHD León y activar Pro"
                          >
                            Activar Pro BHD
                          </button>
                        )}

                        {!isPro && (
                          <button
                            onClick={() => handleExtendTrial(user.id, user.email)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-mono transition-colors"
                            title="Reiniciar contador a 72 horas adicionales"
                          >
                            +3 Días
                          </button>
                        )}

                        <a
                          href={`https://wa.me/18297717390?text=Hola%20${encodeURIComponent(user.nombreAuditor)},%20te%20contacto%20de%20Audit%20Intelligence%20USA%20respecto%20a%20tu%20cuenta`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-700 transition-colors"
                          title="Contactar vía WhatsApp (+1 829-771-7390)"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Progress bar of 3-day window */}
                    {!isPro && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>Uso de las 72 horas del Trial:</span>
                          <span className={isExpired ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                            {user.diasTranscurridos.toFixed(1)} / 3.0 días ({progressPercent.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isExpired ? 'bg-rose-500' : progressPercent > 70 ? 'bg-amber-400' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
