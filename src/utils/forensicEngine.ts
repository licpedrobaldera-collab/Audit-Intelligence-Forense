import { ForensicTransaction, BenfordDigitStat, AuditReportSummary } from '../types';

export const INITIAL_TRANSACTIONS: ForensicTransaction[] = [
  {
    id: 'TX-2026-0891',
    fecha: '2026-09-28',
    proveedor: 'Apex Global Logistics LLC',
    concepto: 'Servicios de flete transfronterizo urgente',
    monto: 9850.00,
    categoria: 'Logística',
    cuentaContable: '5102-04 Transporte',
    esFinDeSemana: false,
    esMontoEstructurado: true, // Just under $10,000 CTR/FinCEN threshold
    esDuplicadoSospechoso: false,
    scoreRiesgo: 88,
    nivelAlerta: 'ALTO'
  },
  {
    id: 'TX-2026-0892',
    fecha: '2026-09-29',
    proveedor: 'Apex Global Logistics LLC',
    concepto: 'Flete adicional y seguro no documentado',
    monto: 9920.00,
    categoria: 'Logística',
    cuentaContable: '5102-04 Transporte',
    esFinDeSemana: false,
    esMontoEstructurado: true, // Split structuring
    esDuplicadoSospechoso: false,
    scoreRiesgo: 92,
    nivelAlerta: 'CRITICO'
  },
  {
    id: 'TX-2026-0904',
    fecha: '2026-10-03', // Saturday
    proveedor: 'Consultoría Estratégica Vanguard Inc',
    concepto: 'Honorarios asesoría confidencial M&A',
    monto: 4990.00,
    categoria: 'Honorarios',
    cuentaContable: '5201-10 Servicios Profesionales',
    esFinDeSemana: true,
    esMontoEstructurado: true, // Under $5k internal dual-signature approval
    esDuplicadoSospechoso: false,
    scoreRiesgo: 85,
    nivelAlerta: 'ALTO'
  },
  {
    id: 'TX-2026-0915',
    fecha: '2026-10-01',
    proveedor: 'CloudScale Systems Corp',
    concepto: 'Licenciamiento anual de infraestructura AWS',
    monto: 14250.32,
    categoria: 'Tecnología',
    cuentaContable: '5304-01 Software & Hosting',
    esFinDeSemana: false,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: false,
    scoreRiesgo: 12,
    nivelAlerta: 'BAJO'
  },
  {
    id: 'TX-2026-0922',
    fecha: '2026-10-02',
    proveedor: 'PetroFuel Fleet Services',
    concepto: 'Recarga masiva de combustible para flota matriz',
    monto: 2840.15,
    categoria: 'Operaciones',
    cuentaContable: '5105-02 Combustibles',
    esFinDeSemana: false,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: false,
    scoreRiesgo: 15,
    nivelAlerta: 'BAJO'
  },
  {
    id: 'TX-2026-0931',
    fecha: '2026-09-30',
    proveedor: 'Insumos Industriales del Golfo SA',
    concepto: 'Adquisición de refacciones hidráulicas lote A',
    monto: 7500.00,
    categoria: 'Mantenimiento',
    cuentaContable: '5108-03 Mantenimiento Planta',
    esFinDeSemana: false,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: true, // Duplicate amount & provider
    scoreRiesgo: 79,
    nivelAlerta: 'ALTO'
  },
  {
    id: 'TX-2026-0932',
    fecha: '2026-10-01',
    proveedor: 'Insumos Industriales del Golfo SA',
    concepto: 'Adquisición de refacciones hidráulicas lote A (Factura 4829)',
    monto: 7500.00,
    categoria: 'Mantenimiento',
    cuentaContable: '5108-03 Mantenimiento Planta',
    esFinDeSemana: false,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: true,
    scoreRiesgo: 82,
    nivelAlerta: 'ALTO'
  },
  {
    id: 'TX-2026-0940',
    fecha: '2026-10-04', // Sunday
    proveedor: 'Servicios Integrales Alpha Delaware',
    concepto: 'Ajuste extraordinario de balance contable',
    monto: 35000.00,
    categoria: 'Ajustes Contables',
    cuentaContable: '5900-99 Gastos No Operativos',
    esFinDeSemana: true,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: false,
    scoreRiesgo: 95,
    nivelAlerta: 'CRITICO'
  },
  {
    id: 'TX-2026-0945',
    fecha: '2026-09-27',
    proveedor: 'Metropolitan Real Estate Trust',
    concepto: 'Renta mensual oficinas corporativas Piso 14',
    monto: 18500.00,
    categoria: 'Arrendamiento',
    cuentaContable: '5401-01 Alquileres Inmuebles',
    esFinDeSemana: false,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: false,
    scoreRiesgo: 10,
    nivelAlerta: 'BAJO'
  },
  {
    id: 'TX-2026-0952',
    fecha: '2026-10-02',
    proveedor: 'Equipos Médicos de Alta Precisión',
    concepto: 'Calibración semestral de instrumental',
    monto: 3120.40,
    categoria: 'Laboratorio',
    cuentaContable: '5109-01 Calibración y Metrología',
    esFinDeSemana: false,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: false,
    scoreRiesgo: 18,
    nivelAlerta: 'BAJO'
  },
  {
    id: 'TX-2026-0960',
    fecha: '2026-10-03', // Weekend
    proveedor: 'Delta Legal Advisors LLP',
    concepto: 'Honorarios de éxito por negociación extrajudicial',
    monto: 24900.00,
    categoria: 'Legal',
    cuentaContable: '5201-05 Asesoría Jurídica',
    esFinDeSemana: true,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: false,
    scoreRiesgo: 74,
    nivelAlerta: 'MEDIO'
  },
  {
    id: 'TX-2026-0971',
    fecha: '2026-10-02',
    proveedor: 'Suministros Globales del Sureste',
    concepto: 'Papelería y consumibles de oficina central',
    monto: 630.50,
    categoria: 'Administrativo',
    cuentaContable: '5501-02 Papelería y Útiles',
    esFinDeSemana: false,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: false,
    scoreRiesgo: 8,
    nivelAlerta: 'BAJO'
  },
  {
    id: 'TX-2026-0980',
    fecha: '2026-10-04',
    proveedor: 'Security Shield Protection USA',
    concepto: 'Servicio de vigilancia armada 24/7',
    monto: 8400.00,
    categoria: 'Seguridad',
    cuentaContable: '5403-01 Seguridad y Custodia',
    esFinDeSemana: true,
    esMontoEstructurado: false,
    esDuplicadoSospechoso: false,
    scoreRiesgo: 35,
    nivelAlerta: 'MEDIO'
  }
];

export function calculateBenfordStats(transactions: ForensicTransaction[]): BenfordDigitStat[] {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  let totalValid = 0;

  transactions.forEach((tx) => {
    const val = Math.abs(tx.monto);
    if (val >= 1) {
      const firstDigit = parseInt(val.toString().replace('.', '').replace(/^0+/, '')[0], 10);
      if (firstDigit >= 1 && firstDigit <= 9) {
        counts[firstDigit]++;
        totalValid++;
      }
    }
  });

  const results: BenfordDigitStat[] = [];
  for (let d = 1; d <= 9; d++) {
    const teorico = parseFloat((Math.log10(1 + 1 / d) * 100).toFixed(1));
    const observado = totalValid > 0 ? parseFloat(((counts[d] / totalValid) * 100).toFixed(1)) : 0;
    const desviacion = parseFloat(Math.abs(observado - teorico).toFixed(1));
    results.push({
      digit: d,
      esperado: teorico,
      observado,
      desviacion,
      esAnomalo: desviacion > 7.5
    });
  }

  return results;
}

export function generateAuditSummary(transactions: ForensicTransaction[]): AuditReportSummary {
  const total = transactions.length;
  const montoTotal = transactions.reduce((acc, t) => acc + t.monto, 0);

  const estructurados = transactions.filter((t) => t.esMontoEstructurado);
  const duplicados = transactions.filter((t) => t.esDuplicadoSospechoso);
  const finDeSemana = transactions.filter((t) => t.esFinDeSemana);
  const sospechosas = transactions.filter((t) => t.nivelAlerta === 'ALTO' || t.nivelAlerta === 'CRITICO');

  const montoRiesgo = sospechosas.reduce((acc, t) => acc + t.monto, 0);

  const benford = calculateBenfordStats(transactions);
  const violacionesBenford = benford.filter((b) => b.esAnomalo).length;

  // Calculo de Score de Riesgo Global (0 - 100)
  const ratioSospecha = total > 0 ? sospechosas.length / total : 0;
  const scoreBase = ratioSospecha * 50 + violacionesBenford * 10 + (duplicados.length > 0 ? 15 : 0) + (estructurados.length > 0 ? 20 : 0);
  const scoreRiesgoGlobal = Math.min(100, Math.round(scoreBase));

  let dictamen: 'FAVORABLE_SIN_SALVEDADES' | 'CON_OBSERVACIONES_SIGNIFICATIVAS' | 'EVIDENCIA_DE_FRAUDE' = 'FAVORABLE_SIN_SALVEDADES';
  if (scoreRiesgoGlobal >= 70 || estructurados.length >= 2) {
    dictamen = 'EVIDENCIA_DE_FRAUDE';
  } else if (scoreRiesgoGlobal >= 30) {
    dictamen = 'CON_OBSERVACIONES_SIGNIFICATIVAS';
  }

  return {
    totalTransacciones: total,
    montoTotalAuditado: Math.round(montoTotal * 100) / 100,
    montoEnRiesgo: Math.round(montoRiesgo * 100) / 100,
    transaccionesSospechosas: sospechosas.length,
    violacionesBenford,
    pagosDuplicados: duplicados.length,
    pagosEstructurados: estructurados.length,
    movimientosFinDeSemana: finDeSemana.length,
    scoreRiesgoGlobal,
    dictamenForense: dictamen
  };
}
