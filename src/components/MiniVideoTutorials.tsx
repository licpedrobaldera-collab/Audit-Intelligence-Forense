import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  FileText, 
  BarChart3, 
  ShieldAlert, 
  ArrowRight, 
  MonitorPlay, 
  HelpCircle, 
  Award, 
  Terminal,
  Clock,
  Layers,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { VideoTutorial } from '../types';

interface MiniVideoTutorialsProps {
  onNavigateToTab: (tab: 'forensic' | 'simulator' | 'zip' | 'guide' | 'trial_register' | 'render_settings' | 'admin' | 'analytics' | 'tutorials' | 'ai_command' | 'yoelfri_agil') => void;
}

const TUTORIALS_DATA: VideoTutorial[] = [
  {
    id: 'TUT-01',
    modulo: 'Módulo 1',
    titulo: 'Inicio Rápido & Carga de Asientos Contables (Paso a Paso)',
    duracion: '1:45 min',
    nivel: 'Principiante',
    resumen: 'Aprende en 90 segundos cómo cargar tu libro diario, entender las cuentas contables y comenzar una auditoría sin requerir experiencia previa.',
    pasos: [
      {
        paso: 1,
        titulo: 'Acceder al Tablero Forense',
        descripcion: 'Haz clic en la pestaña "Auditoría Forense". La plataforma carga automáticamente una muestra representativa con 13 transacciones de ejemplo para familiarizarte.',
        pantallaAccion: 'Tablero Forense > Vista General de Transacciones',
        tipForense: 'Tip: Puedes presionar "Inyectar Transacción" para probar montos sospechosos como $9,940 o $4,990.'
      },
      {
        paso: 2,
        titulo: 'Reconocer los Campos Clave',
        descripcion: 'Verifica la fecha del asiento, el proveedor, el monto y la cuenta contable (ej. 5102-04 Transporte o 5900-99 Gastos No Operativos).',
        pantallaAccion: 'Tabla del Libro Diario > Columnas de Análisis',
        tipForense: 'Tip: Presta especial atención a transacciones procesadas durante sábados o domingos.'
      },
      {
        paso: 3,
        titulo: 'Ejecutar el Análisis Inicial',
        descripcion: 'El motor audita instantáneamente el 100% de las partidas y clasifica el nivel de riesgo en BAJO, MEDIO, ALTO o CRÍTICO.',
        pantallaAccion: 'KPI Cards > Score de Riesgo Global',
        tipForense: 'Tip: Un score superior a 70 puntos indica evidencia de fraude deliberado.'
      }
    ]
  },
  {
    id: 'TUT-02',
    modulo: 'Módulo 2',
    titulo: 'Análisis Matemático con la Ley de Benford',
    duracion: '2:15 min',
    nivel: 'Intermedio',
    resumen: 'Descubre cómo identificar contabilidades manipuladas analizando la frecuencia natural del primer dígito numérico.',
    pasos: [
      {
        paso: 1,
        titulo: 'Comprender la Curva Teórica',
        descripcion: 'La Ley de Benford establece que en datos contables naturales, el dígito 1 debe aparecer el 30.1% de las veces, mientras que el dígito 9 solo el 4.6%.',
        pantallaAccion: 'Gráfico de Benford > Barras Teóricas vs Observadas',
        tipForense: 'Tip: Los defraudadores suelen inventar cifras que inician con dígitos altos (7, 8 o 9).'
      },
      {
        paso: 2,
        titulo: 'Detectar Picos Anómalos',
        descripcion: 'El sistema compara los porcentajes reales de tus asientos y resalta en rojo cualquier desviación superior al 7.5%.',
        pantallaAccion: 'Gráfico de Benford > Alertas de Desviación',
        tipForense: 'Tip: Si observas un pico anómalo en el dígito 9, indica pagos estructurados de $9,850 o $9,920.'
      },
      {
        paso: 3,
        titulo: 'Recalcular con Nuevos Datos',
        descripcion: 'Haz clic en "Recalcular Curva" cada vez que inyectes o cargues nuevos registros para actualizar la evaluación matemática.',
        pantallaAccion: 'Botón "Recalcular Curva" en tiempo real',
        tipForense: 'Tip: Esta prueba es admitida en cortes judiciales bajo el estándar Daubert y SAS 99.'
      }
    ]
  },
  {
    id: 'TUT-03',
    modulo: 'Módulo 3',
    titulo: 'Detección de Pagos Estructurados & Facturas Espejo',
    duracion: '1:55 min',
    nivel: 'Intermedio',
    resumen: 'Aprende a descubrir evasión de controles antilavado (FinCEN / BSA) y duplicación fraudulenta de pagos.',
    pasos: [
      {
        paso: 1,
        titulo: 'Filtro de Transacciones Estructuradas',
        descripcion: 'Selecciona el filtro "Estructuradas" en la tabla del libro diario para aislar transferencias diseñadas para no superar el límite de reporte de $10,000 USD.',
        pantallaAccion: 'Filtro [Estructuradas] > Tabla Forense',
        tipForense: 'Tip: Dos pagos de $9,850 y $9,920 al mismo proveedor en días consecutivos constituyen delito de fraccionamiento.'
      },
      {
        paso: 2,
        titulo: 'Descubrir Facturas Espejo (Duplicadas)',
        descripcion: 'Usa el filtro "Duplicadas" para identificar cobros gemelos (ej. dos facturas de $7,500.00 con conceptos ligeramente alterados).',
        pantallaAccion: 'Filtro [Duplicadas] > Alertas de Pagos Gemelos',
        tipForense: 'Tip: Es uno de los fraudes de compras más comunes en empresas medianas.'
      },
      {
        paso: 3,
        titulo: 'Asientos en Fin de Semana',
        descripcion: 'Revisa asientos registrados en sábado o domingo sin orden de compra aprobada, habitualmente usados para cuadrar balances ficticios.',
        pantallaAccion: 'Filtro [Fin Semana] > Asientos No Laborales',
        tipForense: 'Tip: Los ajustes extraordinarios en domingo suelen esconder salidas de caja no justificadas.'
      }
    ]
  },
  {
    id: 'TUT-04',
    modulo: 'Módulo 4',
    titulo: 'Emisión del Dictamen Pericial de Auditoría Forense',
    duracion: '2:30 min',
    nivel: 'Avanzado',
    resumen: 'Genera el informe pericial formal conforme a las directrices de AICPA SAS 99 y normas internacionales de auditoría.',
    pasos: [
      {
        paso: 1,
        titulo: 'Emitir el Dictamen Pericial',
        descripcion: 'Haz clic en el botón superior "Emitir Dictamen Pericial". El sistema consolida automáticamente los hallazgos críticos.',
        pantallaAccion: 'Modal "Dictamen Pericial de Auditoría Forense"',
        tipForense: 'Tip: El informe incluye número de expediente (ej. USA-FOR-2026-089A) y sello hash SHA-256.'
      },
      {
        paso: 2,
        titulo: 'Verificar la Conclusión Pericial',
        descripcion: 'Revisa si el dictamen califica como FAVORABLE, CON SALVEDADES o EVIDENCIA SIGNIFICATIVA DE FRAUDE con sustento legal.',
        pantallaAccion: 'Sección "Conclusión y Dictamen Forense"',
        tipForense: 'Tip: Detalla los importes exactos en riesgo patrimonial detectados durante la prueba.'
      },
      {
        paso: 3,
        titulo: 'Presentar y Asesorar al Cliente',
        descripcion: 'Usa este documento como base para presentar la asesoría técnica o peritaje judicial definitivo.',
        pantallaAccion: 'Exportación y certificación oficial',
        tipForense: 'Tip: El Lic. Pedro Baldera puede brindar asesoría complementaria sobre el dictamen.'
      }
    ]
  },
  {
    id: 'TUT-05',
    modulo: 'Módulo 5',
    titulo: 'Prueba de 3 Días & Activación de Licencia BHD León',
    duracion: '1:30 min',
    nivel: 'Principiante',
    resumen: 'Conoce cómo funciona el límite de 72 horas y cómo activar tu suscripción permanente con Banco BHD León.',
    pasos: [
      {
        paso: 1,
        titulo: 'El Contador de 72 Horas',
        descripcion: 'Observa la barra superior con el temporizador continuo. Tienes 3 días enteros desde el registro para procesar libros contables.',
        pantallaAccion: 'Trial Banner > Cuenta regresiva en horas, minutos y segundos',
        tipForense: 'Tip: Puedes probar el simulador para ver cómo bloquea el sistema si pasan más de 3 días.'
      },
      {
        paso: 2,
        titulo: 'Transferencia al Banco BHD León',
        descripcion: 'Realiza tu transferencia a la cuenta 08694150021 a nombre de Pedro Baldera (BHD León).',
        pantallaAccion: 'Modal de Desbloqueo > Datos BHD León',
        tipForense: 'Tip: El administrador activará tu cuenta inmediatamente y te enviará la factura oficial por WhatsApp.'
      },
      {
        paso: 3,
        titulo: 'Desbloqueo Permanente',
        descripcion: 'Una vez validado el comprobante, tu variable estado_pago pasa a True y gozas de acceso ilimitado de por vida.',
        pantallaAccion: 'Licencia Permanente Ilimitada Activa',
        tipForense: 'Tip: También puedes solicitar reasignación de días extra de prueba al administrador.'
      }
    ]
  }
];

export const MiniVideoTutorials: React.FC<MiniVideoTutorialsProps> = ({ onNavigateToTab }) => {
  const [selectedTutorialIndex, setSelectedTutorialIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(25);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentTutorial = TUTORIALS_DATA[selectedTutorialIndex];

  // Simulated video playback progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Move to next step or loop
            setActiveStepIndex((s) => (s + 1) % currentTutorial.pasos.length);
            return 0;
          }
          return prev + 2.5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTutorial]);

  const handleSelectTutorial = (index: number) => {
    setSelectedTutorialIndex(index);
    setProgress(0);
    setActiveStepIndex(0);
    setIsPlaying(true);
  };

  const currentStep = currentTutorial.pasos[activeStepIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
              <MonitorPlay className="w-3.5 h-3.5 text-indigo-400" />
              CENTRO DE MINI-VIDEOS &amp; CAPACITACIÓN INTERACTIVA (CERO EXPERIENCIA REQUERIDA)
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Aprende a Operar el Sistema Forense en 5 Módulos Cortos
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Diseñado para que cualquier persona, contador o auditor sin experiencia técnica previa pueda seguir los pasos exactos, detectar indicios de fraude y generar los resultados deseados de su investigación.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigateToTab('forensic')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Ir al Tablero Forense Real</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Selector of Modules / Right Interactive Video Screen Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Module Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Módulos de Aprendizaje
            </span>
            <span className="text-slate-500">{TUTORIALS_DATA.length} Lecciones</span>
          </div>

          {TUTORIALS_DATA.map((tut, idx) => {
            const isSelected = selectedTutorialIndex === idx;
            return (
              <button
                key={tut.id}
                onClick={() => handleSelectTutorial(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500/60 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  isSelected
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
                      {tut.modulo} • {tut.nivel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tut.duracion}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">
                    {tut.titulo}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    {tut.resumen}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Simulated Video Player & Step Walkthrough (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6">
          {/* Simulated Screen Player Viewport */}
          <div className="relative bg-slate-950 border-b border-slate-800 aspect-video max-h-[380px] w-full flex flex-col justify-between p-5 overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/30 via-slate-950 to-cyan-950/20 pointer-events-none"></div>

            {/* Top Bar of player */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-white font-bold">{currentTutorial.modulo}:</span>
                <span className="text-cyan-300 truncate max-w-xs">{currentTutorial.titulo}</span>
              </div>

              <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                Paso {activeStepIndex + 1} de {currentTutorial.pasos.length}
              </span>
            </div>

            {/* Simulated Animated Screen Center Content */}
            <div className="relative z-10 my-auto p-6 bg-slate-900/90 border border-slate-800/80 rounded-2xl max-w-xl mx-auto shadow-2xl space-y-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  {currentStep.paso}
                </div>
                <h4 className="text-base font-bold text-white">
                  {currentStep.titulo}
                </h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.descripcion}
              </p>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Ubicación en pantalla:</span>
                <span className="text-cyan-300 font-semibold">{currentStep.pantallaAccion}</span>
              </div>

              {/* Forensic Tip Callout */}
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentStep.tipForense}</span>
              </div>
            </div>

            {/* Bottom Controls Bar of Video Player */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold transition-all shadow-md shadow-cyan-500/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    setProgress(0);
                    setActiveStepIndex(0);
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                  title="Reiniciar mini-video"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  {isPlaying ? 'Reproduciendo simulación paso a paso...' : 'Pausado'}
                </span>
              </div>

              {/* Progress Scrub Bar */}
              <div className="flex-1 max-w-xs space-y-1">
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Direct Action: Try This Step Now */}
              <button
                onClick={() => {
                  if (selectedTutorialIndex === 0 || selectedTutorialIndex === 1 || selectedTutorialIndex === 2 || selectedTutorialIndex === 3) {
                    onNavigateToTab('forensic');
                  } else {
                    onNavigateToTab('simulator');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <span>Probar Ahora</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper details beneath the player */}
          <div className="px-6 pb-6 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Guía de Ejecución en 3 Pasos Simples
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentTutorial.pasos.map((paso, pIdx) => {
                const isActive = activeStepIndex === pIdx;
                return (
                  <div
                    key={paso.paso}
                    onClick={() => {
                      setActiveStepIndex(pIdx);
                      setProgress(0);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {paso.paso}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {isActive ? 'En pantalla' : 'Clic para saltar'}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-white mb-1">
                      {paso.titulo}
                    </h5>

                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                      {paso.descripcion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
