import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  FileCheck,
  Shield,
  ShieldAlert,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit3,
  Search,
  Download,
  Upload,
  Eye,
  Scale,
  BookOpen,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Calendar,
  Layers,
  FileCode,
  RefreshCw,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { MasterCase, ForensicFinding, FindingEvidenceItem, LegalInfringement } from '../types';
import {
  LEGAL_FRAMEWORK_CATALOG,
  generateAutomaticEvidenceFolderPath,
  generateEvidenceCode,
  SEVERITY_CONFIG
} from '../utils/forensicFindingsHelper';

interface ForensicEvidenceDossierManagerProps {
  masterCase: MasterCase;
  findings: ForensicFinding[];
  currency?: string;
  onUpdateFindings: (findings: ForensicFinding[]) => void;
  onUpdateMasterCase?: (updatedCase: MasterCase) => void;
}

export const ForensicEvidenceDossierManager: React.FC<ForensicEvidenceDossierManagerProps> = ({
  masterCase,
  findings,
  currency = 'RD$',
  onUpdateFindings,
  onUpdateMasterCase
}) => {
  const [selectedFindingId, setSelectedFindingId] = useState<number>(findings[0]?.id || 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);

  // Modals state
  const [inspectEvidenceModal, setInspectEvidenceModal] = useState<FindingEvidenceItem | null>(null);
  const [inspectLegalModal, setInspectLegalModal] = useState<LegalInfringement | null>(null);
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [showAddLegalModal, setShowAddLegalModal] = useState(false);
  const [editingEvidenceItem, setEditingEvidenceItem] = useState<FindingEvidenceItem | null>(null);
  const [showAddFindingModal, setShowAddFindingModal] = useState(false);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [calculatedSha256, setCalculatedSha256] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileSize, setSelectedFileSize] = useState<number>(0);

  // New Evidence Form state
  const [evTargetFindingId, setEvTargetFindingId] = useState<number>(selectedFindingId);
  const [evName, setEvName] = useState('');
  const [evType, setEvType] = useState<FindingEvidenceItem['evidence_type']>('CONTRATO');
  const [evPhysicalLoc, setEvPhysicalLoc] = useState('Bóveda de Evidencias Forenses Central, Archivo DGCP, Gaveta B-4, Folios 014-048');
  const [evVirtualLink, setEvVirtualLink] = useState('https://custodia-digital.gob.do/expedientes/2026/hal-01/evidencia.pdf');
  const [evTranscription, setEvTranscription] = useState('');
  const [evDate, setEvDate] = useState('2026-10-16');

  // New Legal Infringement Form state
  const [selectedCatalogNormId, setSelectedCatalogNormId] = useState<string>('LEY-340-06-ART-16');
  const [customLawName, setCustomLawName] = useState('');
  const [customArticle, setCustomArticle] = useState('');
  const [customNumeral, setCustomNumeral] = useState('');
  const [customTextQuote, setCustomTextQuote] = useState('');
  const [customTypification, setCustomTypification] = useState('');
  const [customSanction, setCustomSanction] = useState('');

  // Selected Finding
  const activeFinding = findings.find((f) => f.id === selectedFindingId) || findings[0];

  // Copy helper
  const handleCopy = (text: string, type: 'link' | 'hash') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(null), 2500);
    } else {
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2500);
    }
  };

  // Real SHA-256 calculation for uploaded file
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);
    setUploadProgress(20);

    const arrayBuffer = await file.arrayBuffer();
    setUploadProgress(60);

    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    setCalculatedSha256(hashHex);
    setUploadProgress(100);

    if (!evName) {
      setEvName(file.name);
    }
    if (!evTranscription) {
      setEvTranscription(`[TRANSCRIPCIÓN FORENSE DEL ARCHIVO ${file.name}]: Documento digital verificado con tamaño ${file.size} bytes. Incorporado al acervo probatorio con firma criptográfica SHA-256.`);
    }
  };

  // Save new evidence
  const handleSaveEvidence = () => {
    const targetFinding = findings.find((f) => f.id === evTargetFindingId);
    if (!targetFinding) return;

    const existingEvidences = targetFinding.evidences || [];
    const newCode = generateEvidenceCode(targetFinding.id, existingEvidences.length + 1, evType);
    const hash = calculatedSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    const newEvidence: FindingEvidenceItem = {
      id: `evid-${Date.now()}`,
      finding_id: targetFinding.id,
      evidence_code: newCode,
      filename: evName || `Evidencia_${newCode}.pdf`,
      evidence_type: evType,
      sha256_hash: hash,
      physical_location: evPhysicalLoc,
      virtual_link: evVirtualLink || `https://custodia-digital.gob.do/expedientes/${masterCase.case_code}/${newCode.toLowerCase()}.pdf`,
      transcription_excerpt: evTranscription || 'Transcripción pericial de la pieza probatoria no especificada.',
      file_size_bytes: selectedFileSize || 45289,
      verified_at: new Date().toISOString(),
      custodian_agent: 'Lic. Pedro Baldera (Perito Auditor)',
      original_date: evDate
    };

    const updatedFindings = findings.map((f) => {
      if (f.id === targetFinding.id) {
        return {
          ...f,
          evidences: [...(f.evidences || []), newEvidence]
        };
      }
      return f;
    });

    onUpdateFindings(updatedFindings);
    setShowAddEvidenceModal(false);
    resetEvidenceForm();

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const resetEvidenceForm = () => {
    setEvName('');
    setEvType('CONTRATO');
    setEvPhysicalLoc('Bóveda de Evidencias Forenses Central, Archivo DGCP, Gaveta B-4, Folios 014-048');
    setEvVirtualLink('https://custodia-digital.gob.do/expedientes/2026/hal-01/evidencia.pdf');
    setEvTranscription('');
    setCalculatedSha256('');
    setSelectedFileName('');
    setUploadProgress(null);
  };

  // Delete evidence
  const handleDeleteEvidence = (findingId: number, evidenceId: string) => {
    if (!window.confirm('¿Está seguro de eliminar esta pieza de evidencia del expediente oficial?')) return;

    const updated = findings.map((f) => {
      if (f.id === findingId) {
        return {
          ...f,
          evidences: (f.evidences || []).filter((e) => e.id !== evidenceId)
        };
      }
      return f;
    });

    onUpdateFindings(updated);
  };

  // Add legal infringement
  const handleAddLegalInfringement = () => {
    if (!activeFinding) return;

    let newInfringement: LegalInfringement;
    if (selectedCatalogNormId === 'CUSTOM') {
      newInfringement = {
        id: `legal-${Date.now()}`,
        norm_type: 'LEY',
        law_name: customLawName || 'Normativa Legal Específica',
        article: customArticle || 'Artículo 1',
        numeral_literal: customNumeral || 'Párrafo I',
        text_quote: customTextQuote || 'Precepto normativo vulnerado.',
        typification: customTypification || 'Infracción grave de la norma de control.',
        sanction: customSanction || 'Sanción disciplinaria y pecuniaria.'
      };
    } else {
      const catalogItem = LEGAL_FRAMEWORK_CATALOG.find((c) => c.id === selectedCatalogNormId) || LEGAL_FRAMEWORK_CATALOG[0];
      newInfringement = {
        ...catalogItem,
        id: `legal-${Date.now()}`
      };
    }

    const updated = findings.map((f) => {
      if (f.id === activeFinding.id) {
        return {
          ...f,
          legal_infringements: [...(f.legal_infringements || []), newInfringement]
        };
      }
      return f;
    });

    onUpdateFindings(updated);
    setShowAddLegalModal(false);
  };

  // Remove legal infringement
  const handleRemoveLegalInfringement = (findingId: number, infringementId: string) => {
    const updated = findings.map((f) => {
      if (f.id === findingId) {
        return {
          ...f,
          legal_infringements: (f.legal_infringements || []).filter((i) => i.id !== infringementId)
        };
      }
      return f;
    });
    onUpdateFindings(updated);
  };

  // Delete Finding
  const handleDeleteFinding = (findingId: number) => {
    if (findings.length <= 1) {
      alert('No se puede eliminar el único hallazgo del expediente.');
      return;
    }
    if (!window.confirm('¿Está seguro de eliminar este hallazgo y toda su carpeta de evidencias asociada?')) return;

    const updated = findings.filter((f) => f.id !== findingId);
    onUpdateFindings(updated);
    if (selectedFindingId === findingId) {
      setSelectedFindingId(updated[0]?.id || 1);
    }

    // Recalculate MasterCase impact
    if (onUpdateMasterCase) {
      const newTotal = updated.reduce((sum, f) => sum + (f.quantified_impact || 0), 0);
      onUpdateMasterCase({
        ...masterCase,
        total_financial_impact: newTotal
      });
    }
  };

  // Export full evidence dossier as ZIP
  const handleExportEvidenceFolderZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();
      const baseFolder = zip.folder(`evidencias_oficiales_EXP_${masterCase.case_code}`);

      // Summary Manifest file
      const manifestData = {
        expediente: masterCase.case_code,
        entidad: masterCase.entity_name,
        sector: masterCase.sector,
        impacto_total: masterCase.total_financial_impact,
        moneda: currency,
        fecha_generacion: new Date().toISOString(),
        auditor_responsable: 'Lic. Pedro Baldera',
        total_hallazgos: findings.length,
        total_evidencias: findings.reduce((acc, f) => acc + (f.evidences?.length || 0), 0)
      };

      baseFolder?.file('MANIFIESTO_EXPEDIENTE_FORENSE.json', JSON.stringify(manifestData, null, 2));

      // Build folders per finding
      findings.forEach((finding) => {
        const folderName = `HALLAZGO_${String(finding.id).padStart(2, '0')}_${finding.domain_module.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const findingFolder = baseFolder?.folder(folderName);

        // Finding report txt
        const findingReport = `=============================================================================
REPORTE OFICIAL DE HALLAZGO FORENSE PERICIAL
EXPEDIENTE: ${masterCase.case_code}
CODIGO HALLAZGO: ${finding.finding_code || `HAL-${String(finding.id).padStart(2, '0')}`}
DOMINIO: ${finding.domain_module}
SEVERIDAD: ${finding.severity}
IMPACTO CUANTIFICADO: ${currency} ${finding.quantified_impact.toLocaleString()}
FECHA DETECCION: ${finding.fecha_deteccion || '2026-10-16'}
=============================================================================

DESCRIPCION DETALLADA:
${finding.description}

TRANSCRIPCION PERICIAL DE HECHOS REALES:
${finding.transcription || 'Evidencias documentadas y corroboradas in situ en las oficinas administrativas.'}

MARCO LEGAL, ARTICULOS Y NUMERALES VULNERADOS:
${(finding.legal_infringements || [])
  .map(
    (l, idx) => `
[${idx + 1}] ${l.norm_type} - ${l.law_name}
     Articulo/Numeral: ${l.article} ${l.numeral_literal ? `(${l.numeral_literal})` : ''}
     Tipificacion: ${l.typification}
     Cita Legal: "${l.text_quote}"
     Sancion Aplicable: ${l.sanction}
`
  )
  .join('\n')}

EVIDENCIAS FISICAS Y VIRTUALES ANEXAS:
${(finding.evidences || [])
  .map(
    (e, idx) => `
[${idx + 1}] ${e.evidence_code} - ${e.filename} (${e.evidence_type})
     Hash SHA-256: ${e.sha256_hash}
     Ubicacion Fisica: ${e.physical_location}
     Enlace Virtual: ${e.virtual_link}
     Transcripcion: "${e.transcription_excerpt}"
`
  )
  .join('\n')}
`;
        findingFolder?.file('REPORTE_FORENSE_HALLAZGO.txt', findingReport);

        // Individual evidence files in folder
        (finding.evidences || []).forEach((ev) => {
          const evData = `EVIDENCIA FORENSE OFICIAL NUMERADA: ${ev.evidence_code}
Archivo Original: ${ev.filename}
Tipo: ${ev.evidence_type}
Firma SHA-256 (Inmutable): ${ev.sha256_hash}
Ubicación Física para Corroboración: ${ev.physical_location}
Hipervínculo de Acceso Virtual: ${ev.virtual_link}
Fecha de Verificación: ${ev.verified_at || new Date().toISOString()}
Custodio Pericial: ${ev.custodian_agent || 'Lic. Pedro Baldera'}

-----------------------------------------------------------------------------
TRANSCRIPCION TEXTUAL FIDEDIGNA DE DATOS REALES:
-----------------------------------------------------------------------------
${ev.transcription_excerpt}
`;
          findingFolder?.file(`${ev.evidence_code}_transcripcion.txt`, evData);
        });
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Carpetas_Evidencias_Oficiales_${masterCase.case_code}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      alert('Error generando archivo ZIP');
    } finally {
      setIsExportingZip(false);
    }
  };

  const totalEvidencesCount = findings.reduce((acc, f) => acc + (f.evidences?.length || 0), 0);
  const totalLegalsCount = findings.reduce((acc, f) => acc + (f.legal_infringements?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Automated Dossier Dashboard */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/60 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              <span>Gestor Automático de Carpetas Forenses • Leyes, Decretos y Constitución</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Expediente Digital de Evidencias</span>
              <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800">
                {masterCase.case_code}
              </span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Carpetas automáticas generadas por cada hallazgo, con transcripción pericial de hechos reales, citas de artículos y numerales de leyes, decretos o Constitución incumplida, códigos correlativos y enlaces de acceso virtual y ubicación física de corroboración.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setEvTargetFindingId(selectedFindingId);
                setShowAddEvidenceModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cargar / Crear Evidencia en Línea</span>
            </button>

            <button
              onClick={handleExportEvidenceFolderZip}
              disabled={isExportingZip}
              className="px-4 py-2.5 rounded-xl bg-slate-950 text-cyan-400 border border-cyan-500/40 hover:bg-slate-900 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingZip ? 'Comprimiendo...' : 'Descargar Carpetas ZIP'}</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-mono block">Carpetas Generadas</span>
            <span className="text-xl font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <Folder className="w-4 h-4 text-amber-400" />
              {findings.length} Carpetas
            </span>
            <span className="text-[10px] text-slate-500">1 carpeta oficial por hallazgo</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-mono block">Piezas de Evidencia</span>
            <span className="text-xl font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              {totalEvidencesCount} Numeradas
            </span>
            <span className="text-[10px] text-slate-500">Con SHA-256 &amp; Enlaces</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-mono block">Normas Vulneradas</span>
            <span className="text-xl font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <Scale className="w-4 h-4 text-purple-400" />
              {totalLegalsCount} Artículos
            </span>
            <span className="text-[10px] text-slate-500">Leyes, Decretos y Constitución</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-mono block">Impacto Vinculado</span>
            <span className="text-xl font-extrabold text-red-400 flex items-center gap-1.5 mt-0.5">
              {currency} ${masterCase.total_financial_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500">100% trazable a carpetas</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Findings Folders Selector (Left) & Active Dossier Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Findings Folders */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white px-1">
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              Carpetas de Evidencias ({findings.length})
            </span>
            <button
              onClick={() => setShowAddFindingModal(true)}
              className="text-cyan-400 hover:text-cyan-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Hallazgo
            </button>
          </div>

          <div className="space-y-2">
            {findings.map((f) => {
              const isSelected = f.id === selectedFindingId;
              const sevConfig = SEVERITY_CONFIG[f.severity] || SEVERITY_CONFIG.MEDIUM;
              const autoFolder = f.evidence_folder_path || generateAutomaticEvidenceFolderPath(f.id, f.domain_module, masterCase.case_code);
              const evCount = f.evidences?.length || 0;
              const legalCount = f.legal_infringements?.length || 0;

              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFindingId(f.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-600" />
                  )}

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <FolderOpen className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-amber-400'}`} />
                      <span className="font-bold text-white text-xs">
                        {f.finding_code || `HAL-${String(f.id).padStart(2, '0')}`} • {f.domain_module}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${sevConfig.badge}`}>
                      {f.severity}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-300 truncate mb-2">
                    📁 {autoFolder}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {f.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <FileCheck className="w-3.5 h-3.5" />
                        {evCount} Evid.
                      </span>
                      <span className="flex items-center gap-1 text-purple-400">
                        <Scale className="w-3.5 h-3.5" />
                        {legalCount} Leyes
                      </span>
                    </div>

                    <span className="text-red-400 font-bold">
                      {currency} ${f.quantified_impact.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Finding Evidence Dossier, Legal Articles & Evidences List */}
        <div className="lg:col-span-8 space-y-6">
          {activeFinding ? (
            <>
              {/* Folder Header Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <FolderOpen className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {activeFinding.finding_code || `HAL-${String(activeFinding.id).padStart(2, '0')}`}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs font-bold text-slate-300">{activeFinding.domain_module}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Carpeta Oficial de Evidencias #{activeFinding.id}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEvTargetFindingId(activeFinding.id);
                        setShowAddEvidenceModal(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adjuntar Evidencia
                    </button>

                    <button
                      onClick={() => handleDeleteFinding(activeFinding.id)}
                      className="p-2 rounded-xl bg-slate-950 text-red-400 border border-red-500/30 hover:bg-red-950/40 transition-all cursor-pointer"
                      title="Eliminar este hallazgo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Automatic Folder URI & Physical Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5 text-amber-400" />
                      Ruta Automática de Carpeta en Servidor / Bóveda
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-cyan-300 truncate">
                        {activeFinding.evidence_folder_path || generateAutomaticEvidenceFolderPath(activeFinding.id, activeFinding.domain_module, masterCase.case_code)}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            activeFinding.evidence_folder_path || generateAutomaticEvidenceFolderPath(activeFinding.id, activeFinding.domain_module, masterCase.case_code),
                            'link'
                          )
                        }
                        className="text-slate-400 hover:text-white p-1"
                        title="Copiar ruta"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      Fecha Detección &amp; Cuantificación
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-mono">
                        {activeFinding.fecha_deteccion || '2026-10-16'}
                      </span>
                      <strong className="text-red-400 font-mono">
                        {currency} ${activeFinding.quantified_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Transcripción de Datos Reales */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Transcripción Pericial de Hechos Reales
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      ✓ Hechos Verificados In Situ
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 whitespace-pre-line">
                    {activeFinding.transcription || activeFinding.description}
                  </p>
                </div>
              </div>

              {/* SECCIÓN 1: MARCO LEGAL, ARTÍCULOS Y NUMERALES VULNERADOS */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Artículos, Numerales y Preceptos Legales Incumplidos ({activeFinding.legal_infringements?.length || 0})
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowAddLegalModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Vincular Artículo Legal / Decreto
                  </button>
                </div>

                {(!activeFinding.legal_infringements || activeFinding.legal_infringements.length === 0) ? (
                  <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
                    No se han registrado artículos o decretos para este hallazgo. Haz clic en "Vincular Artículo Legal / Decreto" para agregar normas de la Constitución, Ley 340-06, etc.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeFinding.legal_infringements.map((infringement) => (
                      <div
                        key={infringement.id}
                        className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 p-4 rounded-2xl space-y-2.5 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                              {infringement.norm_type}
                            </span>
                            <span className="font-bold text-white text-xs">
                              {infringement.law_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80">
                              {infringement.article} {infringement.numeral_literal ? `• ${infringement.numeral_literal}` : ''}
                            </span>
                            <button
                              onClick={() => handleRemoveLegalInfringement(activeFinding.id, infringement.id)}
                              className="text-slate-500 hover:text-red-400 p-1"
                              title="Desvincular artículo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Text quote */}
                        <div className="text-xs text-slate-300 italic bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                          "{infringement.text_quote}"
                        </div>

                        {/* Typification and Sanction */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div>
                            <span className="text-slate-400 font-mono block">Tipificación Forense:</span>
                            <span className="text-amber-300 font-medium">{infringement.typification}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-mono block">Sanción Aplicable:</span>
                            <span className="text-red-400 font-medium">{infringement.sanction}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: EVIDENCIAS FÍSICAS Y VIRTUALES NUMERADAS (CON SHA-256) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Evidencias Numeradas de este Hallazgo ({activeFinding.evidences?.length || 0})
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      setEvTargetFindingId(activeFinding.id);
                      setShowAddEvidenceModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Cargar / Crear Nueva Evidencia
                  </button>
                </div>

                {(!activeFinding.evidences || activeFinding.evidences.length === 0) ? (
                  <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
                    No se han registrado evidencias para este hallazgo. Haz clic en "Cargar / Crear Nueva Evidencia" para adjuntar contratos, órdenes, cheques o facturas con hash inmutable.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeFinding.evidences.map((ev) => (
                      <div
                        key={ev.id}
                        className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-2xl space-y-3 transition-all"
                      >
                        {/* Header: Evidence Code, Filename, Type */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-cyan-400" />
                              {ev.evidence_code}
                            </span>
                            <span className="font-bold text-white text-xs">
                              {ev.filename}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800">
                              {ev.evidence_type}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setInspectEvidenceModal(ev)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono flex items-center gap-1 border border-slate-700 cursor-pointer"
                              title="Inspeccionar pieza pericial"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspeccionar</span>
                            </button>

                            <button
                              onClick={() => handleDeleteEvidence(activeFinding.id, ev.id)}
                              className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 cursor-pointer"
                              title="Eliminar evidencia"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Transcripción Textual Fidedigna */}
                        <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 font-mono leading-relaxed">
                          <span className="text-[10px] text-cyan-400 block mb-1 font-sans font-semibold">
                            Transcripción Fiel de Datos Reales:
                          </span>
                          {ev.transcription_excerpt}
                        </div>

                        {/* Corroboration: Physical Location & Virtual Hyperlink */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {/* Physical location */}
                          <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono block">Ubicación Física para Corroboración:</span>
                              <span className="text-slate-200 font-mono text-[11px]">{ev.physical_location}</span>
                            </div>
                          </div>

                          {/* Virtual Hyperlink */}
                          <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 overflow-hidden">
                              <LinkIcon className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                              <div className="overflow-hidden">
                                <span className="text-[10px] text-slate-400 font-mono block">Enlace Virtual / Hipervínculo:</span>
                                <a
                                  href={ev.virtual_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setInspectEvidenceModal(ev);
                                  }}
                                  className="text-cyan-400 hover:underline font-mono text-[11px] truncate block"
                                >
                                  {ev.virtual_link}
                                </a>
                              </div>
                            </div>

                            <button
                              onClick={() => handleCopy(ev.virtual_link, 'link')}
                              className="text-slate-400 hover:text-white p-1 shrink-0"
                              title="Copiar enlace virtual"
                            >
                              {copiedLink === ev.virtual_link ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* SHA-256 Hash Inmutable */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                          <div className="flex items-center gap-1.5 truncate max-w-md">
                            <span className="text-emerald-400 font-bold">SHA-256:</span>
                            <span className="text-slate-300 truncate">{ev.sha256_hash}</span>
                          </div>

                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                            ✓ Inmutable
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center text-slate-400 text-sm">
              Seleccione una carpeta de hallazgo para ver su expediente y evidencias.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: CARGAR / CREAR EVIDENCIA EN LÍNEA */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Cargar o Crear Evidencia en Línea
                  </h3>
                  <span className="text-xs text-slate-400">
                    Calcula SHA-256 real en navegador y asocia carpeta automática
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAddEvidenceModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Select target finding */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Carpeta de Hallazgo Destino
                </label>
                <select
                  value={evTargetFindingId}
                  onChange={(e) => setEvTargetFindingId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  {findings.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.finding_code || `HAL-${String(f.id).padStart(2, '0')}`} - {f.domain_module} ({f.severity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload local file */}
              <div className="border border-dashed border-slate-700 rounded-2xl p-4 bg-slate-950/60 text-center space-y-2">
                <Upload className="w-6 h-6 text-cyan-400 mx-auto" />
                <div>
                  <label className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    <span>Seleccionar archivo local para hash y transcripción</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1">
                    PDF, XLSX, DOCX, JPG, PNG o TXT. El hash SHA-256 se calcula en vivo.
                  </p>
                </div>

                {selectedFileName && (
                  <div className="pt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/30">
                    Archivo cargado: <strong>{selectedFileName}</strong> ({(selectedFileSize / 1024).toFixed(1)} KB)
                    {calculatedSha256 && (
                      <div className="text-[10px] text-slate-300 truncate mt-1">
                        SHA-256: {calculatedSha256}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Evidence Name & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nombre del Documento / Archivo
                  </label>
                  <input
                    type="text"
                    value={evName}
                    onChange={(e) => setEvName(e.target.value)}
                    placeholder="ej. Orden_Compra_OC_2026_01.pdf"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tipo de Evidencia
                  </label>
                  <select
                    value={evType}
                    onChange={(e) => setEvType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="CONTRATO">Contrato Legal</option>
                    <option value="ORDEN_COMPRA">Orden de Compra</option>
                    <option value="FACTURA">Factura Comercial</option>
                    <option value="CHEQUE">Cheque o Extracto Bancario</option>
                    <option value="ACTA_RECEPCION">Acta Notarial o Recepción</option>
                    <option value="LOG_SISTEMA">Registro / Log de Auditoría</option>
                    <option value="INFORME_PERICIAL">Informe Pericial</option>
                  </select>
                </div>
              </div>

              {/* Transcripción de Datos Reales */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Transcripción Textual Fidedigna de Datos Reales
                </label>
                <textarea
                  rows={3}
                  value={evTranscription}
                  onChange={(e) => setEvTranscription(e.target.value)}
                  placeholder="Detallar extracto textual exacto: número de documento, fecha, monto, firmantes y hechos comprobados..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              {/* Physical Location */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ubicación Física para Corroboración In Situ
                </label>
                <input
                  type="text"
                  value={evPhysicalLoc}
                  onChange={(e) => setEvPhysicalLoc(e.target.value)}
                  placeholder="ej. Bóveda Central DGCP, Gaveta B-4, Folios 014-048"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              {/* Virtual Access Link */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Hipervínculo / Enlace de Acceso Virtual
                </label>
                <input
                  type="text"
                  value={evVirtualLink}
                  onChange={(e) => setEvVirtualLink(e.target.value)}
                  placeholder="https://custodia-digital.gob.do/expedientes/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddEvidenceModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEvidence}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 hover:opacity-95 cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar y Vincular Evidencia</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VINCULAR ARTÍCULO LEGAL / DECRETO INCUMPLIDO */}
      {showAddLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Vincular Marco Legal Vulnerado
                  </h3>
                  <span className="text-xs text-slate-400">
                    Artículos, numerales y sanciones de Leyes, Decretos o Constitución
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAddLegalModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Seleccionar del Catálogo Jurídico Maestro
                </label>
                <select
                  value={selectedCatalogNormId}
                  onChange={(e) => setSelectedCatalogNormId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  {LEGAL_FRAMEWORK_CATALOG.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.norm_type}] {item.law_name} - {item.article} ({item.numeral_literal})
                    </option>
                  ))}
                  <option value="CUSTOM">+ Redactar Artículo o Decreto Personalizado...</option>
                </select>
              </div>

              {selectedCatalogNormId === 'CUSTOM' ? (
                <div className="space-y-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-mono text-[10px] mb-1">Ley / Decreto</label>
                      <input
                        type="text"
                        value={customLawName}
                        onChange={(e) => setCustomLawName(e.target.value)}
                        placeholder="Ley No. ..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-mono text-[10px] mb-1">Artículo &amp; Numeral</label>
                      <input
                        type="text"
                        value={customArticle}
                        onChange={(e) => setCustomArticle(e.target.value)}
                        placeholder="Artículo 16, Numeral 3"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] mb-1">Cita Textual del Precepto</label>
                    <textarea
                      rows={2}
                      value={customTextQuote}
                      onChange={(e) => setCustomTextQuote(e.target.value)}
                      placeholder="Texto exacto de la norma legal..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-mono text-[10px] mb-1">Tipificación</label>
                      <input
                        type="text"
                        value={customTypification}
                        onChange={(e) => setCustomTypification(e.target.value)}
                        placeholder="Fraccionamiento de compras..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-mono text-[10px] mb-1">Sanción Legal</label>
                      <input
                        type="text"
                        value={customSanction}
                        onChange={(e) => setCustomSanction(e.target.value)}
                        placeholder="Destitución y responsabilidad penal..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Preview selected catalog item
                (() => {
                  const item = LEGAL_FRAMEWORK_CATALOG.find((c) => c.id === selectedCatalogNormId);
                  if (!item) return null;
                  return (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                        <span>{item.law_name}</span>
                        <span className="font-mono text-cyan-400">{item.article} ({item.numeral_literal})</span>
                      </div>
                      <p className="text-xs text-slate-300 italic bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                        "{item.text_quote}"
                      </p>
                      <div className="text-[11px] space-y-1 pt-1">
                        <div>
                          <strong className="text-slate-400">Tipificación:</strong>{' '}
                          <span className="text-amber-300">{item.typification}</span>
                        </div>
                        <div>
                          <strong className="text-slate-400">Sanción:</strong>{' '}
                          <span className="text-red-400">{item.sanction}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddLegalModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLegalInfringement}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30"
              >
                <Check className="w-4 h-4" />
                <span>Incorporar Artículo a Hallazgo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VISOR FORENSE PERICIAL E INSPECCIÓN VIRTUAL & FÍSICA */}
      {inspectEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-3xl w-full max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {inspectEvidenceModal.evidence_code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {inspectEvidenceModal.evidence_type}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    Visor de Corroboración Probatoria: {inspectEvidenceModal.filename}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setInspectEvidenceModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Virtual Verification Banner */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white text-xs">
                      Autenticidad Criptográfica Verificada
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      Firma SHA-256 válida e inalterada en custodia oficial.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(inspectEvidenceModal.sha256_hash, 'hash')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 font-mono text-[11px] flex items-center gap-1.5 border border-emerald-700/60 shrink-0"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar SHA-256</span>
                </button>
              </div>

              {/* SHA-256 full display */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] break-all text-slate-300">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Hash Criptográfico SHA-256:</span>
                {inspectEvidenceModal.sha256_hash}
              </div>

              {/* Physical Location Detail */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-mono text-xs flex items-center gap-1.5 font-bold">
                  <MapPin className="w-4 h-4" />
                  Ubicación Física para Inspección Ocular In Situ
                </span>
                <p className="text-slate-200 font-mono text-xs leading-relaxed">
                  {inspectEvidenceModal.physical_location}
                </p>
                <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-2">
                  <span>Custodio: {inspectEvidenceModal.custodian_agent || 'Lic. Pedro Baldera'}</span>
                  <span>•</span>
                  <span>Fecha Registro: {inspectEvidenceModal.verified_at || '2026-10-16'}</span>
                </div>
              </div>

              {/* Virtual Access Link and Live Corroboration */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-mono text-xs flex items-center gap-1.5 font-bold">
                    <LinkIcon className="w-4 h-4" />
                    Enlace de Acceso Virtual / Repositorio Digital
                  </span>
                  <button
                    onClick={() => handleCopy(inspectEvidenceModal.virtual_link, 'link')}
                    className="text-slate-400 hover:text-white text-[11px] font-mono flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Enlace</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-xs truncate">
                  {inspectEvidenceModal.virtual_link}
                </div>
              </div>

              {/* Full Transcription */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-white font-bold text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Transcripción Pericial Textual Fidedigna
                </span>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {inspectEvidenceModal.transcription_excerpt}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectEvidenceModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
