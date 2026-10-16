import { ForensicFinding, MasterCase } from '../types';

export interface SeverityAggregatedData {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  nombre: string;
  count: number;
  impact: number;
  impactFormatted: string;
  fillColor: string;
  strokeColor: string;
  percentage: string;
  badge: string;
}

export interface TimelineDataPoint {
  date: string;
  label: string;
  incident: string;
  amount: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  impactoPeriodo: number;
  impactoAcumulado: number;
  displayPeriodo: string;
  displayAcumulado: string;
}

export interface DomainAggregatedData {
  domain: string;
  count: number;
  totalImpact: number;
  formattedImpact: string;
  percentage: string;
  severities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface ForensicAuditKpis {
  totalImpact: number;
  formattedTotalImpact: string;
  criticalHighImpact: number;
  formattedCriticalHighImpact: string;
  riskConcentrationPct: string;
  averageImpact: number;
  formattedAverageImpact: string;
  totalFindingsCount: number;
  highestSingleFinding: {
    domain: string;
    description: string;
    impact: number;
    severity: string;
  } | null;
  dominantSeverity: string;
}

export const SEVERITY_CONFIG: Record<string, { fill: string; stroke: string; bg: string; text: string; badge: string; label: string }> = {
  CRITICAL: {
    fill: '#EF4444',
    stroke: '#DC2626',
    bg: 'rgba(239, 68, 68, 0.15)',
    text: '#F87171',
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
    label: 'Crítico'
  },
  HIGH: {
    fill: '#F59E0B',
    stroke: '#D97706',
    bg: 'rgba(245, 158, 11, 0.15)',
    text: '#FBBF24',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    label: 'Alto'
  },
  MEDIUM: {
    fill: '#3B82F6',
    stroke: '#2563EB',
    bg: 'rgba(59, 130, 246, 0.15)',
    text: '#60A5FA',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    label: 'Medio'
  },
  LOW: {
    fill: '#10B981',
    stroke: '#059669',
    bg: 'rgba(16, 185, 129, 0.15)',
    text: '#34D399',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    label: 'Bajo'
  }
};

/**
 * Normaliza cualquier variante de severidad a las 4 clases canónicas.
 */
export function normalizeSeverity(val: string | undefined): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  if (!val) return 'MEDIUM';
  const upper = String(val).toUpperCase().trim();
  if (upper === 'CRITICAL' || upper === 'CRITICO' || upper === 'CRÍTICO' || upper === 'URGENT') return 'CRITICAL';
  if (upper === 'HIGH' || upper === 'ALTO' || upper === 'ALTA') return 'HIGH';
  if (upper === 'MEDIUM' || upper === 'MEDIO' || upper === 'MEDIA' || upper === 'MODERATE') return 'MEDIUM';
  if (upper === 'LOW' || upper === 'BAJO' || upper === 'BAJA' || upper === 'INFORMATIVE') return 'LOW';
  return 'MEDIUM';
}

/**
 * 1. Helper de Procesamiento: Agrega hallazgos por nivel de severidad para el BarChart de Recharts.
 */
export function aggregateFindingsBySeverity(
  findings: ForensicFinding[],
  totalImpact?: number
): SeverityAggregatedData[] {
  const severities: Array<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'> = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  
  const map: Record<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW', { count: number; impact: number }> = {
    CRITICAL: { count: 0, impact: 0 },
    HIGH: { count: 0, impact: 0 },
    MEDIUM: { count: 0, impact: 0 },
    LOW: { count: 0, impact: 0 }
  };

  findings.forEach((f) => {
    const sev = normalizeSeverity(f.severity);
    map[sev].count += 1;
    map[sev].impact += Number(f.quantified_impact || 0);
  });

  const calculatedTotal = totalImpact && totalImpact > 0
    ? totalImpact
    : Object.values(map).reduce((sum, item) => sum + item.impact, 0);

  return severities.map((sev) => {
    const count = map[sev].count;
    const impact = map[sev].impact;
    const config = SEVERITY_CONFIG[sev];
    const pct = calculatedTotal > 0 ? ((impact / calculatedTotal) * 100).toFixed(1) : '0.0';

    return {
      severity: sev,
      nombre: config.label,
      count,
      impact,
      impactFormatted: impact.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      fillColor: config.fill,
      strokeColor: config.stroke,
      percentage: pct,
      badge: config.badge
    };
  });
}

/**
 * 2. Helper de Procesamiento: Agrega evolución y distribución temporal de impacto para el AreaChart de Recharts.
 * Extrae y acumula el perjuicio financiero de forma cronológica garantizando trazabilidad progresiva.
 */
export function aggregateCumulativeImpactOverTime(
  findings: ForensicFinding[],
  currency: string = 'RD$'
): TimelineDataPoint[] {
  if (!findings || findings.length === 0) {
    return [
      {
        date: new Date().toISOString().split('T')[0],
        label: 'Inicio',
        incident: 'Sin hallazgos registrados',
        amount: 0,
        severity: 'LOW',
        impactoPeriodo: 0,
        impactoAcumulado: 0,
        displayPeriodo: `${currency} $0.00`,
        displayAcumulado: `${currency} $0.00`
      }
    ];
  }

  // Ordenar cronológicamente si hay fechas, o usar fechas predefinidas de los casos reales
  const sortedFindings = [...findings].sort((a, b) => {
    const dateA = a.fecha_deteccion || '2026-10-01';
    const dateB = b.fecha_deteccion || '2026-10-01';
    return dateA.localeCompare(dateB);
  });

  // Agrupar por fecha o incidente secuencial
  let runningTotal = 0;
  const result: TimelineDataPoint[] = [];

  sortedFindings.forEach((finding, idx) => {
    const rawDate = finding.fecha_deteccion || `2026-10-${String((idx * 3) + 2).padStart(2, '0')}`;
    const amount = Number(finding.quantified_impact || 0);
    runningTotal += amount;

    // Etiqueta corta dd MMM
    const dateParts = rawDate.split('-');
    const day = dateParts[2] || '01';
    const month = dateParts[1] === '10' ? 'Oct' : dateParts[1] === '09' ? 'Sep' : dateParts[1] === '11' ? 'Nov' : 'Mes';
    const label = `${day} ${month}`;

    result.push({
      date: rawDate,
      label,
      incident: finding.description || finding.norm_or_vector,
      amount,
      severity: normalizeSeverity(finding.severity),
      impactoPeriodo: amount,
      impactoAcumulado: runningTotal,
      displayPeriodo: `${currency} $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      displayAcumulado: `${currency} $${runningTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    });
  });

  return result;
}

/**
 * 3. Helper de Procesamiento: Agrupa incidencias por Módulo de Dominio pericial.
 */
export function aggregateFindingsByDomainModule(
  findings: ForensicFinding[]
): DomainAggregatedData[] {
  const domainMap: Record<string, {
    count: number;
    totalImpact: number;
    severities: { critical: number; high: number; medium: number; low: number };
  }> = {};

  let overallTotal = 0;

  findings.forEach((f) => {
    const domain = f.domain_module || 'General';
    const impact = Number(f.quantified_impact || 0);
    const sev = normalizeSeverity(f.severity);
    overallTotal += impact;

    if (!domainMap[domain]) {
      domainMap[domain] = {
        count: 0,
        totalImpact: 0,
        severities: { critical: 0, high: 0, medium: 0, low: 0 }
      };
    }

    domainMap[domain].count += 1;
    domainMap[domain].totalImpact += impact;

    if (sev === 'CRITICAL') domainMap[domain].severities.critical += 1;
    else if (sev === 'HIGH') domainMap[domain].severities.high += 1;
    else if (sev === 'MEDIUM') domainMap[domain].severities.medium += 1;
    else domainMap[domain].severities.low += 1;
  });

  return Object.entries(domainMap).map(([domain, data]) => ({
    domain,
    count: data.count,
    totalImpact: data.totalImpact,
    formattedImpact: data.totalImpact.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    percentage: overallTotal > 0 ? ((data.totalImpact / overallTotal) * 100).toFixed(1) : '0.0',
    severities: data.severities
  })).sort((a, b) => b.totalImpact - a.totalImpact);
}

/**
 * 4. Helper de Procesamiento: Transforma registros crudos de base de datos (SQLite / API)
 * en la estructura tipada ForensicFinding[] con saneamiento.
 */
export function processDatabaseRecordsToFindings(rawRecords: any[]): ForensicFinding[] {
  if (!Array.isArray(rawRecords)) return [];

  return rawRecords.map((row, index) => {
    // Si viene como array de SQLite cursor.fetchall(): [id, case_id, domain_module, norm_or_vector, description, severity, quantified_impact, fecha]
    if (Array.isArray(row)) {
      return {
        id: Number(row[0]) || index + 1,
        case_id: Number(row[1]) || 1,
        domain_module: String(row[2] || 'Compras y DGCP'),
        norm_or_vector: String(row[3] || 'Ley 340-06'),
        description: String(row[4] || 'Incidencia no descrita'),
        severity: normalizeSeverity(row[5]),
        quantified_impact: Number(row[6]) || 0,
        fecha_deteccion: row[7] ? String(row[7]) : undefined
      };
    }

    // Si viene como objeto
    return {
      id: Number(row.id) || index + 1,
      case_id: Number(row.case_id) || 1,
      domain_module: String(row.domain_module || row.domain || 'Compras y DGCP'),
      norm_or_vector: String(row.norm_or_vector || row.norm || 'Normativa Forense'),
      description: String(row.description || row.desc || 'Hallazgo pericial registrado'),
      severity: normalizeSeverity(row.severity),
      quantified_impact: Number(row.quantified_impact || row.impact || 0),
      fecha_deteccion: row.fecha_deteccion || row.fecha || row.date || undefined
    };
  });
}

/**
 * 5. Helper de Procesamiento: Calcula KPIs e indicadores clave de riesgo forense consolidados.
 */
export function calculateForensicAuditKpis(
  findings: ForensicFinding[],
  masterCase: MasterCase
): ForensicAuditKpis {
  const totalImpact = findings.reduce((acc, f) => acc + (Number(f.quantified_impact) || 0), 0);
  const criticalHighImpact = findings
    .filter((f) => normalizeSeverity(f.severity) === 'CRITICAL' || normalizeSeverity(f.severity) === 'HIGH')
    .reduce((acc, f) => acc + (Number(f.quantified_impact) || 0), 0);

  const riskConcentrationPct = totalImpact > 0
    ? ((criticalHighImpact / totalImpact) * 100).toFixed(1)
    : '0.0';

  const averageImpact = findings.length > 0 ? totalImpact / findings.length : 0;

  // Hallazgo de mayor impacto individual
  let highestSingleFinding: ForensicAuditKpis['highestSingleFinding'] = null;
  if (findings.length > 0) {
    const highest = [...findings].sort((a, b) => (b.quantified_impact || 0) - (a.quantified_impact || 0))[0];
    if (highest) {
      highestSingleFinding = {
        domain: highest.domain_module,
        description: highest.description,
        impact: highest.quantified_impact,
        severity: normalizeSeverity(highest.severity)
      };
    }
  }

  // Severidad dominante
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  findings.forEach((f) => {
    counts[normalizeSeverity(f.severity)] += 1;
  });
  const dominantSeverity = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'HIGH';

  return {
    totalImpact,
    formattedTotalImpact: totalImpact.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    criticalHighImpact,
    formattedCriticalHighImpact: criticalHighImpact.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    riskConcentrationPct,
    averageImpact,
    formattedAverageImpact: averageImpact.toLocaleString('en-US', { maximumFractionDigits: 0 }),
    totalFindingsCount: findings.length,
    highestSingleFinding,
    dominantSeverity
  };
}

// ---------------------------------------------------------------------------
// CATÁLOGO MAESTRO DE NORMAS LEGALES INCUMPLIDAS (CONSTITUCIÓN, LEYES, DECRETOS)
// ---------------------------------------------------------------------------
export const LEGAL_FRAMEWORK_CATALOG = [
  {
    id: 'CONST-146',
    norm_type: 'CONSTITUCION' as const,
    law_name: 'Constitución de la República Dominicana',
    article: 'Artículo 146',
    numeral_literal: 'Numeral 1 y 2, Literal a',
    text_quote: 'Se condena toda forma de corrupción en los órganos del Estado. En consecuencia: 1) Será sancionada con las penas que la ley determine, toda persona que sustraiga, para su provecho personal o de terceros, fondos públicos o que prevaliéndose de sus posiciones obtenga provecho económico.',
    typification: 'Proscripción constitucional de la corrupción y enriquecimiento ilícito.',
    sanction: 'Inhabilitación perpetua para la función pública, restitución de bienes sustraídos y privación de libertad.'
  },
  {
    id: 'CONST-246',
    norm_type: 'CONSTITUCION' as const,
    law_name: 'Constitución de la República Dominicana',
    article: 'Artículo 246',
    numeral_literal: 'Párrafo Único',
    text_quote: 'El control y fiscalización sobre el patrimonio, los ingresos, gastos y uso de los fondos públicos se llevará a cabo por el Congreso Nacional, la Cámara de Cuentas, la Contraloría General de la República y los mecanismos de control social.',
    typification: 'Vulneración de las normas supremas de fiscalización y control del gasto público.',
    sanction: 'Nulidad de pleno derecho de actos de disposición no autorizados.'
  },
  {
    id: 'LEY-340-06-ART-16',
    norm_type: 'LEY' as const,
    law_name: 'Ley No. 340-06 sobre Compras y Contrataciones Públicas',
    article: 'Artículo 16',
    numeral_literal: 'Párrafo II',
    text_quote: 'Se prohíbe expresamente el fraccionamiento de las compras o contrataciones cuando tenga como fin eludir las formalidades de las licitaciones públicas o los procedimientos de selección previstos en esta ley.',
    typification: 'Fraccionamiento deliberado de órdenes de compra (Smurfing/Splitting) en períodos inferiores a umbrales legales.',
    sanction: 'Nulidad de los contratos u órdenes, destitución inmediata y responsabilidad penal tipificada en Art. 65.'
  },
  {
    id: 'LEY-340-06-ART-14',
    norm_type: 'LEY' as const,
    law_name: 'Ley No. 340-06 sobre Compras y Contrataciones Públicas',
    article: 'Artículo 14',
    numeral_literal: 'Numeral 1 al 5',
    text_quote: 'No podrán ser oferentes ni contratar con el Estado: el Presidente, Ministros, Directores Generales, servidores públicos del área de compras y sus parientes hasta el tercer grado de consanguinidad o segundo de afinidad.',
    typification: 'Conflicto de intereses, incompatibilidad legal de oferentes vinculados.',
    sanction: 'Inhabilitación definitiva en el Registro de Proveedores del Estado (RPE) y remisión a Procuraduría Especializada.'
  },
  {
    id: 'DECRETO-543-12-ART-28',
    norm_type: 'DECRETO' as const,
    law_name: 'Decreto No. 543-12 (Reglamento de Aplicación Ley 340-06)',
    article: 'Artículo 28',
    numeral_literal: 'Literal b, Numeral 3',
    text_quote: 'Se considerará indicio grave de fraccionamiento la emisión concurrente o sucesiva de órdenes de compra al mismo proveedor o empresas del mismo grupo económico en plazos inferiores a siete (7) días hábiles.',
    typification: 'Violación del umbral operativo y temporal de 7 días entre órdenes fraccionadas.',
    sanction: 'Responsabilidad administrativa funcional y retención precautoria de pagos.'
  },
  {
    id: 'LEY-10-07-ART-14',
    norm_type: 'LEY' as const,
    law_name: 'Ley No. 10-07 de Control Interno y Contraloría General',
    article: 'Artículo 14',
    numeral_literal: 'Numeral 4, Literal c',
    text_quote: 'Las entidades del sector público están obligadas a establecer y mantener un sistema de control interno previo y posterior que garantice la legalidad, exactitud y veracidad de cada desembolso o compromiso financiero.',
    typification: 'Omisión culpable o negligente de controles internos previos en nóminas o desembolsos extraordinarios.',
    sanction: 'Juicio de cuentas, sanciones disciplinarias de tercer grado y pliego de reparos financieros.'
  },
  {
    id: 'LEY-53-07-ART-6',
    norm_type: 'LEY' as const,
    law_name: 'Ley No. 53-07 sobre Crímenes y Delitos de Alta Tecnología',
    article: 'Artículo 6',
    numeral_literal: 'Párrafo I',
    text_quote: 'El acceso ilícito a un sistema electrónico, telemático o de telecomunicaciones, o el mantenimiento en él contra la voluntad del legítimo titular, será castigado con prisión y multa pecuniaria.',
    typification: 'Vulneración de credenciales, fuga de base de datos ciudadana y negligencia grave en cifrado de datos.',
    sanction: 'Prisión de tres meses a un año y multa de dos a doscientas veces el salario mínimo.'
  },
  {
    id: 'CODIGO-PENAL-ART-171',
    norm_type: 'CODIGO_PENAL' as const,
    law_name: 'Código Penal de la República Dominicana',
    article: 'Artículo 171',
    numeral_literal: 'Párrafo II',
    text_quote: 'Todo funcionario o empleado público que cometa el delito de desfalco, apropiándose o distrayendo fondos que le fueren confiados por razón de su cargo, será castigado con la degradación cívica y prisión mayor.',
    typification: 'Desfalco agravado y distracción fraudulenta de caudales estatales.',
    sanction: 'Reclusión mayor de 3 a 10 años, restitución del triple del valor sustraído e interdicción legal.'
  }
];

// Helper to generate automatic evidence folder path
export function generateAutomaticEvidenceFolderPath(findingId: number, domain: string, caseCode: string): string {
  const cleanDomain = domain
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .slice(0, 24);
  const padId = String(findingId).padStart(2, '0');
  return `evidencias_oficiales/EXP-${caseCode}/HALLAZGO_${padId}_${cleanDomain}/`;
}

// Helper to generate automated sequential evidence code
export function generateEvidenceCode(findingId: number, index: number, evidenceType: string): string {
  const padFinding = String(findingId).padStart(2, '0');
  const padIndex = String(index).padStart(3, '0');
  const typePrefix = (evidenceType || 'DOC').slice(0, 3).toUpperCase();
  return `EVID-HAL-${padFinding}-${typePrefix}-${padIndex}`;
}
