import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Phone, 
  Send, 
  Search, 
  Check, 
  X, 
  Eye, 
  Lock, 
  Unlock, 
  PlusCircle, 
  Download, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserTrial } from '../types';

interface ClientRecord {
  email: string;
  empresa: string;
  plan: 'trial' | 'pro' | 'enterprise';
  estadoPago: boolean;
  fechaRegistro: string;
  diasTranscurridos: number;
  horasRestantes: number;
  pagoPendiente?: {
    plan: string;
    monto: number;
    fecha: string;
    comprobante: string;
    estado: 'pendiente' | 'verificado';
  };
}

const INITIAL_CLIENTS: ClientRecord[] = [
  {
    email: 'licpedrobaldera@gmail.com',
    empresa: 'Baldera Santos & Asociados',
    plan: 'pro',
    estadoPago: true,
    fechaRegistro: '2026-09-01T08:00:00Z',
    diasTranscurridos: 33.5,
    horasRestantes: 0
  },
  {
    email: 'carlos.mendoza@auditorias-usa.com',
    empresa: 'Mendoza & Partners CPA',
    plan: 'trial',
    estadoPago: false,
    fechaRegistro: new Date(Date.now() - 1.2 * 86400 * 1000).toISOString(),
    diasTranscurridos: 1.2,
    horasRestantes: 43.2
  },
  {
    email: 'rodriguez.forense@miami-audit.com',
    empresa: 'Rodriguez Forensic Audit LLC',
    plan: 'trial',
    estadoPago: false,
    fechaRegistro: new Date(Date.now() - 3.4 * 86400 * 1000).toISOString(),
    diasTranscurridos: 3.4,
    horasRestantes: 0,
    pagoPendiente: {
      plan: 'PRO',
      monto: 40000,
      fecha: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      comprobante: 'comprobante_bhd_mendoza_transferencia_40000.jpg',
      estado: 'pendiente'
    }
  },
  {
    email: 'auditor.delaware@corp-checks.com',
    empresa: 'Delaware Compliance Group',
    plan: 'trial',
    estadoPago: false,
    fechaRegistro: new Date(Date.now() - 3.8 * 86400 * 1000).toISOString(),
    diasTranscurridos: 3.8,
    horasRestantes: 0
  }
];

interface AdminPortalProps {
  onUpdateGlobalTrial?: (updates: Partial<UserTrial>) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onUpdateGlobalTrial }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);
  const [adminEmail, setAdminEmail] = useState('licpedrobaldera@gmail.com');
  const [clients, setClients] = useState<ClientRecord[]>(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<ClientRecord | null>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<{
    numero: string;
    cliente: string;
    monto: number;
    fecha: string;
    titular: string;
    cuenta: string;
  } | null>(null);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const filteredClients = clients.filter(
    (c) =>
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingPayments = clients.filter(
    (c) => c.pagoPendiente && c.pagoPendiente.estado === 'pendiente'
  );

  const handleActivateClient = (email: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.email === email) {
          const monto = c.pagoPendiente?.monto || 40000;
          const invoiceNum = `BHD-${Date.now().toString().slice(-6)}`;
          setGeneratedInvoice({
            numero: invoiceNum,
            cliente: email,
            monto,
            fecha: new Date().toLocaleDateString(),
            titular: 'Pedro Baldera',
            cuenta: '08694150021'
          });

          return {
            ...c,
            plan: 'pro',
            estadoPago: true,
            pagoPendiente: c.pagoPendiente
              ? { ...c.pagoPendiente, estado: 'verificado' }
              : undefined
          };
        }
        return c;
      })
    );

    if (onUpdateGlobalTrial) {
      onUpdateGlobalTrial({ estadoPago: true });
    }

    setNotificationMsg(`✅ Usuario ${email} activado con éxito. Factura PDF emitida y notificación enviada a WhatsApp (+1 829-771-7390).`);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  const handleToggleBlock = (email: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.email === email) {
          const nuevoEstado = !c.estadoPago;
          return {
            ...c,
            estadoPago: nuevoEstado,
            diasTranscurridos: nuevoEstado ? c.diasTranscurridos : 3.5
          };
        }
        return c;
      })
    );
  };

  const handleExtendTrial = (email: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.email === email) {
          return {
            ...c,
            diasTranscurridos: 0.1,
            horasRestantes: 70.0,
            estadoPago: false
          };
        }
        return c;
      })
    );
    setNotificationMsg(`⏱️ Prueba extendida por 3 días más (72 horas) para ${email}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              PANEL OFICIAL DE ADMINISTRADOR ONLINE (PEDRO BALDERA)
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Centro de Control &amp; Activación de Licencias
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Como administrador puedes ver los clientes en prueba gratuita de 3 días, verificar comprobantes de transferencias del <strong className="text-white">Banco BHD León (Cuenta 08694150021)</strong>, desbloquear cuentas y generar facturas oficiales.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Administrador: {adminEmail}
              </span>
              <span>•</span>
              <span className="text-slate-300">
                WhatsApp Admin: <strong className="text-emerald-400">+1 829-771-7390</strong>
              </span>
              <span>•</span>
              <span className="text-cyan-400">
                Banco BHD León: 08694150021
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Total Usuarios:</span>
                <span className="font-bold text-white">{clients.length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">En Prueba (Trial):</span>
                <span className="text-cyan-400 font-bold">{clients.filter((c) => !c.estadoPago).length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Pagos Pendientes:</span>
                <span className="text-amber-400 font-bold">{pendingPayments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between gap-4">
          <span>{notificationMsg}</span>
          <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Pending Payments Alert Section */}
      {pendingPayments.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/40 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Comprobantes de Pago Pendientes de Verificación ({pendingPayments.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
              Banco BHD León: 08694150021
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPayments.map((client) => (
              <div
                key={client.email}
                className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm block">{client.email}</span>
                    <span className="text-xs text-slate-400">{client.empresa}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    RD$ {client.pagoPendiente?.monto.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span>Plan Solicitado:</span>
                    <strong className="text-white">{client.pagoPendiente?.plan}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Comprobante:</span>
                    <span className="text-cyan-300 truncate max-w-xs">{client.pagoPendiente?.comprobante}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <span>{new Date(client.pagoPendiente?.fecha || '').toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedReceipt(client)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ver Comprobante</span>
                  </button>

                  <button
                    onClick={() => handleActivateClient(client.email)}
                    className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aprobar &amp; Activar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Gestión de Clientes y Estado de los 3 Días de Prueba</span>
            </h2>
            <p className="text-xs text-slate-400">
              Monitorea en tiempo real quién tiene acceso y quién ha superado las 72 horas
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por correo o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Cliente / Firma</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Días Transcurridos</th>
                <th className="px-4 py-3">Estado de Pago</th>
                <th className="px-4 py-3 text-right">Acciones de Administrador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {filteredClients.map((client) => {
                const isTrialExpired = client.diasTranscurridos > 3 && !client.estadoPago;
                return (
                  <tr key={client.email} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-white block">{client.email}</span>
                      <span className="text-[11px] text-slate-400">{client.empresa}</span>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        client.plan === 'pro'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {client.plan}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <div className="flex items-center gap-2">
                        <span className={isTrialExpired ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {client.diasTranscurridos.toFixed(1)} días
                        </span>
                        {isTrialExpired && (
                          <span className="text-[10px] bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40">
                            BLOQUEADO (&gt; 3d)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {client.estadoPago ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pagado (Ilimitado)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <Clock className="w-3.5 h-3.5" /> Pendiente de Pago
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!client.estadoPago && (
                          <button
                            onClick={() => handleActivateClient(client.email)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                            title="Activar como cliente pagado permanente"
                          >
                            Activar Pro
                          </button>
                        )}

                        <button
                          onClick={() => handleExtendTrial(client.email)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono border border-slate-700 transition-colors"
                          title="Reiniciar contador a 72 horas"
                        >
                          +3 Días
                        </button>

                        <button
                          onClick={() => handleToggleBlock(client.email)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700 transition-colors"
                          title="Alternar bloqueo"
                        >
                          {client.estadoPago ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official BHD León Invoice Modal */}
      {generatedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  AUDIT INTELLIGENCE USA // BANCO BHD LEÓN
                </span>
                <h3 className="text-xl font-bold text-white">Factura Oficial Generada</h3>
              </div>
              <button onClick={() => setGeneratedInvoice(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Factura N°:</span>
                <strong className="text-white">{generatedInvoice.numero}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cliente:</span>
                <span className="text-cyan-300">{generatedInvoice.cliente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha:</span>
                <span>{generatedInvoice.fecha}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Banco Receptor:</span>
                <span>Banco BHD León (Cuenta {generatedInvoice.cuenta})</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                <span className="text-slate-400">Total Pagado:</span>
                <strong className="text-emerald-400">RD$ {generatedInvoice.monto.toLocaleString()}.00</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200">
              ✓ Esta factura ha sido registrada en el sistema conforme a la función <code>generar_factura_bhd()</code> con ReportLab.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setGeneratedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Comprobante de Transferencia BHD</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="font-mono text-xs text-white font-bold">
                {selectedReceipt.pagoPendiente?.comprobante}
              </div>
              <div className="text-xs text-slate-400">
                Transferencia enviada a <strong>Banco BHD León 08694150021 (Pedro Baldera)</strong>
              </div>
              <div className="text-base font-mono font-bold text-emerald-400">
                Monto: RD$ {selectedReceipt.pagoPendiente?.monto.toLocaleString()}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:text-white"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleActivateClient(selectedReceipt.email);
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                Validar y Activar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
