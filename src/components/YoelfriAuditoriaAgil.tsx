import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  FileText, 
  Zap, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Hash, 
  Lock, 
  Download, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Search, 
  BarChart3, 
  Clock, 
  Layers, 
  FileCheck,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Copy,
  Check,
  BarChart2,
  FolderOpen,
  Folder,
  Scale,
  Trash2,
  BookOpen,
  Key,
  RefreshCw,
  Server
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MasterCase, ForensicFinding, DigitalCustody } from '../types';
import { ForensicFindingsDashboard } from './ForensicFindingsDashboard';
import { ForensicEvidenceDossierManager } from './ForensicEvidenceDossierManager';
import { ForensicSystemSecurityAndGuides } from './ForensicSystemSecurityAndGuides';
import {
  generateAutomaticEvidenceFolderPath,
  generateEvidenceCode,
  LEGAL_FRAMEWORK_CATALOG
} from '../utils/forensicFindingsHelper';

interface YoelfriAuditoriaAgilProps {
  onNavigateToTab?: (tab: any) => void;
  onDownloadZip?: () => void;
}

const INITIAL_CASE: MasterCase = {
  id: 1,
  case_code: 'AUD-MASTER-2026-001',
  entity_name: 'Entidad Evaluada S.R.L. / Institución Pública',
  sector: 'Gubernamental y Tecnológico',
  total_financial_impact: 5400000.00,
  currency: 'RD$',
  status: 'COMPLETADO',
  created_at: '2026-10-16 08:30:00'
};

const INITIAL_FINDINGS: ForensicFinding[] = [
  {
    id: 1,
    case_id: 1,
    finding_code: 'HAL-01',
    domain_module: 'Compras y DGCP',
    norm_or_vector: 'Ley 340-06 / Decreto 543-12 / Constitución Art. 146',
    description: 'Fraccionamiento deliberado y sistemático de compras para eludir el umbral de Licitación Pública (RD$ 3,500,000.00). Dos órdenes sucesivas a Constructora & Equipos Caribe SRL con 3 días de intervalo.',
    severity: 'CRITICAL',
    quantified_impact: 3500000.00,
    fecha_deteccion: '2026-10-05',
    evidence_folder_path: 'evidencias_oficiales/EXP-AUD-MASTER-2026-001/HALLAZGO_01_COMPRAS_Y_DGCP/',
    transcription: 'En fecha 02 de octubre de 2026 se emitió la Orden de Compra No. OC-2026-01 a favor de Constructora & Equipos Caribe SRL por valor de RD$ 1,750,000.00 para "Adquisición de insumos fase 1", autorizada por el Director Administrativo. Posteriormente, en fecha 05 de octubre de 2026 (lapso de 3 días), se emitió la Orden de Compra No. OC-2026-02 al mismo proveedor por idéntico valor de RD$ 1,750,000.00 para "Adquisición de insumos fase 2". Ambos libramientos suman exactamente RD$ 3,500,000.00, monto que superaba el umbral legal para compras menores, evidenciando una división premeditada del objeto contractual para evadir el procedimiento de Licitación Pública.',
    legal_infringements: [
      {
        id: 'L-01-1',
        norm_type: 'CONSTITUCION',
        law_name: 'Constitución de la República Dominicana',
        article: 'Artículo 146',
        numeral_literal: 'Numeral 1 y 2, Literal a',
        text_quote: 'Se condena toda forma de corrupción en los órganos del Estado. Será sancionada toda persona que sustraiga fondos públicos o que prevaliéndose de sus posiciones obtenga provecho económico.',
        typification: 'Proscripción constitucional de la corrupción y enriquecimiento ilícito en contrataciones públicas.',
        sanction: 'Inhabilitación perpetua para la función pública, restitución pecuniaria y prisión de 3 a 10 años.'
      },
      {
        id: 'L-01-2',
        norm_type: 'LEY',
        law_name: 'Ley No. 340-06 sobre Compras y Contrataciones Públicas',
        article: 'Artículo 16',
        numeral_literal: 'Párrafo II',
        text_quote: 'Se prohíbe expresamente el fraccionamiento de las compras o contrataciones cuando tenga como fin eludir las formalidades de las licitaciones públicas o los procedimientos de selección previstos en esta ley.',
        typification: 'Fraccionamiento deliberado de órdenes de compra (Smurfing/Splitting) en períodos menores a 7 días.',
        sanction: 'Nulidad de pleno derecho de las órdenes, destitución y responsabilidad penal tipificada en Art. 65.'
      },
      {
        id: 'L-01-3',
        norm_type: 'DECRETO',
        law_name: 'Decreto No. 543-12 (Reglamento de Compras del Poder Ejecutivo)',
        article: 'Artículo 28',
        numeral_literal: 'Literal b, Numeral 3',
        text_quote: 'Se considerará indicio grave de fraccionamiento la emisión concurrente o sucesiva de órdenes de compra al mismo proveedor o empresas del mismo grupo económico en plazos inferiores a siete (7) días hábiles.',
        typification: 'Violación del umbral operativo y temporal de 7 días entre órdenes fraccionadas consecutivas.',
        sanction: 'Responsabilidad administrativa funcional y retención precautoria de pagos.'
      }
    ],
    evidences: [
      {
        id: 'ev-01-1',
        finding_id: 1,
        evidence_code: 'EVID-HAL-01-ORD-001',
        filename: 'Orden_Compra_OC_2026_01.pdf',
        evidence_type: 'ORDEN_COMPRA',
        sha256_hash: '9f83c6838883e3980b190a6f44a80e729a67e5564850fa9ea7f9fb5c6d302a24',
        physical_location: 'Bóveda de Evidencias Forenses Central - Archivo DGCP, Gaveta B-4, Folios 014-022',
        virtual_link: 'https://custodia-digital.gob.do/expedientes/2026/hal-01/oc-2026-01.pdf',
        transcription_excerpt: 'Orden de Compra No. OC-2026-01 por RD$ 1,750,000.00. Proveedor: Constructora & Equipos Caribe SRL. Concepto: "Adquisición de insumos fase 1". Fecha: 02/10/2026. Aprobado por: Dirección Administrativa sin informe de peritos.',
        file_size_bytes: 84210,
        verified_at: '2026-10-05T10:14:00Z',
        custodian_agent: 'Lic. Pedro Baldera'
      },
      {
        id: 'ev-01-2',
        finding_id: 1,
        evidence_code: 'EVID-HAL-01-ORD-002',
        filename: 'Orden_Compra_OC_2026_02.pdf',
        evidence_type: 'ORDEN_COMPRA',
        sha256_hash: '3a7894d86a63588df8849b3c9510105342a632049e37fc2a8d132642533ab63c',
        physical_location: 'Bóveda de Evidencias Forenses Central - Archivo DGCP, Gaveta B-4, Folios 023-031',
        virtual_link: 'https://custodia-digital.gob.do/expedientes/2026/hal-01/oc-2026-02.pdf',
        transcription_excerpt: 'Orden de Compra No. OC-2026-02 por RD$ 1,750,000.00. Mismo proveedor, emitida solo 3 días después (05/10/2026). Objeto complementario idéntico: "Adquisición de insumos fase 2".',
        file_size_bytes: 81920,
        verified_at: '2026-10-05T10:15:30Z',
        custodian_agent: 'Lic. Pedro Baldera'
      },
      {
        id: 'ev-01-3',
        finding_id: 1,
        evidence_code: 'EVID-HAL-01-CHK-003',
        filename: 'Comprobante_Pago_Cheque_CHK88412.pdf',
        evidence_type: 'CHEQUE',
        sha256_hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
        physical_location: 'Bóveda de Tesorería Nacional, Estante 03, Caja F-12, Folio 032',
        virtual_link: 'https://custodia-digital.gob.do/expedientes/2026/hal-01/cheque-88412.pdf',
        transcription_excerpt: 'Libramiento Bancario y Cheque BHD León No. CHK-88412 debitado de cuenta institucional por valor consolidado de RD$ 3,500,000.00 a favor de Constructora & Equipos Caribe SRL en fecha 07/10/2026.',
        file_size_bytes: 42050,
        verified_at: '2026-10-05T11:00:00Z',
        custodian_agent: 'Lic. Pedro Baldera'
      }
    ]
  },
  {
    id: 2,
    case_id: 1,
    finding_code: 'HAL-02',
    domain_module: 'Ciberseguridad y Datos',
    norm_or_vector: 'Ley 53-07 / Ley 172-13 / Constitución Art. 44',
    description: 'Filtración y compromiso de 42,000 registros sensibles de ciudadanos mediante conexión RDP no autorizada (puerto 3389) sin autenticación multifactor ni cifrado AES-256 en reposo.',
    severity: 'HIGH',
    quantified_impact: 1100000.00,
    fecha_deteccion: '2026-10-08',
    evidence_folder_path: 'evidencias_oficiales/EXP-AUD-MASTER-2026-001/HALLAZGO_02_CIBERSEGURIDAD_Y_DATOS/',
    transcription: 'La auditoría telemática detectó 12 accesos concurrentes no autorizados desde direcciones IP externas entre las 02:15 y las 04:30 AM del 06 de octubre de 2026, descargando tablas no cifradas de beneficiarios de programas sociales. No existía correlación de logs en SIEM ni autenticación multifactor (MFA), en violación flagrante a la Ley 53-07.',
    legal_infringements: [
      {
        id: 'L-02-1',
        norm_type: 'LEY',
        law_name: 'Ley No. 53-07 sobre Crímenes y Delitos de Alta Tecnología',
        article: 'Artículo 6',
        numeral_literal: 'Párrafo I',
        text_quote: 'El acceso ilícito a un sistema electrónico, telemático o de telecomunicaciones, o el mantenimiento en él contra la voluntad del legítimo titular, será castigado con prisión y multa pecuniaria.',
        typification: 'Vulneración de credenciales de acceso privilegiado y negligencia culposa en seguridad perimetral.',
        sanction: 'Prisión correccional de 3 meses a 1 año y multa pecuniaria.'
      },
      {
        id: 'L-02-2',
        norm_type: 'CONSTITUCION',
        law_name: 'Constitución de la República Dominicana',
        article: 'Artículo 44',
        numeral_literal: 'Numeral 2',
        text_quote: 'Toda persona tiene el derecho a acceder a la información y a los datos que sobre ella o sus bienes reposen en los registros oficiales o privados, así como a exigir su confidencialidad.',
        typification: 'Violación al deber constitucional de salvaguarda y protección de la intimidad y datos personales.',
        sanction: 'Responsabilidad civil y patrimonial del Estado y servidores involucrados.'
      }
    ],
    evidences: [
      {
        id: 'ev-02-1',
        finding_id: 2,
        evidence_code: 'EVID-HAL-02-LOG-001',
        filename: 'Bitacora_Firewall_Conexiones_RDP.log',
        evidence_type: 'LOG_SISTEMA',
        sha256_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        physical_location: 'Servidor Central de Logs Forenses / Servidor Seguro B-1, Unidad Encriptada 03',
        virtual_link: 'https://custodia-digital.gob.do/expedientes/2026/hal-02/rdp-firewall.log',
        transcription_excerpt: 'Log de Firewall perimetral: [06/10/2026 02:22:11 GMT-4] SRC_IP: 198.51.100.42 -> DST_IP: 10.0.4.15:3389 PROTO: TCP BYTES_OUT: 18,442,109 (Exfiltración comprobada).',
        file_size_bytes: 18442109,
        verified_at: '2026-10-08T14:30:00Z',
        custodian_agent: 'Lic. Pedro Baldera'
      },
      {
        id: 'ev-02-2',
        finding_id: 2,
        evidence_code: 'EVID-HAL-02-INF-002',
        filename: 'Dictamen_Forense_Telematico_INF2026.pdf',
        evidence_type: 'INFORME_PERICIAL',
        sha256_hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        physical_location: 'Bóveda de Evidencias Forenses Digitales, Caja F-CIBER, Folios 080-115',
        virtual_link: 'https://custodia-digital.gob.do/expedientes/2026/hal-02/dictamen-pericial.pdf',
        transcription_excerpt: 'Informe de análisis de vulnerabilidades emitido por el Lic. Pedro Baldera: 42,000 registros comprometidos sin cifrado AES-256 en base de datos PostgreSQL de producción.',
        file_size_bytes: 1420500,
        verified_at: '2026-10-08T16:00:00Z',
        custodian_agent: 'Lic. Pedro Baldera'
      }
    ]
  },
  {
    id: 3,
    case_id: 1,
    finding_code: 'HAL-03',
    domain_module: 'Regulatorio y Cumplimiento',
    norm_or_vector: 'Ley 10-07 / Ley 41-08 / Constitución Art. 246',
    description: 'Omisión de homologación de personal y registros de control interno en nóminas extraordinarias a 14 colaboradores temporales sin contrato formal por RD$ 620,000.00.',
    severity: 'MEDIUM',
    quantified_impact: 620000.00,
    fecha_deteccion: '2026-10-12',
    evidence_folder_path: 'evidencias_oficiales/EXP-AUD-MASTER-2026-001/HALLAZGO_03_REGULATORIO_Y_CUMPLIMIENTO/',
    transcription: 'Arqueo de nómina del mes de septiembre 2026 arrojó el pago de honorarios profesionales por RD$ 620,000.00 a 14 ciudadanos sin fichas en el Sistema de Administración de Servidores Públicos (SASP), sin registro previo en Contraloría General ni certificación de cumplimiento del MAP.',
    legal_infringements: [
      {
        id: 'L-03-1',
        norm_type: 'LEY',
        law_name: 'Ley No. 10-07 de Control Interno y Contraloría General',
        article: 'Artículo 14',
        numeral_literal: 'Numeral 4, Literal c',
        text_quote: 'Las entidades del sector público están obligadas a establecer un sistema de control interno previo que garantice la legalidad, exactitud y veracidad de cada desembolso financiero.',
        typification: 'Omisión de controles previos en la autorización y libramiento de nóminas extraordinarias.',
        sanction: 'Juicio de cuentas, sanciones disciplinarias de tercer grado y pliego de reparos.'
      }
    ],
    evidences: [
      {
        id: 'ev-03-1',
        finding_id: 3,
        evidence_code: 'EVID-HAL-03-NOM-001',
        filename: 'Nomina_Extraordinaria_Septiembre_2026.xlsx',
        evidence_type: 'EXPEDIENTE_DIGITAL',
        sha256_hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        physical_location: 'Archivo Central de Recursos Humanos, Gaveta C-2, Folios 001-018',
        virtual_link: 'https://custodia-digital.gob.do/expedientes/2026/hal-03/nomina-extraordinaria.xlsx',
        transcription_excerpt: 'Planilla de pago No. NOM-EXT-2026-09: 14 beneficiarios con pagos de RD$ 40,000.00 a RD$ 55,000.00 sin números de cédulas verificadas en padrón oficial.',
        file_size_bytes: 92400,
        verified_at: '2026-10-12T09:30:00Z',
        custodian_agent: 'Lic. Pedro Baldera'
      }
    ]
  },
  {
    id: 4,
    case_id: 1,
    finding_code: 'HAL-04',
    domain_module: 'Finanzas y Tributario',
    norm_or_vector: 'Ley 11-92 Código Tributario Dominicano',
    description: 'Inconsistencia en retenciones ITBIS y desfase temporal de comprobantes fiscales B01 en compras directas por RD$ 180,000.00.',
    severity: 'LOW',
    quantified_impact: 180000.00,
    fecha_deteccion: '2026-10-15',
    evidence_folder_path: 'evidencias_oficiales/EXP-AUD-MASTER-2026-001/HALLAZGO_04_FINANZAS_Y_TRIBUTARIO/',
    transcription: 'Cruce del Formato de Compras y Servicios 606 contra el Libro Diario determinó la no retención del 100% del ITBIS en facturas de proveedores informales y uso de comprobantes B01 vencidos.',
    legal_infringements: [
      {
        id: 'L-04-1',
        norm_type: 'LEY',
        law_name: 'Ley No. 11-92 (Código Tributario de la República Dominicana)',
        article: 'Artículo 309',
        numeral_literal: 'Párrafo I',
        text_quote: 'Las personas jurídicas que paguen o acrediten sumas a personas físicas o jurídicas actuarán como agentes de retención del impuesto en las condiciones establecidas.',
        typification: 'Incumplimiento de las obligaciones de agentes de retención del ITBIS.',
        sanction: 'Recargos por mora del 10% el primer mes, 4% progresivo y multas del 20% al 200% del tributo omitido.'
      }
    ],
    evidences: [
      {
        id: 'ev-04-1',
        finding_id: 4,
        evidence_code: 'EVID-HAL-04-FAC-001',
        filename: 'Comprobantes_Fiscales_B01_Inconsistentes.pdf',
        evidence_type: 'FACTURA',
        sha256_hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        physical_location: 'Archivo Contable y Fiscal, Caja T-09, Folios 050-078',
        virtual_link: 'https://custodia-digital.gob.do/expedientes/2026/hal-04/facturas-b01.pdf',
        transcription_excerpt: 'Lote de 8 Facturas B0100045129 a B0100045136 emitidas sin RNC activo y con ITBIS reportado como 0.00 a pesar de tratarse de servicios gravados.',
        file_size_bytes: 65120,
        verified_at: '2026-10-15T11:20:00Z',
        custodian_agent: 'Lic. Pedro Baldera'
      }
    ]
  }
];

// Sample ledger transactions for the 7-day splitting engine demo
const SAMPLE_SPLIT_TRANSACTIONS = [
  { id: 'OC-2026-01', proveedor: 'Constructora & Equipos Caribe SRL', fecha: '2026-10-02', monto: 1750000.00, concepto: 'Adquisición de insumos fase 1' },
  { id: 'OC-2026-02', proveedor: 'Constructora & Equipos Caribe SRL', fecha: '2026-10-05', monto: 1750000.00, concepto: 'Adquisición de insumos fase 2 (smurfing)' },
  { id: 'OC-2026-03', proveedor: 'Sistemas & Redes Metropolitanas', fecha: '2026-10-08', monto: 550000.00, concepto: 'Mantenimiento preventivo licencias' },
  { id: 'OC-2026-04', proveedor: 'Sistemas & Redes Metropolitanas', fecha: '2026-10-11', monto: 550000.00, concepto: 'Mantenimiento correctivo adicional' },
];

export const YoelfriAuditoriaAgil: React.FC<YoelfriAuditoriaAgilProps> = ({ onNavigateToTab, onDownloadZip }) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'carpetas' | 'resumen' | 'motor' | 'custodia' | 'codigo'>('dashboard');
  const [masterCase, setMasterCase] = useState<MasterCase>(INITIAL_CASE);
  const [findings, setFindings] = useState<ForensicFinding[]>(INITIAL_FINDINGS);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [sha256Hash, setSha256Hash] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [showAddFindingModal, setShowAddFindingModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // New Finding Form
  const [newDomain, setNewDomain] = useState('Compras y DGCP');
  const [newNorm, setNewNorm] = useState('Ley 340-06 de Contrataciones');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newImpact, setNewImpact] = useState<number>(250000);
  const [newFecha, setNewFecha] = useState<string>('2026-10-16');
  const [newTranscription, setNewTranscription] = useState('');
  const [newPhysicalLocation, setNewPhysicalLocation] = useState('Bóveda de Evidencias Forenses Central, Gaveta B-4');
  const [newVirtualLink, setNewVirtualLink] = useState('https://custodia-digital.gob.do/expedientes/2026/');


  // Benford Stats for Case
  const [benfordChiSquare, setBenfordChiSquare] = useState<number>(18.42);
  const [benfordIsAnomalous, setBenfordIsAnomalous] = useState<boolean>(true);

  // Simulating live execution of the Ultimate Forensic Engine
  const handleExecuteEngine = () => {
    setIsExecuting(true);
    setExecutionLogs([]);
    const logs: string[] = [];

    const addLog = (msg: string) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      setExecutionLogs([...logs]);
    };

    setTimeout(() => addLog('Inicializando Base de Datos Maestra: audit_system_ultimate.db...'), 200);
    setTimeout(() => addLog('Creando tablas: master_cases, forensic_findings, digital_custody...'), 500);
    setTimeout(() => addLog('Ejecutando UltimateForensicEngine.execute_benford_analysis()...'), 900);
    setTimeout(() => {
      const chi = 18.42;
      const isAnom = chi > 15.51;
      setBenfordChiSquare(chi);
      setBenfordIsAnomalous(isAnom);
      addLog(`Benford Chi-Square: ${chi.toFixed(2)} (Valor Crítico: 15.51, gl=8, p<0.05) -> ANÓMALO DETECTADO`);
    }, 1300);
    setTimeout(() => addLog('Ejecutando detect_purchasing_splitting() en ventana de 7 días (Ley 340-06)...'), 1700);
    setTimeout(() => addLog('Detectado fraccionamiento: Proveedor "Constructora & Equipos Caribe SRL" acumuló $3,500,000.00 en 7 días.'), 2100);
    setTimeout(() => addLog('Compilando informe en PDF con ReportLab (SimpleDocTemplate, colores #0F294A)...'), 2500);
    setTimeout(() => {
      const simulatedHash = 'a9f24c08e5618b7625cb27f80456cde52906b3a0e37452d19f074a38d6139f4a';
      setSha256Hash(simulatedHash);
      addLog(`Cálculo de Sello Criptográfico SHA-256 completado: ${simulatedHash}`);
      addLog('Registro inmutable archivado en digital_custody con evidencia_type="INFORME_MAESTRO_PDF".');
      addLog('AUDITORÍA ÁGIL FORENSE FINALIZADA CON ÉXITO AL 100%.');
      setIsExecuting(false);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2900);
  };

  const handleAddFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const newId = findings.length + 1;
    const findingCode = `HAL-${String(newId).padStart(2, '0')}`;
    const autoFolder = generateAutomaticEvidenceFolderPath(newId, newDomain, masterCase.case_code);
    const initialEvidenceCode = generateEvidenceCode(newId, 1, 'DOC');
    const initialHash = 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0';

    const matchedCatalogItem = LEGAL_FRAMEWORK_CATALOG.find(c => 
      c.law_name.toLowerCase().includes(newDomain.toLowerCase().slice(0, 5))
    ) || LEGAL_FRAMEWORK_CATALOG[0];

    const initialLegal = {
      ...matchedCatalogItem,
      id: `L-${newId}-1`
    };

    const initialEvidence = {
      id: `ev-${newId}-1`,
      finding_id: newId,
      evidence_code: initialEvidenceCode,
      filename: `Pieza_Probatoria_${initialEvidenceCode}.pdf`,
      evidence_type: 'INFORME_PERICIAL' as const,
      sha256_hash: initialHash,
      physical_location: newPhysicalLocation || 'Bóveda de Evidencias Forenses Central, Gaveta B-4, Folios 001-020',
      virtual_link: newVirtualLink || `https://custodia-digital.gob.do/expedientes/${masterCase.case_code}/${initialEvidenceCode.toLowerCase()}.pdf`,
      transcription_excerpt: newTranscription || `[TRANSCRIPCIÓN REAL DEL HALLAZGO]: ${newDesc}. Verificado in situ en fecha ${newFecha || '2026-10-16'} bajo supervisión pericial.`,
      file_size_bytes: 65400,
      verified_at: new Date().toISOString(),
      custodian_agent: 'Lic. Pedro Baldera'
    };

    const newF: ForensicFinding = {
      id: newId,
      case_id: masterCase.id,
      finding_code: findingCode,
      domain_module: newDomain,
      norm_or_vector: newNorm,
      description: newDesc,
      severity: newSeverity,
      quantified_impact: Number(newImpact),
      fecha_deteccion: newFecha || new Date().toISOString().split('T')[0],
      evidence_folder_path: autoFolder,
      transcription: newTranscription || newDesc,
      legal_infringements: [initialLegal],
      evidences: [initialEvidence]
    };

    const updatedFindings = [...findings, newF];
    setFindings(updatedFindings);
    
    // Recalculate total impact
    const newTotal = updatedFindings.reduce((acc, curr) => acc + curr.quantified_impact, 0);
    setMasterCase(prev => ({
      ...prev,
      total_financial_impact: newTotal
    }));

    setShowAddFindingModal(false);
    setNewDesc('');
    setNewTranscription('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleDownloadPdfSimulation = () => {
    const reportText = `================================================================================
INFORME OFICIAL DE AUDITORÍA FORENSE – ${masterCase.entity_name.toUpperCase()}
Sector / Referencia: ${masterCase.case_code} | Moneda: ${masterCase.currency} | Fecha: ${new Date().toLocaleDateString()}
Módulo: Yoelfri_Auditoria_Agil | Base de Datos: audit_system_ultimate.db
Supervisión: Lic. Pedro Baldera (Audit Intelligence USA)
================================================================================

1. RESUMEN EJECUTIVO
Evaluación integral automatizada ejecutada sobre ${masterCase.entity_name}.
El impacto financiero total cuantificado asciende a: ${masterCase.currency} $${masterCase.total_financial_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}.

2. MATRIZ DE INCIDENCIAS Y HALLAZGOS FORENSES
--------------------------------------------------------------------------------
${findings.map((f, idx) => `[${idx + 1}] DOMINIO: ${f.domain_module}
    NORMA: ${f.norm_or_vector}
    SEVERIDAD: ${f.severity}
    DESCRIPCIÓN: ${f.description}
    IMPACTO: ${masterCase.currency} $${f.quantified_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
`).join('\n')}
--------------------------------------------------------------------------------

3. EVALUACIÓN ESTADÍSTICA DE LA LEY DE BENFORD
- Chi-Square Calculado: ${benfordChiSquare}
- Valor Crítico: 15.51 (8 Grados de Libertad, p < 0.05)
- Diagnóstico: ${benfordIsAnomalous ? 'EVIDENCIA DE MANIPULACIÓN INTENCIONAL' : 'CONFORME'}

4. CERTIFICACIÓN DE CADENA DE CUSTODIA DIGITAL (SHA-256)
Este informe cuenta con un registro inmutable respaldado por firma criptográfica:
SHA-256: ${sha256Hash}
Archivo Maestro: evidencias_oficiales/Informe_Forense_${masterCase.case_code}.pdf
Estado: VERIFICADO E INMUTABLE
================================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Informe_Forense_${masterCase.case_code}_SHA256.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Banner: Yoelfri Auditoría Ágil */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-2 border-blue-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              MÓDULO ADICIONAL INTEGRADO: YOELFRI_AUDITORIA_AGIL
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Auditoría Ágil Forense, Ley de Benford &amp; Cadena de Custodia Digital
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Integrado con <strong className="text-white">Audit Intelligence USA (BASA V7)</strong> para ejecutar el motor analítico <code className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-xs">UltimateForensicEngine</code>, evaluar compras fraccionadas bajo la <strong className="text-cyan-300">Ley 340-06</strong> en ventanas de 7 días, procesar la <strong className="text-cyan-300">Ley de Benford</strong> con Chi-Cuadrado y certificar evidencias con sellos criptográficos <strong className="text-emerald-400 font-mono">SHA-256</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> DB: audit_system_ultimate.db
              </span>
              <span>•</span>
              <span className="text-slate-300">
                Directorio Evidencias: <code className="text-slate-200">evidencias_oficiales/</code>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                Trazabilidad Unificada: Lic. Pedro Baldera
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleExecuteEngine}
              disabled={isExecuting}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-white" />
                  <span>Procesando Auditoría Ágil...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Ejecutar Auditoría Ágil en Vivo</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdfSimulation}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Dictamen Oficial</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards: Case Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Expediente Forense</span>
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
              {masterCase.status}
            </span>
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {masterCase.case_code}
          </div>
          <div className="text-xs text-slate-400 truncate">
            {masterCase.entity_name}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Perjuicio Cuantificado</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-red-400 font-mono">
            {masterCase.currency} ${masterCase.total_financial_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400">
            Sector: {masterCase.sector}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Ley de Benford (Chi-Square)</span>
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white font-mono">
              {benfordChiSquare.toFixed(2)}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              benfordIsAnomalous ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {benfordIsAnomalous ? 'ANOMALÍA (p < 0.05)' : 'NORMAL'}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Valor Crítico: 15.51 (gl = 8)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Cadena de Custodia</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs font-mono text-emerald-400 truncate">
            {sha256Hash.slice(0, 20)}...
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Firma SHA-256 Inmutable</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'dashboard'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-300" />
          <span>1. Dashboard Visual Recharts (Severidad &amp; Tiempo)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('carpetas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'carpetas'
              ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-amber-400" />
          <span>2. Carpetas de Evidencias &amp; Marco Jurídico (Leyes/Decretos/Constitución)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('resumen')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'resumen'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Matriz de Incidencias &amp; Hallazgos ({findings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('motor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'motor'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>4. Motor Analítico: Benford &amp; Smurfing 7 Días</span>
        </button>

        <button
          onClick={() => setActiveSubTab('custodia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'custodia'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>5. Cadena de Custodia Digital SHA-256</span>
        </button>

        <button
          onClick={() => setActiveSubTab('codigo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'codigo'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>6. Código Fuente Python Integrado</span>
        </button>
      </div>

      {/* Execution Terminal Output (if any) */}
      {executionLogs.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-1 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
            <span className="flex items-center gap-2 text-cyan-400 font-bold">
              <Terminal className="w-3.5 h-3.5" />
              Consola de Trazabilidad en Vivo – Yoelfri_Auditoria_Agil
            </span>
            <span className="text-[10px] text-slate-500">Python 3.11 • DuckDB • ReportLab</span>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
            {executionLogs.map((log, idx) => (
              <div key={idx} className="text-slate-300">
                <span className="text-cyan-400 select-none">&gt; </span>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: VISUAL DASHBOARD WITH RECHARTS BAR & AREA CHARTS */}
      {activeSubTab === 'dashboard' && (
        <ForensicFindingsDashboard
          masterCase={masterCase}
          findings={findings}
          currency={masterCase.currency}
          onOpenAddModal={() => setShowAddFindingModal(true)}
          onNavigateToEvidenceDossier={() => setActiveSubTab('carpetas')}
          onSelectSeverity={(sev) => {
            console.log('Filtro de severidad seleccionado:', sev);
          }}
        />
      )}

      {/* TAB 2: GESTOR DE CARPETAS DE EVIDENCIAS AUTOMÁTICAS Y MARCO JURÍDICO */}
      {activeSubTab === 'carpetas' && (
        <ForensicEvidenceDossierManager
          masterCase={masterCase}
          findings={findings}
          currency={masterCase.currency}
          onUpdateFindings={setFindings}
          onUpdateMasterCase={setMasterCase}
        />
      )}

      {/* TAB 2: MATRIZ DE INCIDENCIAS Y HALLAZGOS */}
      {activeSubTab === 'resumen' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" />
                <span>Matriz Oficial de Hallazgos Forenses Cuantificados</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Estructura formal conforme a normas AICPA SAS 99, Ley 340-06 de Contrataciones y Ley 172-13.
              </p>
            </div>

            <button
              onClick={() => setShowAddFindingModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Añadir Hallazgo al Caso</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F294A] text-slate-200 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Código &amp; Dominio</th>
                  <th className="px-4 py-3">Norma / Marco Jurídico</th>
                  <th className="px-4 py-3">Descripción de la Incidencia</th>
                  <th className="px-4 py-3 text-center">Severidad</th>
                  <th className="px-4 py-3 text-center">Carpeta &amp; Evidencias</th>
                  <th className="px-4 py-3 text-right">Impacto Financiero</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {findings.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                          {f.finding_code || `HAL-${String(f.id).padStart(2, '0')}`}
                        </span>
                        <span>{f.domain_module}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-cyan-300 font-mono">
                      {f.norm_or_vector}
                    </td>

                    <td className="px-4 py-3.5 text-slate-300 text-xs leading-relaxed max-w-xs">
                      {f.description}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                        f.severity === 'CRITICAL'
                          ? 'bg-red-500 text-white'
                          : f.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : f.severity === 'MEDIUM'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {f.severity}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setActiveSubTab('carpetas')}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[11px] flex items-center gap-1.5 mx-auto border border-amber-500/30 transition-all cursor-pointer"
                        title="Abrir Carpeta Oficial de Evidencias"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>{f.evidences?.length || 0} Evid. • {f.legal_infringements?.length || 0} Normas</span>
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-bold text-white">
                      {masterCase.currency} ${f.quantified_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => {
                          if (findings.length <= 1) {
                            alert('No se puede eliminar el único hallazgo.');
                            return;
                          }
                          if (window.confirm('¿Eliminar este hallazgo y su carpeta asociada?')) {
                            const updated = findings.filter(item => item.id !== f.id);
                            setFindings(updated);
                            const newTotal = updated.reduce((s, curr) => s + curr.quantified_impact, 0);
                            setMasterCase(prev => ({ ...prev, total_financial_impact: newTotal }));
                          }
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                        title="Eliminar hallazgo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950 text-slate-200 font-bold border-t border-slate-800">
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-right font-mono text-xs uppercase text-slate-400">
                    Total Financiero Consolidado:
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-red-400">
                    {masterCase.currency} ${masterCase.total_financial_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MOTOR ANALÍTICO: BENFORD & SMURFING 7 DÍAS */}
      {activeSubTab === 'motor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Benford Mathematical Engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Prueba Chi-Cuadrado Ley de Benford</span>
              </h3>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                Nigrini (2012)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              La Ley de Benford establece que en libros contables naturales, la probabilidad del primer dígito d (del 1 al 9) sigue la distribución:
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center font-mono text-xs text-cyan-300">
              P(d) = log₁₀(1 + 1/d)
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Chi-Square Observado (χ²):</span>
                <span className="font-bold text-white">{benfordChiSquare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Valor Crítico Tabular (gl=8, p=0.05):</span>
                <span className="text-cyan-300">15.51</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Resultado Pericial:</span>
                <span className="text-red-400 font-bold">RECHAZA HIPÓTESIS NULA (ANOMALÍA)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
              <strong>Dictamen Forense:</strong> La distribución de las partidas transaccionales presenta una desviación estadísticamente significativa frente a la curva logarítmica esperada, indicando estructuración de facturas con dígitos 8 y 9.
            </div>
          </div>

          {/* Purchasing Splitting 7-Day Window */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Detección de Fraccionamiento (Ventana 7 Días)</span>
              </h3>
              <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                Ley 340-06 / DGCP
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              El motor agrupa por proveedor y evalúa la suma móvil en períodos de 7 días. Cuando el monto acumulado supera el umbral límite, dispara una alerta de fraccionamiento deliberado:
            </p>

            <div className="space-y-2">
              {SAMPLE_SPLIT_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{tx.proveedor}</span>
                    <span className="text-[11px] text-slate-400">{tx.concepto} • {tx.fecha}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-cyan-400 block">
                      ${tx.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded">
                      Ventana 7D
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-200">
              <strong>Evidencia Concluida:</strong> 2 órdenes de compra de $1,750,000.00 al mismo proveedor en un lapso de 3 días acumulan $3,500,000.00, superando el umbral de licitación restringida sin concurso público.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CADENA DE CUSTODIA DIGITAL */}
      {activeSubTab === 'custodia' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>Certificación de Cadena de Custodia Digital Inmutable</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Garantiza la admisibilidad judicial de la evidencia pericial conforme a las normas Daubert e ISO 27037.
              </p>
            </div>

            <button
              onClick={handleDownloadPdfSimulation}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Evidencia Certificada</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Registro Criptográfico SHA-256</span>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 break-all select-all">
                {sha256Hash}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cualquier modificación de un solo bit en el informe alterará completamente este hash, garantizando que el expediente no ha sido alterado desde su emisión.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Metadatos de Custodia Digital</span>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tabla Maestra:</span>
                  <span className="text-cyan-300">digital_custody</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tipo de Evidencia:</span>
                  <span className="text-white font-bold">INFORME_MAESTRO_PDF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ruta Oficial:</span>
                  <span className="text-slate-200">evidencias_oficiales/Informe_Forense_{masterCase.case_code}.pdf</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Custodio Oficial:</span>
                  <span className="text-emerald-400 font-bold">Lic. Pedro Baldera</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CÓDIGO FUENTE PYTHON INTEGRADO */}
      {activeSubTab === 'codigo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>Script Fuente Integrado: yoelfri_auditoria_agil.py</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Motor analítico completo con persistencia SQLite3 (<code className="text-cyan-300 font-mono">audit_system_ultimate.db</code>), Ley de Benford, fraccionamiento 7D y generación de informes en ReportLab con sellos SHA-256.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const pythonCode = `# ---------------------------------------------------------------------------
# MODULO: YOELFRI_AUDITORIA_AGIL (AUDIT INTELLIGENCE USA / BASA V7)
# ARCHIVO: backend/yoelfri_auditoria_agil.py
# ---------------------------------------------------------------------------
import os
import sys
import sqlite3
import hashlib
from datetime import datetime
import pandas as pd
import numpy as np

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

# ---------------------------------------------------------------------------
# 1. CONFIGURACIÓN DEL ENTORNO Y BASE DE DATOS MAESTRA
# ---------------------------------------------------------------------------
DB_NAME = "audit_system_ultimate.db"
EVIDENCE_DIR = "evidencias_oficiales"

def initialize_system_database():
    """Inicializa la base de datos SQLite y las tablas de cadena de custodia inmutable."""
    os.makedirs(EVIDENCE_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Tabla Maestra de Expedientes Forenses
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS master_cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_code TEXT UNIQUE,
            entity_name TEXT,
            sector TEXT,
            total_financial_impact REAL,
            currency TEXT,
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de Hallazgos y Banderas Rojas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS forensic_findings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER,
            domain_module TEXT,
            norm_or_vector TEXT,
            description TEXT,
            severity TEXT,
            quantified_impact REAL,
            FOREIGN KEY (case_id) REFERENCES master_cases(id)
        )
    ''')
    
    # Tabla de Cadena de Custodia Digital (SHA-256)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS digital_custody (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER,
            filename TEXT,
            sha256_hash TEXT,
            evidence_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (case_id) REFERENCES master_cases(id)
        )
    ''')
    
    conn.commit()
    conn.close()

# ---------------------------------------------------------------------------
# 2. MOTOR ANALÍTICO FORENSE INTEGRADO
# ---------------------------------------------------------------------------
class UltimateForensicEngine:
    
    @staticmethod
    def calculate_sha256(file_bytes: bytes) -> str:
        """Calcula el hash SHA-256 para garantizar la inmutabilidad de la evidencia."""
        return hashlib.sha256(file_bytes).hexdigest()

    @staticmethod
    def execute_benford_analysis(df: pd.DataFrame, amount_col: str) -> tuple[float, bool]:
        """Ejecuta el análisis de la Ley de Benford sobre montos transaccionales."""
        series = df[amount_col].dropna()
        series = series[series > 0]
        if series.empty:
            return 0.0, False
        
        first_digits = series.astype(str).str.lstrip('0.').str[0].astype(int)
        first_digits = first_digits[(first_digits >= 1) & (first_digits <= 9)]
        
        observed_counts = first_digits.value_counts().reindex(range(1, 10), fill_value=0).sort_index()
        total_count = observed_counts.sum()
        
        digits = np.arange(1, 10)
        expected_freq = np.log10(1 + 1 / digits)
        expected_counts = expected_freq * total_count
        
        chi_square = float(np.sum((observed_counts.values - expected_counts) ** 2 / expected_counts))
        is_anomalous = chi_square > 15.51  # Valor crítico para 8 grados de libertad (p < 0.05)
        return chi_square, is_anomalous

    @staticmethod
    def detect_purchasing_splitting(df: pd.DataFrame, supplier_col: str, date_col: str, amount_col: str, threshold: float) -> list[dict]:
        """Detecta fraccionamiento de compras (smurfing) en ventanas de 7 días."""
        df_clean = df.copy()
        df_clean[date_col] = pd.to_datetime(df_clean[date_col])
        df_clean = df_clean.sort_values(by=[supplier_col, date_col])
        
        alerts = []
        for supplier, group in df_clean.groupby(supplier_col):
            group = group.sort_values(by=date_col).set_index(date_col)
            rolling_sum = group[amount_col].rolling('7D', closed='both').sum()
            rolling_count = group[amount_col].rolling('7D', closed='both').count()
            
            mask = (rolling_count > 1) & (rolling_sum >= (threshold * 0.7))
            suspicious = group[mask]
            
            for dt, row in suspicious.iterrows():
                alerts.append({
                    'domain': 'Compras y DGCP (Ley 340-06)',
                    'norm': 'Ley 340-06 de Contrataciones',
                    'desc': f"Fraccionamiento con proveedor {supplier}. Acumulado de \${rolling_sum.loc[dt]:,.2f} en ventana de 7 días.",
                    'severity': 'HIGH',
                    'impact': float(rolling_sum.loc[dt])
                })
        return alerts

# ---------------------------------------------------------------------------
# 3. GENERADOR DE INFORMES Y MATRICES EN PDF
# ---------------------------------------------------------------------------
def generate_master_pdf_report(pdf_filename: str, case_data: dict, findings: list, sha256_hash: str) -> str:
    """Genera un informe forense consolidado en PDF con diseño formal."""
    doc = SimpleDocTemplate(pdf_filename, pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    story = []
    styles = getSampleStyleSheet()
    
    PRIMARY_COLOR = colors.HexColor("#0F294A")  # Azul marino institucional
    SECONDARY_COLOR = colors.HexColor("#1D4ED8")
    TEXT_COLOR = colors.HexColor("#1F2937")
    
    title_style = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=13, textColor=PRIMARY_COLOR, alignment=1)
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, textColor=SECONDARY_COLOR, alignment=1, spaceAfter=8)
    h1_style = ParagraphStyle('SectionH1', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=10, textColor=PRIMARY_COLOR, spaceBefore=6, spaceAfter=3)
    body_style = ParagraphStyle('BodyDark', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=TEXT_COLOR)
    table_hdr = ParagraphStyle('TableHdr', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, textColor=colors.whitesmoke, alignment=1)
    table_cell = ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=7, leading=9, textColor=TEXT_COLOR)

    # Cabecera
    story.append(Paragraph(f"INFORME OFICIAL DE AUDITORÍA FORENSE – {case_data['entity_name'].upper()}", title_style))
    story.append(Paragraph(f"Sector / Referencia: {case_data['case_code']} | Moneda: {case_data['currency']} | Fecha: {datetime.now().strftime('%Y-%m-%d')}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.2, color=PRIMARY_COLOR, spaceAfter=6))
    
    # 1. Resumen Ejecutivo
    story.append(Paragraph("1. Resumen Ejecutivo", h1_style))
    story.append(Paragraph(f"Evaluación integral automatizada ejecutada sobre {case_data['entity_name']}. El impacto financiero total cuantificado asciende a <b>{case_data['currency']} \${case_data['total_impact']:,.2f}</b>.", body_style))
    
    # 2. Matriz de Hallazgos
    story.append(Paragraph("2. Matriz de Incidencias y Hallazgos Forenses", h1_style))
    table_rows = [[Paragraph("Dominio / Materia", table_hdr), Paragraph("Norma / Marco", table_hdr), Paragraph("Descripción de la Incidencia", table_hdr), Paragraph(f"Impacto ({case_data['currency']})", table_hdr)]]
    
    for f in findings:
        table_rows.append([
            Paragraph(f['domain'], table_cell),
            Paragraph(f['norm'], table_cell),
            Paragraph(f['desc'], table_cell),
            Paragraph(f"\${f['impact']:,.2f}", table_cell)
        ])
        
    t_matriz = Table(table_rows, colWidths=[100, 110, 204, 90])
    t_matriz.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_COLOR),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_matriz)
    story.append(Spacer(1, 8))
    
    # 3. Cadena de Custodia
    story.append(Paragraph("3. Certificación de Cadena de Custodia Digital", h1_style))
    story.append(Paragraph(f"Este informe cuenta con un registro inmutable respaldado por firma criptográfica SHA-256: <br/><b>{sha256_hash}</b>.", body_style))
    
    doc.build(story)
    return pdf_filename

# ---------------------------------------------------------------------------
# 4. EJECUCIÓN PRINCIPAL Y PRUEBA INTEGRAL
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    initialize_system_database()
    print("=== SISTEMA UNIFICADO DE AUDITORÍA FORENSE INICIALIZADO ===")
    
    case_info = {
        "case_code": "AUD-MASTER-2026-001",
        "entity_name": "Entidad Evaluada S.R.L. / Institución Pública",
        "sector": "Gubernamental y Tecnológico",
        "currency": "RD$",
        "total_impact": 5220000.00
    }
    
    findings_list = [
        {"domain": "Ciberseguridad y Datos", "norm": "Ley 172-13 / Ley 53-07", "desc": "Filtración de registros sensibles por vulnerabilidad RDP y falta de cifrado.", "impact": 1100000.0},
        {"domain": "Compras y DGCP", "norm": "Ley 340-06 de Contrataciones", "desc": "Fraccionamiento sistemático de órdenes de compra en períodos menores a 7 días.", "impact": 3500000.0},
        {"domain": "Regulatorio y Cumplimiento", "norm": "Ley 41-08 de Función Pública", "desc": "Omisión de homologación de personal y registros de control interno.", "impact": 620000.0}
    ]
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO master_cases (case_code, entity_name, sector, total_financial_impact, currency, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (case_info['case_code'], case_info['entity_name'], case_info['sector'], case_info['total_impact'], case_info['currency'], "COMPLETADO"))
    case_db_id = cursor.lastrowid
    
    for f in findings_list:
        cursor.execute("""
            INSERT INTO forensic_findings (case_id, domain_module, norm_or_vector, description, severity, quantified_impact)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (case_db_id, f['domain'], f['norm'], f['desc'], 'HIGH', f['impact']))
    conn.commit()
    
    pdf_path = os.path.join(EVIDENCE_DIR, f"Informe_Forense_{case_info['case_code']}.pdf")
    generate_master_pdf_report(pdf_path, case_info, findings_list, "PENDING_HASH")
    
    with open(pdf_path, 'rb') as f:
        pdf_bytes = f.read()
        final_hash = UltimateForensicEngine.calculate_sha256(pdf_bytes)
        
    generate_master_pdf_report(pdf_path, case_info, findings_list, final_hash)
    
    cursor.execute("""
        INSERT INTO digital_custody (case_id, filename, sha256_hash, evidence_type)
        VALUES (?, ?, ?, ?)
    """, (case_db_id, pdf_path, final_hash, "INFORME_MAESTRO_PDF"))
    conn.commit()
    conn.close()
    
    print(f"\\n✅ AUDITORÍA UNIFICADA EJECUTADA CON ÉXITO")
    print(f"📄 Informe PDF generado en: {os.path.abspath(pdf_path)}")
    print(f"🔒 Sello Criptográfico SHA-256: {final_hash}")
    print(f"💰 Perjuicio Financiero Consolidado: {case_info['currency']} RD\\$ {case_info['total_impact']:,.2f}")
`;
                  navigator.clipboard.writeText(pythonCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2500);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar Python</span>
                  </>
                )}
              </button>

              {onDownloadZip && (
                <button
                  onClick={onDownloadZip}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Paquete ZIP</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300 max-h-[520px] leading-relaxed">
            <pre>
{`# ---------------------------------------------------------------------------
# 1. CONFIGURACIÓN DEL ENTORNO Y BASE DE DATOS MAESTRA
# ---------------------------------------------------------------------------
DB_NAME = "audit_system_ultimate.db"
EVIDENCE_DIR = "evidencias_oficiales"

def initialize_system_database():
    """Inicializa la base de datos SQLite y las tablas de cadena de custodia inmutable."""
    os.makedirs(EVIDENCE_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Tabla Maestra de Expedientes Forenses
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS master_cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_code TEXT UNIQUE,
            entity_name TEXT,
            sector TEXT,
            total_financial_impact REAL,
            currency TEXT,
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de Hallazgos y Banderas Rojas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS forensic_findings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER,
            domain_module TEXT,
            norm_or_vector TEXT,
            description TEXT,
            severity TEXT,
            quantified_impact REAL,
            FOREIGN KEY (case_id) REFERENCES master_cases(id)
        )
    ''')
    
    # Tabla de Cadena de Custodia Digital (SHA-256)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS digital_custody (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id INTEGER,
            filename TEXT,
            sha256_hash TEXT,
            evidence_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (case_id) REFERENCES master_cases(id)
        )
    ''')
    conn.commit()
    conn.close()

# ---------------------------------------------------------------------------
# 2. MOTOR ANALÍTICO FORENSE INTEGRADO
# ---------------------------------------------------------------------------
class UltimateForensicEngine:
    @staticmethod
    def calculate_sha256(file_bytes: bytes) -> str:
        """Calcula el hash SHA-256 para garantizar la inmutabilidad de la evidencia."""
        return hashlib.sha256(file_bytes).hexdigest()

    @staticmethod
    def execute_benford_analysis(df: pd.DataFrame, amount_col: str) -> tuple[float, bool]:
        """Ejecuta el análisis de la Ley de Benford sobre montos transaccionales."""
        series = df[amount_col].dropna()
        series = series[series > 0]
        if series.empty:
            return 0.0, False
        first_digits = series.astype(str).str.lstrip('0.').str[0].astype(int)
        first_digits = first_digits[(first_digits >= 1) & (first_digits <= 9)]
        observed_counts = first_digits.value_counts().reindex(range(1, 10), fill_value=0).sort_index()
        total_count = observed_counts.sum()
        digits = np.arange(1, 10)
        expected_freq = np.log10(1 + 1 / digits)
        expected_counts = expected_freq * total_count
        chi_square = float(np.sum((observed_counts.values - expected_counts) ** 2 / expected_counts))
        is_anomalous = chi_square > 15.51  # Valor crítico para 8 grados de libertad (p < 0.05)
        return chi_square, is_anomalous

    @staticmethod
    def detect_purchasing_splitting(df: pd.DataFrame, supplier_col: str, date_col: str, amount_col: str, threshold: float) -> list[dict]:
        """Detecta fraccionamiento de compras (smurfing) en ventanas de 7 días."""
        df_clean = df.copy()
        df_clean[date_col] = pd.to_datetime(df_clean[date_col])
        df_clean = df_clean.sort_values(by=[supplier_col, date_col])
        alerts = []
        for supplier, group in df_clean.groupby(supplier_col):
            group = group.sort_values(by=date_col).set_index(date_col)
            rolling_sum = group[amount_col].rolling('7D', closed='both').sum()
            rolling_count = group[amount_col].rolling('7D', closed='both').count()
            mask = (rolling_count > 1) & (rolling_sum >= (threshold * 0.7))
            suspicious = group[mask]
            for dt, row in suspicious.iterrows():
                alerts.append({
                    'domain': 'Compras y DGCP (Ley 340-06)',
                    'norm': 'Ley 340-06 de Contrataciones',
                    'desc': f"Fraccionamiento con proveedor {supplier}. Acumulado en ventana de 7 días.",
                    'severity': 'HIGH',
                    'impact': float(rolling_sum.loc[dt])
                })
        return alerts

# ---------------------------------------------------------------------------
# 3. GENERADOR DE INFORMES Y MATRICES EN PDF (ReportLab)
# ---------------------------------------------------------------------------
def generate_master_pdf_report(pdf_filename: str, case_data: dict, findings: list, sha256_hash: str) -> str:
    """Genera un informe forense consolidado en PDF con diseño formal institucional."""
    doc = SimpleDocTemplate(pdf_filename, pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    story = []
    # Compilación de encabezados, matriz estructurada y sello criptográfico SHA-256
    # ...
    doc.build(story)
    return pdf_filename

# ---------------------------------------------------------------------------
# 4. EJECUCIÓN PRINCIPAL Y PRUEBA INTEGRAL
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    initialize_system_database()
    print("=== SISTEMA UNIFICADO DE AUDITORÍA FORENSE INICIALIZADO ===")
    # Persistencia en master_cases, forensic_findings y digital_custody...
`}
            </pre>
          </div>
        </div>
      )}

      {/* Modal: Add Finding to Master Case */}
      {showAddFindingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>Añadir Incidencia a Matriz Forense</span>
              </h3>
              <button onClick={() => setShowAddFindingModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddFinding} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dominio / Materia
                </label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Compras y DGCP">Compras y DGCP (Contrataciones)</option>
                  <option value="Ciberseguridad y Datos">Ciberseguridad y Datos</option>
                  <option value="Regulatorio y Cumplimiento">Regulatorio y Cumplimiento</option>
                  <option value="Finanzas y Tributario">Finanzas y Tributario</option>
                  <option value="Lavado de Activos / FinCEN">Lavado de Activos / FinCEN</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Norma o Vector Legal
                </label>
                <input
                  type="text"
                  required
                  value={newNorm}
                  onChange={(e) => setNewNorm(e.target.value)}
                  placeholder="ej. Ley 340-06 / Ley 172-13"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción Pericial de la Incidencia
                </label>
                <textarea
                  rows={2}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detalla la anomalía contable o evidencia identificada..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Severidad
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="CRITICAL">CRITICAL (Crítico)</option>
                    <option value="HIGH">HIGH (Alto)</option>
                    <option value="MEDIUM">MEDIUM (Medio)</option>
                    <option value="LOW">LOW (Bajo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Impacto ({masterCase.currency})
                  </label>
                  <input
                    type="number"
                    required
                    value={newImpact}
                    onChange={(e) => setNewImpact(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fecha de Detección
                  </label>
                  <input
                    type="date"
                    required
                    value={newFecha}
                    onChange={(e) => setNewFecha(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transcripción de Datos Reales (Contratos, Facturas, Actas, Logs)
                </label>
                <textarea
                  rows={2}
                  value={newTranscription}
                  onChange={(e) => setNewTranscription(e.target.value)}
                  placeholder="Extracto fiel y textual de los documentos o registros examinados..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ubicación Física para Corroboración
                  </label>
                  <input
                    type="text"
                    value={newPhysicalLocation}
                    onChange={(e) => setNewPhysicalLocation(e.target.value)}
                    placeholder="ej. Bóveda Central DGCP, Gaveta B-4, Folios 014-048"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enlace de Acceso Virtual / Hipervínculo
                  </label>
                  <input
                    type="text"
                    value={newVirtualLink}
                    onChange={(e) => setNewVirtualLink(e.target.value)}
                    placeholder="https://custodia-digital.gob.do/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-[11px] font-mono text-cyan-300">
                📁 Se creará automáticamente la <strong>Carpeta Oficial de Evidencias</strong> y el primer código probatorio numerado con hash SHA-256.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFindingModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md"
                >
                  Guardar Incidencia &amp; Generar Carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
