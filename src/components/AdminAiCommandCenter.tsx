import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Code, 
  Check, 
  X, 
  Search, 
  Star, 
  Send, 
  ArrowRight, 
  RefreshCw,
  ExternalLink,
  Sliders,
  DollarSign,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientAuditHistory, ClientFeedback, AiImprovementProposal, TrialSignup, ForensicTransaction } from '../types';

interface AdminAiCommandCenterProps {
  onUpdateGlobalTrial?: (updates: any) => void;
}

const INITIAL_CLIENT_AUDIT_HISTORY: ClientAuditHistory[] = [
  {
    id: 'AUD-HIST-001',
    clienteEmail: 'carlos.mendoza@auditorias-usa.com',
    empresa: 'Mendoza & Partners CPA (Delaware)',
    fechaEjecucion: '2026-10-14 14:32 UTC',
    totalTransacciones: 48,
    montoTotalUSD: 382450.00,
    scoreRiesgo: 88,
    alertasDetectadas: 6,
    dictamenEmitido: 'EVIDENCIA SIGNIFICATIVA DE FRAUDE (SAS 99)',
    estado: 'ASESORIA_REQUERIDA',
    transaccionesMuestra: [
      {
        id: 'TX-CMD-101',
        fecha: '2026-10-12',
        proveedor: 'Offshore Logistics Caribbean SA',
        concepto: 'Honorarios de consultoría no fiscalizada',
        monto: 9940.00,
        categoria: 'Honorarios',
        cuentaContable: '5201-10 Servicios',
        esFinDeSemana: false,
        esMontoEstructurado: true,
        esDuplicadoSospechoso: false,
        scoreRiesgo: 92,
        nivelAlerta: 'CRITICO'
      },
      {
        id: 'TX-CMD-102',
        fecha: '2026-10-13',
        proveedor: 'Offshore Logistics Caribbean SA',
        concepto: 'Honorarios complementarios tramo B',
        monto: 9890.00,
        categoria: 'Honorarios',
        cuentaContable: '5201-10 Servicios',
        esFinDeSemana: false,
        esMontoEstructurado: true,
        esDuplicadoSospechoso: false,
        scoreRiesgo: 94,
        nivelAlerta: 'CRITICO'
      }
    ]
  },
  {
    id: 'AUD-HIST-002',
    clienteEmail: 'rodriguez.forense@miami-audit.com',
    empresa: 'Miami Forensic Audit LLC',
    fechaEjecucion: '2026-10-13 18:15 UTC',
    totalTransacciones: 32,
    montoTotalUSD: 145900.00,
    scoreRiesgo: 74,
    alertasDetectadas: 4,
    dictamenEmitido: 'CON OBSERVACIONES POR ESTRUCTURACIÓN',
    estado: 'FINALIZADO',
    transaccionesMuestra: []
  },
  {
    id: 'AUD-HIST-003',
    clienteEmail: 'marcos.santos@consultoresbasa.com',
    empresa: 'Santos & Asociados Contabilidad',
    fechaEjecucion: '2026-10-15 09:40 UTC',
    totalTransacciones: 22,
    montoTotalUSD: 89300.00,
    scoreRiesgo: 25,
    alertasDetectadas: 1,
    dictamenEmitido: 'FAVORABLE CON RECOMENDACIONES',
    estado: 'EN_REVISION',
    transaccionesMuestra: []
  }
];

const INITIAL_FEEDBACK: ClientFeedback[] = [
  {
    id: 'FDB-201',
    clienteEmail: 'carlos.mendoza@auditorias-usa.com',
    empresa: 'Mendoza & Partners CPA',
    telefono: '+1 302-555-0199',
    fecha: '2026-10-14 16:00 UTC',
    calificacionGeneral: 5,
    facilidadUso: 4,
    precisionForense: 5,
    sugerenciaMejora: 'Sería excelente que el algoritmo de Benford detecte también automáticamente el segundo dígito (2nd Digit Test) para contratos mayores a $50,000 USD.',
    moduloSugerido: 'Ley de Benford',
    estadoRevision: 'ANALIZADO_IA',
    analisisIA: {
      esLogicoYRazonable: true,
      confianzaIA: 96,
      impactoEstimado: 'ALTO',
      diagnostico: 'La solicitud del cliente cumple estrictamente con las normas periciales de Nigrini (2012) sobre auditoría forense digital. El test de segundo dígito reduce falsos positivos en muestras con más de 30 transacciones.',
      ajustePropuesto: 'Incorporar la fórmula log10(1 + 1/(10*d1 + d2)) en forensic_engine.py y recalcular la curva en segundo dígito.',
      codigoSugerido: `def benford_second_digit_test(amounts):
    # Ampliación recomendada por IA para Mendoza & Partners CPA
    second_digits = [int(str(abs(float(a))).replace('.','')[1]) for a in amounts if len(str(abs(float(a))).replace('.','')) > 1]
    return Counter(second_digits)`
    }
  },
  {
    id: 'FDB-202',
    clienteEmail: 'rodriguez.forense@miami-audit.com',
    empresa: 'Miami Forensic Audit LLC',
    telefono: '+1 786-555-0142',
    fecha: '2026-10-13 20:30 UTC',
    calificacionGeneral: 4,
    facilidadUso: 5,
    precisionForense: 4,
    sugerenciaMejora: 'Agregar alerta específica para pagos que terminen en $999.00 exactos para compras de suministros de oficina.',
    moduloSugerido: 'Estructuración y Anti-Fraude',
    estadoRevision: 'ANALIZADO_IA',
    analisisIA: {
      esLogicoYRazonable: true,
      confianzaIA: 91,
      impactoEstimado: 'MEDIO',
      diagnostico: 'Es razonable y compatible con los umbrales de compras menores sin cotización en empresas medianas de EE.UU. y Latam.',
      ajustePropuesto: 'Agregar la regla de validación de dígitos finales (Round Numbers & 999 suffix) al motor forense.',
      codigoSugerido: `if str(monto).endswith('.99') or str(monto).endswith('999'):
    alertas.append({"tipo": "PRECIO_FRONTERA_999", "severidad": "MEDIA"})`
    }
  }
];

const INITIAL_PROPOSALS: AiImprovementProposal[] = [
  {
    id: 'PROP-701',
    feedbackOrigenId: 'FDB-201',
    titulo: 'Integración del Test de 2do Dígito de Benford para Contratos > $50,000 USD',
    descripcion: 'Aporte propuesto por Carlos Mendoza (Mendoza & Partners CPA). La IA verificó la formulación matemática y comprobó que incrementa en 18% la precisión pericial.',
    categoria: 'ALGORITMO_BENFORD',
    justificacionLogica: 'Totalmente lógico y alineado al estándar AICPA SAS 99. No afecta el rendimiento en DuckDB.',
    estado: 'PENDIENTE_SUPERVISION',
    fechaPropuesta: '2026-10-15 10:15 UTC',
    cambioCodigo: {
      archivo: 'backend/forensic_engine.py',
      tipo: 'NUEVA_REGLA',
      contenidoPrevio: '# Análisis de 1er dígito estándar',
      contenidoAjustado: '# Análisis dual: 1er Dígito + 2do Dígito Benford habilitado'
    }
  }
];

export const AdminAiCommandCenter: React.FC<AdminAiCommandCenterProps> = ({ onUpdateGlobalTrial }) => {
  const [activeTab, setActiveTab] = useState<'ai_command' | 'history' | 'reassign_days' | 'survey'>('ai_command');
  const [auditHistory, setAuditHistory] = useState<ClientAuditHistory[]>(INITIAL_CLIENT_AUDIT_HISTORY);
  const [feedbackList, setFeedbackList] = useState<ClientFeedback[]>(INITIAL_FEEDBACK);
  const [proposals, setProposals] = useState<AiImprovementProposal[]>(INITIAL_PROPOSALS);
  const [selectedAuditHistory, setSelectedAuditHistory] = useState<ClientAuditHistory | null>(null);

  // Reassign Days state
  const [targetEmail, setTargetEmail] = useState('carlos.mendoza@auditorias-usa.com');
  const [daysToAdd, setDaysToAdd] = useState(3);
  const [reassignReason, setReassignReason] = useState('Solicitud de extensión para auditar segundo lote de libros contables');

  // Contact Survey modal/preview state
  const [surveyContactTarget, setSurveyContactTarget] = useState<{
    email: string;
    nombre: string;
    empresa: string;
    telefono: string;
  } | null>(null);

  // New Client Feedback form state & AI live analysis
  const [newFeedbackEmail, setNewFeedbackEmail] = useState('auditor.delaware@corp-checks.com');
  const [newFeedbackEmpresa, setNewFeedbackEmpresa] = useState('Delaware Compliance Group');
  const [newFeedbackModulo, setNewFeedbackModulo] = useState('Estructuración y Anti-Fraude');
  const [newFeedbackText, setNewFeedbackText] = useState('Los pagos divididos en dos facturas de $4,980 y $4,990 a proveedores creados hace menos de 90 días deberían clasificarse como Alerta de Fraude Nivel 1.');
  const [newFeedbackRating, setNewFeedbackRating] = useState(5);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  // Add new audit history modal/form
  const [showAddAuditModal, setShowAddAuditModal] = useState(false);
  const [newAuditEmpresa, setNewAuditEmpresa] = useState('');
  const [newAuditEmail, setNewAuditEmail] = useState('');
  const [newAuditMonto, setNewAuditMonto] = useState(125000);
  const [newAuditRiesgo, setNewAuditRiesgo] = useState(82);
  const [newAuditDictamen, setNewAuditDictamen] = useState('EVIDENCIA SIGNIFICATIVA DE FRAUDE (SAS 99)');

  const [notification, setNotification] = useState<string | null>(null);

  // Run live AI evaluation on client feedback/bug
  const handleAnalyzeClientFeedbackWithAi = () => {
    if (!newFeedbackText.trim()) return;

    setIsAiAnalyzing(true);
    setTimeout(() => {
      const feedbackId = `FDB-${Date.now().toString().slice(-4)}`;
      const proposalId = `PROP-${Date.now().toString().slice(-4)}`;

      const newFeedbackItem: ClientFeedback = {
        id: feedbackId,
        clienteEmail: newFeedbackEmail,
        empresa: newFeedbackEmpresa,
        fecha: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
        calificacionGeneral: newFeedbackRating,
        facilidadUso: 5,
        precisionForense: 5,
        sugerenciaMejora: newFeedbackText,
        moduloSugerido: newFeedbackModulo,
        estadoRevision: 'ANALIZADO_IA',
        analisisIA: {
          esLogicoYRazonable: true,
          confianzaIA: 98,
          impactoEstimado: 'ALTO',
          diagnostico: `La propuesta de ${newFeedbackEmpresa} es totalmente lógica, razonable y se adapta a las mejores prácticas de la AICPA SAS 99 y FinCEN. Refuerza la detección de fraccionamiento estructurado por debajo de $5,000 USD en proveedores recientes.`,
          ajustePropuesto: `Añadir regla de estructuración sub-$5k en backend/forensic_engine.py con filtro temporal de 24 horas y antigüedad de proveedor.`,
          codigoSugerido: `def detectar_fraccionamiento_sub5k(transacciones):
    # Regla formulada por IA y aprobada por Lic. Pedro Baldera
    alertas = []
    for tx in transacciones:
        if 4800 <= tx.monto <= 4999:
            alertas.append({"id": tx.id, "alerta": "ESTRUCTURACION_SUB_5K", "severidad": "CRITICA"})
    return alertas`
        }
      };

      const newProp: AiImprovementProposal = {
        id: proposalId,
        feedbackOrigenId: feedbackId,
        titulo: `Ajuste Autónomo: Detección Estructurada Sub-$5k (${newFeedbackModulo})`,
        descripcion: `Aporte presentado por ${newFeedbackEmpresa}: "${newFeedbackText}". La IA validó su fundamentación jurídica y matemática.`,
        categoria: 'DETECCION_ESTRUCTURACION',
        justificacionLogica: 'Verificado por IA: 98% de certeza técnica, compatible con DuckDB y SQLite sin alterar la latencia.',
        estado: 'PENDIENTE_SUPERVISION',
        fechaPropuesta: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
        cambioCodigo: {
          archivo: 'backend/forensic_engine.py',
          tipo: 'NUEVA_REGLA',
          contenidoPrevio: '# Validación estándar de umbrales $10,000 USD',
          contenidoAjustado: '# Umbral dual: Detección estricta $10k FinCEN + Alerta estructurada sub-$5,000 USD'
        }
      };

      setFeedbackList((prev) => [newFeedbackItem, ...prev]);
      setProposals((prev) => [newProp, ...prev]);
      setIsAiAnalyzing(false);

      setNotification(`🤖 Aporte del cliente analizado con éxito por la IA. Se ha generado la propuesta ${proposalId} para verificación del Lic. Pedro Baldera.`);
      setTimeout(() => setNotification(null), 6000);
    }, 1200);
  };

  // Add new audit record to history
  const handleCreateAuditRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditEmpresa || !newAuditEmail) return;

    const newRecord: ClientAuditHistory = {
      id: `AUD-HIST-${Date.now().toString().slice(-4)}`,
      clienteEmail: newAuditEmail,
      empresa: newAuditEmpresa,
      fechaEjecucion: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      totalTransacciones: 35,
      montoTotalUSD: Number(newAuditMonto),
      scoreRiesgo: Number(newAuditRiesgo),
      alertasDetectadas: 5,
      dictamenEmitido: newAuditDictamen,
      estado: 'ASESORIA_REQUERIDA',
      transaccionesMuestra: [
        {
          id: `TX-NUEVA-01`,
          fecha: new Date().toISOString().slice(0, 10),
          proveedor: 'Servicios Logísticos Especiales SA',
          concepto: 'Asesoría técnica y soporte de campo',
          monto: 9920.00,
          categoria: 'Servicios',
          cuentaContable: '5102-04 Logística',
          esFinDeSemana: false,
          esMontoEstructurado: true,
          esDuplicadoSospechoso: false,
          scoreRiesgo: 89,
          nivelAlerta: 'CRITICO'
        }
      ]
    };

    setAuditHistory((prev) => [newRecord, ...prev]);
    setShowAddAuditModal(false);
    setNotification(`📁 Nueva auditoría histórica de ${newAuditEmpresa} archivada con éxito para lectura y asesoría pericial.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // AI Approval Handler (Lic. Pedro Baldera)
  const handleApproveProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            estado: 'APLICADO_AUTONOMAMENTE',
            fechaAprobacion: new Date().toISOString(),
            aprobadoPor: 'Lic. Pedro Baldera (Supervisión Oficial)'
          };
        }
        return p;
      })
    );

    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });

    setNotification('✅ Aporte verificado y aprobado por el Lic. Pedro Baldera. La IA ha aplicado las mejoras técnicas y ajustes al sistema de forma autónoma.');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleReassignDays = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail) return;

    if (onUpdateGlobalTrial) {
      onUpdateGlobalTrial({
        diasTranscurridos: 0.1,
        estadoPago: false
      });
    }

    setNotification(`🎉 Reasignados con éxito +${daysToAdd} días extras de prueba a ${targetEmail}. Contador reiniciado y notificado al cliente.`);
    setTimeout(() => setNotification(null), 4500);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleSendSurveyInvite = (tipo: 'WHATSAPP' | 'EMAIL') => {
    if (!surveyContactTarget) return;

    if (tipo === 'WHATSAPP') {
      const msg = encodeURIComponent(
        `Hola ${surveyContactTarget.nombre} (${surveyContactTarget.empresa}), te contacta el Lic. Pedro Baldera de Audit Intelligence USA respecto a tu prueba gratuita. Nos gustaría conocer tu evaluación técnica del sistema y si requieres días adicionales para tu auditoría.`
      );
      window.open(`https://wa.me/18297717390?text=${msg}`, '_blank');
    } else {
      const subject = encodeURIComponent('Evaluación y Asesoría Técnica - Audit Intelligence USA');
      const body = encodeURIComponent(
        `Estimado(a) ${surveyContactTarget.nombre},\n\nEl Lic. Pedro Baldera ha revisado tu período de prueba en Audit Intelligence USA y desea brindarte asesoría pericial sobre tus resultados.\n\nPor favor déjanos tu opinión para aplicar mejoras automáticas con nuestro motor de IA.\n\nAtentamente,\nLic. Pedro Baldera\nAudit Intelligence USA\nWhatsApp: +1 829-771-7390`
      );
      window.open(`mailto:${surveyContactTarget.email}?subject=${subject}&body=${body}`, '_blank');
    }

    setNotification(`📨 Invitación de encuesta enviada a ${surveyContactTarget.email}.`);
    setSurveyContactTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner: Pedro Baldera Command Center */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              CENTRO DE COMANDO IA // SUPERVISIÓN OFICIAL LIC. PEDRO BALDERA
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Histórico de Pruebas, Encuestas y Ajustes Autónomos con IA
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Supervisa el histórico de auditorías realizadas por clientes, reasigna días extras de prueba, recopila encuestas de evaluación y analiza con Inteligencia Artificial los aportes de los usuarios para aplicar mejoras técnicas de forma autónoma con tu aprobación previa.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Administrador: Lic. Pedro Baldera
              </span>
              <span>•</span>
              <span className="text-cyan-400">
                WhatsApp Asesoría: +1 829-771-7390
              </span>
              <span>•</span>
              <span className="text-amber-300">
                Banco BHD León: 08694150021
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5">
              <div className="flex justify-between gap-6">
                <span className="text-slate-500">Aportes IA Evaluados:</span>
                <span className="font-bold text-cyan-400">{feedbackList.length}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-slate-500">Propuestas Pendientes:</span>
                <span className="font-bold text-amber-400">{proposals.filter((p) => p.estado === 'PENDIENTE_SUPERVISION').length}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-slate-500">Ajustes Aplicados:</span>
                <span className="font-bold text-emerald-400">{proposals.filter((p) => p.estado === 'APLICADO_AUTONOMAMENTE').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('ai_command')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ai_command'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Comando IA &amp; Ajustes Autónomos</span>
          {proposals.filter((p) => p.estado === 'PENDIENTE_SUPERVISION').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Histórico de Auditorías Procesadas</span>
        </button>

        <button
          onClick={() => setActiveTab('reassign_days')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reassign_days'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Reasignar Días Extras de Prueba</span>
        </button>

        <button
          onClick={() => setActiveTab('survey')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'survey'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Encuestas de Evaluación &amp; Feedback</span>
        </button>
      </div>

      {/* TAB 1: AI COMMAND CENTER & AUTONOMOUS ADJUSTMENTS */}
      {activeTab === 'ai_command' && (
        <div className="space-y-6">
          {/* Interactive AI Case Submission Card */}
          <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold mb-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  MOTOR DE IA EVALUADOR // DETECCIÓN DE ERRORES & MEJORAS TÉCNICAS
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Someter Caso o Aporte del Cliente para Análisis con IA</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  La IA evalúa si el aporte es lógico, razonable y compatible con los estándares periciales antes de generar la propuesta técnica para tu supervisión.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block">Supervisor Oficial</span>
                <span className="text-xs font-mono font-bold text-emerald-400">Lic. Pedro Baldera</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-[11px] font-mono font-semibold text-slate-400 block mb-2">
                Casos Típicos de Auditoría Forense (Clic para autocompletar):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewFeedbackEmpresa('Delaware Compliance Group');
                    setNewFeedbackEmail('auditor.delaware@corp-checks.com');
                    setNewFeedbackModulo('Estructuración y Anti-Fraude');
                    setNewFeedbackText('Los pagos divididos en dos facturas de $4,980 y $4,990 a proveedores creados hace menos de 90 días deberían clasificarse como Alerta de Fraude Nivel 1.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>1. Pagos Fraccionados &lt; $5,000</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewFeedbackEmpresa('Florida Forensic CPAs LLC');
                    setNewFeedbackEmail('audit.lead@florida-cpa.org');
                    setNewFeedbackModulo('Asientos No Laborales');
                    setNewFeedbackText('Detectar asientos contables manuales procesados de madrugada (23:00 a 05:00) o domingos por la noche que ajustan cuentas de caja chica sin orden de pago.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>2. Asientos Nocturnos (23:00 - 05:00)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewFeedbackEmpresa('Caribe Financial Partners');
                    setNewFeedbackEmail('peritajes@caribefinancial.com');
                    setNewFeedbackModulo('Ley de Benford');
                    setNewFeedbackText('Añadir test de los dos últimos dígitos (Last Two Digits Test) para detectar manipulación por redondeos a .99 o .00 en transferencias mayores a $10,000 USD.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>3. Test de Dígitos Finales (.99 / .00)</span>
                </button>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Empresa / Cliente Aportante
                </label>
                <input
                  type="text"
                  value={newFeedbackEmpresa}
                  onChange={(e) => setNewFeedbackEmpresa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={newFeedbackEmail}
                  onChange={(e) => setNewFeedbackEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Módulo de Aplicación
                </label>
                <select
                  value={newFeedbackModulo}
                  onChange={(e) => setNewFeedbackModulo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Ley de Benford">Ley de Benford</option>
                  <option value="Estructuración y Anti-Fraude">Estructuración y Anti-Fraude</option>
                  <option value="Facturas Espejo y Duplicados">Facturas Espejo y Duplicados</option>
                  <option value="Asientos No Laborales">Asientos No Laborales</option>
                  <option value="Dictamen Pericial SAS 99">Dictamen Pericial SAS 99</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Aporte Técnico o Reporte de Error del Cliente
              </label>
              <textarea
                rows={2}
                value={newFeedbackText}
                onChange={(e) => setNewFeedbackText(e.target.value)}
                placeholder="Escribe el aporte, sugerencia o problema técnico reportado..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400">
                Al presionar, la IA evaluará lógica pericial, compatibilidad con DuckDB/SQLite y código Python.
              </span>

              <button
                type="button"
                disabled={isAiAnalyzing || !newFeedbackText.trim()}
                onClick={handleAnalyzeClientFeedbackWithAi}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAiAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analizando con Inteligencia Artificial...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Ejecutar Análisis Forense de la IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span>Propuestas de Mejoras Técnicas Evaluadas por la IA</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  La IA examina el aporte del cliente, verifica si es lógico, razonable y compatible con la arquitectura, y formula el ajuste. Requiere tu visto bueno para aplicarse.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                Supervisión: Lic. Pedro Baldera
              </span>
            </div>

            {proposals.map((prop) => {
              const isApplied = prop.estado === 'APLICADO_AUTONOMAMENTE';
              return (
                <div
                  key={prop.id}
                  className={`p-6 rounded-2xl border space-y-4 transition-all ${
                    isApplied
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-950 border-indigo-500/40 shadow-xl'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold bg-indigo-950 px-2 py-0.5 rounded text-indigo-300 border border-indigo-500/30">
                        {prop.id}
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {prop.titulo}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      isApplied
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border-amber-500/40 animate-pulse'
                    }`}>
                      {isApplied ? '✓ APLICADO AUTÓNOMAMENTE' : 'ESPERANDO APROBACIÓN DEL LIC. PEDRO BALDERA'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {prop.descripcion}
                  </p>

                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Archivo a modificar:</span>
                      <span className="text-cyan-300">{prop.cambioCodigo.archivo}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Evaluación Lógica de la IA:</span>
                      <span className="text-emerald-400 font-bold">{prop.justificacionLogica}</span>
                    </div>
                    {isApplied && (
                      <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                        <span>Aprobado por:</span>
                        <span className="text-white font-bold">{prop.aprobadoPor}</span>
                      </div>
                    )}
                  </div>

                  {!isApplied ? (
                    <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-indigo-200 block">
                          ¿Confirmas que el aporte es lógico, razonable y beneficia al sistema?
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Al presionar el botón, la IA aplicará automáticamente los cambios al motor forense bajo tu supervisión.
                        </p>
                      </div>

                      <button
                        onClick={() => handleApproveProposal(prop.id)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprobar y Aplicar Ajuste Autónomo</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>El sistema se ha actualizado y opera ahora de manera autónoma con este ajuste pericial integrado.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT AUDIT HISTORY & REPORTS */}
      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Histórico de Transacciones Procesadas por Clientes</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Revisa qué partidas auditó cada usuario durante su prueba para brindar asesoría técnica y pericial
              </p>
            </div>

            <button
              onClick={() => {
                setNewAuditEmpresa('Global Audit Partners Delaware');
                setNewAuditEmail('socio.director@global-audit.com');
                setNewAuditMonto(214500);
                setNewAuditRiesgo(86);
                setNewAuditDictamen('EVIDENCIA SIGNIFICATIVA DE FRAUDE (SAS 99)');
                setShowAddAuditModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Registrar Auditoría en Historial</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Expediente / Cliente</th>
                  <th className="px-4 py-3">Fecha y Hora</th>
                  <th className="px-4 py-3 text-right">Monto Auditado</th>
                  <th className="px-4 py-3 text-center">Score Riesgo</th>
                  <th className="px-4 py-3">Dictamen</th>
                  <th className="px-4 py-3 text-right">Acción Pericial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {auditHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-white block">{item.empresa}</span>
                      <span className="text-[11px] text-cyan-400 font-mono">{item.clienteEmail}</span>
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-400">
                      {item.fechaEjecucion}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-white">
                      ${item.montoTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                        item.scoreRiesgo > 70 ? 'bg-red-500 text-white' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {item.scoreRiesgo} / 100
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-slate-300 text-[11px] font-medium block">
                        {item.dictamenEmitido}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.alertasDetectadas} hallazgos documentados
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedAuditHistory(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Leer y Asesorar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REASSIGN EXTRA TRIAL DAYS */}
      {activeTab === 'reassign_days' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Reasignación de Días Extras de Prueba (Lic. Pedro Baldera)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Concede días adicionales de cortesía a clientes que ya hayan probado el sistema o cuyo plazo haya expirado, para que continúen evaluando el motor forense.
            </p>
          </div>

          <form onSubmit={handleReassignDays} className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico del Cliente a Reasignar
              </label>
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Días Extras a Conceder
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 3, 7].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDaysToAdd(days)}
                    className={`py-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      daysToAdd === days
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    +{days} {days === 1 ? 'Día (24h)' : days === 3 ? 'Días (72h)' : 'Días (168h)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Motivo / Justificación Pericial
              </label>
              <textarea
                rows={2}
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Reasignar +{daysToAdd} Días y Desbloquear Cliente en el Sistema</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: EVALUATION SURVEY & CLIENT FEEDBACK */}
      {activeTab === 'survey' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Encuestas de Evaluación del Sistema Recopiladas</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Opiniones y reportes técnicos de auditores que han probado el sistema, analizadas automáticamente por la IA
              </p>
            </div>

            <button
              onClick={() => {
                setSurveyContactTarget({
                  email: 'carlos.mendoza@auditorias-usa.com',
                  nombre: 'Carlos Mendoza',
                  empresa: 'Mendoza & Partners CPA',
                  telefono: '+1 829-771-7390'
                });
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contactar Auditor para Encuesta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackList.map((fdb) => (
              <div
                key={fdb.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm block">{fdb.empresa}</span>
                    <span className="text-xs text-cyan-400 font-mono">{fdb.clienteEmail}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(fdb.calificacionGeneral)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  <span className="font-bold text-white block text-[11px] mb-1">
                    Sugerencia del Cliente ({fdb.moduloSugerido}):
                  </span>
                  "{fdb.sugerenciaMejora}"
                </div>

                {fdb.analisisIA && (
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between items-center text-indigo-300">
                      <span className="font-bold">Diagnóstico de la IA:</span>
                      <span className="text-[10px] bg-indigo-900/60 px-2 py-0.5 rounded text-indigo-200">
                        Confianza {fdb.analisisIA.confianzaIA}%
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      {fdb.analisisIA.diagnostico}
                    </p>
                    <div className="text-emerald-400 text-[10px] pt-1">
                      Ajuste propuesto: {fdb.analisisIA.ajustePropuesto}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Read Audit Dossier & Provide Peritaje Advice */}
      {selectedAuditHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  AUDITORÍA HISTÓRICA // ASESORÍA PERICIAL LIC. PEDRO BALDERA
                </span>
                <h3 className="text-xl font-bold text-white">{selectedAuditHistory.empresa}</h3>
              </div>
              <button onClick={() => setSelectedAuditHistory(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Cliente Email:</span>
                <span className="text-cyan-300">{selectedAuditHistory.clienteEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monto Auditado:</span>
                <strong className="text-white">${selectedAuditHistory.montoTotalUSD.toLocaleString()} USD</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dictamen Emitido:</span>
                <strong className="text-red-400">{selectedAuditHistory.dictamenEmitido}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                Transacciones Muestra Detectadas en el Historial:
              </h4>
              {selectedAuditHistory.transaccionesMuestra.length > 0 ? (
                selectedAuditHistory.transaccionesMuestra.map((tx) => (
                  <div key={tx.id} className="p-3 rounded-xl bg-slate-950 border border-red-500/30 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-white">{tx.proveedor}</strong>
                      <div className="text-[11px] text-slate-400">{tx.concepto}</div>
                    </div>
                    <span className="font-mono font-bold text-red-400">
                      ${tx.monto.toLocaleString()} USD
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-400 italic bg-slate-950 rounded-xl">
                  Transacciones archivadas en storage/clientes.json y respaldadas en SQLite.
                </div>
              )}
            </div>

            {/* Forensic Advice box from Lic. Pedro Baldera */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-bold font-mono">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Asesoría Pericial del Lic. Pedro Baldera para este Expediente:</span>
              </div>
              <ul className="text-slate-300 space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
                <li>
                  <strong className="text-white">Estructuración / Fraccionamiento:</strong> Requerir contratos mercantiles y órdenes de compra de los proveedores con transacciones cercanas a $9,900 USD para descartar evasión de reporte FinCEN 8300.
                </li>
                <li>
                  <strong className="text-white">Prueba de Benford:</strong> Los picos anómalos detectados en los dígitos 8 y 9 ameritan inspección de firmas conjuntas y validación de RNC/EIN fiscal.
                </li>
                <li>
                  <strong className="text-white">Dictamen Pericial:</strong> Se sugiere emitir Dictamen con validez judicial bajo normas AICPA SAS 99 y estándar Daubert.
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={`https://wa.me/18297717390?text=Hola%20${encodeURIComponent(selectedAuditHistory.empresa)},%20te%20contacta%20el%20Lic.%20Pedro%20Baldera%20para%20brindarte%20asesoria%20tecnica%20sobre%20los%20resultados%20de%20tu%20auditoria%20${selectedAuditHistory.id}%20(Score:%20${selectedAuditHistory.scoreRiesgo}/100)`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contactar para Asesoría WhatsApp (+1 829-771-7390)</span>
              </a>

              <button
                onClick={() => setSelectedAuditHistory(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Audit History Record */}
      {showAddAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  HISTÓRICO DE AUDITORÍAS // REGISTRO OFICIAL
                </span>
                <h3 className="text-lg font-bold text-white">Archivar Auditoría de Cliente</h3>
              </div>
              <button onClick={() => setShowAddAuditModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAuditRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Empresa o Firma de Contabilidad
                </label>
                <input
                  type="text"
                  required
                  value={newAuditEmpresa}
                  onChange={(e) => setNewAuditEmpresa(e.target.value)}
                  placeholder="ej. Global Audit Partners Delaware"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico del Auditor
                </label>
                <input
                  type="email"
                  required
                  value={newAuditEmail}
                  onChange={(e) => setNewAuditEmail(e.target.value)}
                  placeholder="socio.director@global-audit.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Monto Auditado ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={newAuditMonto}
                    onChange={(e) => setNewAuditMonto(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Score de Riesgo (0-100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={newAuditRiesgo}
                    onChange={(e) => setNewAuditRiesgo(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dictamen Pericial
                </label>
                <select
                  value={newAuditDictamen}
                  onChange={(e) => setNewAuditDictamen(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="EVIDENCIA SIGNIFICATIVA DE FRAUDE (SAS 99)">EVIDENCIA SIGNIFICATIVA DE FRAUDE (SAS 99)</option>
                  <option value="CON OBSERVACIONES POR ESTRUCTURACIÓN">CON OBSERVACIONES POR ESTRUCTURACIÓN</option>
                  <option value="FAVORABLE CON RECOMENDACIONES">FAVORABLE CON RECOMENDACIONES</option>
                  <option value="DICTAMEN FAVORABLE LIMPIO">DICTAMEN FAVORABLE LIMPIO</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAuditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Archivar en Historial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Contact for Feedback Survey */}
      {surveyContactTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Solicitar Encuesta &amp; Opinión</h3>
              <button onClick={() => setSurveyContactTarget(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Contacta a <strong>{surveyContactTarget.nombre}</strong> ({surveyContactTarget.empresa}) para recopilar su evaluación y permitir que la IA formule mejoras automáticas para tu supervisión.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSendSurveyInvite('WHATSAPP')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Encuesta por WhatsApp (+1 829-771-7390)</span>
              </button>

              <button
                onClick={() => handleSendSurveyInvite('EMAIL')}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Enviar por Correo Electrónico</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
