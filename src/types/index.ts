export interface UserTrial {
  id: string;
  email: string;
  empresa: string;
  fechaRegistro: string; // ISO string
  diasTranscurridos: number;
  estadoPago: boolean;
  tipoLicencia: 'trial' | 'pro' | 'enterprise';
  tokenAcceso: string;
  pais: string;
}

export interface ForensicTransaction {
  id: string;
  fecha: string;
  proveedor: string;
  concepto: string;
  monto: number;
  categoria: string;
  cuentaContable: string;
  esFinDeSemana: boolean;
  esMontoEstructurado: boolean; // Just below threshold (e.g. $4,990 or $9,850)
  esDuplicadoSospechoso: boolean;
  scoreRiesgo: number; // 0 - 100
  nivelAlerta: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
}

export interface BenfordDigitStat {
  digit: number;
  esperado: number; // Percentage
  observado: number; // Percentage
  desviacion: number;
  esAnomalo: boolean;
}

export interface AuditReportSummary {
  totalTransacciones: number;
  montoTotalAuditado: number;
  montoEnRiesgo: number;
  transaccionesSospechosas: number;
  violacionesBenford: number;
  pagosDuplicados: number;
  pagosEstructurados: number;
  movimientosFinDeSemana: number;
  scoreRiesgoGlobal: number; // 0 - 100
  dictamenForense: 'FAVORABLE_SIN_SALVEDADES' | 'CON_OBSERVACIONES_SIGNIFICATIVAS' | 'EVIDENCIA_DE_FRAUDE';
}

export interface DeploymentFile {
  name: string;
  path: string;
  description: string;
  content: string;
  language: string;
}

export interface TrialSignup {
  id: string;
  email: string;
  nombreAuditor: string;
  empresa: string;
  pais: string;
  fechaRegistro: string;
  diasTranscurridos: number;
  horasRestantes: number;
  estado: 'ACTIVO' | 'EXPIRADO' | 'CONVERTIDO_PRO';
  estadoPago: boolean;
  ultimoAcceso: string;
  ipOrigen?: string;
  planInteres: 'PRO' | 'ENTERPRISE' | 'BASIC';
  diasReasignadosExtras?: number;
  telefono?: string;
}

export interface VideoTutorial {
  id: string;
  modulo: string;
  titulo: string;
  duracion: string;
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado';
  resumen: string;
  pasos: {
    paso: number;
    titulo: string;
    descripcion: string;
    pantallaAccion: string;
    tipForense: string;
  }[];
  videoSimuladoUrl?: string;
}

export interface ClientAuditHistory {
  id: string;
  clienteEmail: string;
  empresa: string;
  fechaEjecucion: string;
  totalTransacciones: number;
  montoTotalUSD: number;
  scoreRiesgo: number;
  alertasDetectadas: number;
  dictamenEmitido: string;
  estado: 'FINALIZADO' | 'EN_REVISION' | 'ASESORIA_REQUERIDA';
  transaccionesMuestra: ForensicTransaction[];
}

export interface ClientFeedback {
  id: string;
  clienteEmail: string;
  empresa: string;
  telefono?: string;
  fecha: string;
  calificacionGeneral: number; // 1-5
  facilidadUso: number; // 1-5
  precisionForense: number; // 1-5
  sugerenciaMejora: string;
  moduloSugerido: string;
  estadoRevision: 'PENDIENTE_IA' | 'ANALIZADO_IA' | 'APROBADO_PEDRO_BALDERA' | 'APLICADO';
  analisisIA?: {
    esLogicoYRazonable: boolean;
    confianzaIA: number; // 0-100
    impactoEstimado: 'ALTO' | 'MEDIO' | 'BAJO';
    diagnostico: string;
    ajustePropuesto: string;
    codigoSugerido?: string;
  };
}

export interface AiImprovementProposal {
  id: string;
  feedbackOrigenId: string;
  titulo: string;
  descripcion: string;
  categoria: 'ALGORITMO_BENFORD' | 'DETECCION_ESTRUCTURACION' | 'USABILIDAD' | 'PERFORMANCE';
  justificacionLogica: string;
  estado: 'PENDIENTE_SUPERVISION' | 'APROBADO_POR_PEDRO_BALDERA' | 'RECHAZADO' | 'APLICADO_AUTONOMAMENTE';
  fechaPropuesta: string;
  fechaAprobacion?: string;
  aprobadoPor?: string;
  cambioCodigo: {
    archivo: string;
    tipo: 'MODIFICACION' | 'NUEVA_REGLA';
    contenidoPrevio: string;
    contenidoAjustado: string;
  };
}

export interface MasterCase {
  id: number;
  case_code: string;
  entity_name: string;
  sector: string;
  total_financial_impact: number;
  currency: string;
  status: 'COMPLETADO' | 'EN_CURSO' | 'INVESTIGACION_PENDIENTE';
  created_at: string;
}

export interface LegalInfringement {
  id: string;
  norm_type: 'CONSTITUCION' | 'LEY' | 'DECRETO' | 'REGLAMENTO' | 'CODIGO_PENAL' | 'NORMA_INTERNA';
  law_name: string;
  article: string;
  numeral_literal?: string;
  text_quote: string;
  typification: string;
  sanction: string;
}

export interface FindingEvidenceItem {
  id: string;
  finding_id: number;
  evidence_code: string; // e.g. EVID-HAL-01-DOC-001
  filename: string;
  evidence_type: 'CONTRATO' | 'FACTURA' | 'CHEQUE' | 'LOG_SISTEMA' | 'ACTA_RECEPCION' | 'CERTIFICACION_BANCARIA' | 'INFORME_PERICIAL' | 'ORDEN_COMPRA' | 'EXPEDIENTE_DIGITAL';
  sha256_hash: string;
  physical_location: string; // Ubicación física detallada para corroboración
  virtual_link: string; // Hipervínculo / enlace virtual para acceso inmediato
  transcription_excerpt: string; // Transcripción textual fidedigna de datos reales
  file_size_bytes?: number;
  verified_at?: string;
  custodian_agent?: string;
  original_date?: string;
  file_data_url?: string;
}

export interface ForensicFinding {
  id: number;
  case_id: number;
  finding_code?: string; // e.g. HAL-01, HAL-02
  domain_module: string;
  norm_or_vector: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  quantified_impact: number;
  fecha_deteccion?: string;
  evidence_folder_path?: string; // Carpeta automática oficial
  transcription?: string; // Transcripción pericial de los hechos
  legal_infringements?: LegalInfringement[]; // Artículos, numerales y literales vulnerados
  evidences?: FindingEvidenceItem[]; // Evidencias vinculadas y numeradas
}

export interface DigitalCustody {
  id: number;
  case_id: number;
  filename: string;
  sha256_hash: string;
  evidence_type: string;
  created_at: string;
}
