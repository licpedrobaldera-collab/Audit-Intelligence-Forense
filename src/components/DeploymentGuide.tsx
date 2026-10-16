import React, { useState } from 'react';
import { Terminal, Globe, Server, Shield, Check, Copy, AlertCircle, ArrowRight, ExternalLink, Cpu, GitBranch, Sparkles } from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const CLOUDFLARE_SNIPPET = `# 1. Descargar e instalar Cloudflare Tunnel (cloudflared)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# 2. Autenticar con tu cuenta de Cloudflare
cloudflared tunnel login

# 3. Crear el túnel 'audit-trial'
cloudflared tunnel create audit-trial

# 4. Configurar DNS automáticamente en Cloudflare
cloudflared tunnel route dns audit-trial audit-intelligence-usa.com
cloudflared tunnel route dns audit-trial trial.audit-intelligence-usa.com

# 5. Crear archivo de configuración ~/.cloudflared/config.yml
mkdir -p ~/.cloudflared
cat << 'EOF' > ~/.cloudflared/config.yml
tunnel: audit-trial
credentials-file: /root/.cloudflared/audit-trial.json

ingress:
  - hostname: audit-intelligence-usa.com/trial
    service: http://localhost:5000   # tu ruta de prueba 3 días Flask
  - hostname: audit-intelligence-usa.com
    service: http://localhost:5000   # o http://localhost:8501 si usas Streamlit
  - hostname: trial.audit-intelligence-usa.com
    service: http://localhost:5000
  - service: http_status:404
EOF

# 6. Iniciar el túnel en vivo
cloudflared tunnel run audit-trial`;

  const GIT_PUSH_SNIPPET = `# 1. Clonar o entrar a tu repositorio existente
cd BASA_V7-system-

# 2. Copiar los archivos corregidos de BASA_V7_Audit_Intelligence_Full_Package.zip
cp -r /ruta/a/descargas/* .

# 3. Guardar cambios y subir a GitHub
git add app.py requirements.txt storage/ config.yml setup_tunnel.sh README.md
git commit -m "feat: Integrar control de 3 dias para /trial, Cloudflare Tunnel y correccion app.py"
git push origin main`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Globe className="w-3.5 h-3.5" />
          CLOUDFLARE TUNNEL &amp; DNS AUTOMÁTICO // https://audit-intelligence-usa.com/trial
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Integración con GitHub BASA_V7 y Cloudflare Tunnel
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Instrucciones exactas para enlazar tu repositorio <a href="https://github.com/balderasantosyasociados/BASA_V7-system-/tree/main" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-mono">balderasantosyasociados/BASA_V7-system-</a> con Cloudflare Tunnel para que cualquier visitante en <strong className="text-white">https://audit-intelligence-usa.com/trial</strong> acceda de forma segura a tu servidor local.
        </p>
      </div>

      {/* GitHub Integration Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
            <GitBranch className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs font-mono text-indigo-300 font-bold block">
              Repositorio Destino Conectado:
            </span>
            <span className="text-sm font-bold text-white font-mono">
              https://github.com/balderasantosyasociados/BASA_V7-system-
            </span>
          </div>
        </div>

        <a
          href="https://github.com/balderasantosyasociados/BASA_V7-system-/tree/main"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <span>Abrir en GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Step by Step Execution Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left selector */}
        <div className="lg:col-span-4 space-y-2">
          <button
            onClick={() => setActiveStep(1)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              activeStep === 1
                ? 'bg-cyan-950/70 border-cyan-500/50 text-white shadow-md shadow-cyan-950/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            <div className="text-xs font-mono font-bold text-cyan-400 mb-1">PASO 1 (CLOUDFLARE)</div>
            <div className="text-sm font-bold">Snippet de Túnel &amp; DNS Automático</div>
            <div className="text-xs text-slate-400 mt-1">cloudflared, config.yml y registros CNAME</div>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              activeStep === 2
                ? 'bg-cyan-950/70 border-cyan-500/50 text-white shadow-md shadow-cyan-950/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            <div className="text-xs font-mono font-bold text-cyan-400 mb-1">PASO 2 (GITHUB BASA_V7)</div>
            <div className="text-sm font-bold">Subir Archivos al Repositorio</div>
            <div className="text-xs text-slate-400 mt-1">git commit &amp; push a branch main</div>
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              activeStep === 3
                ? 'bg-cyan-950/70 border-cyan-500/50 text-white shadow-md shadow-cyan-950/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            <div className="text-xs font-mono font-bold text-cyan-400 mb-1">PASO 3 (EJECUCIÓN)</div>
            <div className="text-sm font-bold">Iniciar app.py y Comprobar /trial</div>
            <div className="text-xs text-slate-400 mt-1">Prueba los 3 días y el pago a BHD León</div>
          </button>
        </div>

        {/* Right instructions */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>Snippet de Integración con Cloudflare Tunnel</span>
                </h3>

                <button
                  onClick={() => copyText(CLOUDFLARE_SNIPPET, 'cloudflare')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedIndex === 'cloudflare' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 'cloudflare' ? '¡Copiado!' : 'Copiar Snippet'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Ejecuta este bloque en la terminal de tu máquina o servidor local. Se encarga de descargar <code className="text-cyan-300">cloudflared</code>, crear el túnel <code className="text-amber-300">audit-trial</code>, generar el archivo <code className="text-slate-200">~/.cloudflared/config.yml</code> y configurar las rutas DNS automáticamente en Cloudflare:
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-96">
                <pre>{CLOUDFLARE_SNIPPET}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Rutas expuestas automáticamente:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li><strong>https://audit-intelligence-usa.com/trial</strong> &rarr; Puerto 5000 (Ruta de Registro de 3 Días)</li>
                  <li><strong>https://audit-intelligence-usa.com</strong> &rarr; Puerto 5000 / 8501</li>
                  <li><strong>https://trial.audit-intelligence-usa.com</strong> &rarr; Subdominio alternativo con SSL</li>
                </ul>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-indigo-400" />
                  <span>Subir Archivos a GitHub (balderasantosyasociados/BASA_V7-system-)</span>
                </h3>

                <button
                  onClick={() => copyText(GIT_PUSH_SNIPPET, 'git')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedIndex === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 'git' ? '¡Copiado!' : 'Copiar Comandos'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Descarga el archivo <strong className="text-amber-300">BASA_V7_Audit_Intelligence_Full_Package.zip</strong> desde la pestaña "Descargar ZIP BASA V7", descomprímelo dentro de tu carpeta de repositorio y ejecuta:
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
                <pre>{GIT_PUSH_SNIPPET}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <span className="font-bold text-white block">Archivos que se actualizarán en GitHub:</span>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400">
                  <div>• <code className="text-cyan-300">app.py</code> (v7.0 con /trial corregido)</div>
                  <div>• <code className="text-cyan-300">requirements.txt</code> (sin conflictos)</div>
                  <div>• <code className="text-cyan-300">storage/clientes.json</code> (persistencia)</div>
                  <div>• <code className="text-cyan-300">config.yml</code> (Cloudflare Tunnel)</div>
                  <div>• <code className="text-cyan-300">setup_tunnel.sh</code> (instalador auto)</div>
                  <div>• <code className="text-cyan-300">README.md</code> (documentación)</div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Paso 3: Verificación del Control de 3 Días y Pago BHD León</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-sm block">1. Prueba del Registro:</span>
                  <p>
                    Visita <strong>https://audit-intelligence-usa.com/trial</strong>. Completa el formulario de email y contraseña. El sistema creará al usuario con <code className="text-cyan-300">fecha_registro = ahora</code> y <code className="text-amber-300">estado_pago = False</code>.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-sm block">2. Comprobación del Bloqueo:</span>
                  <p>
                    Si un usuario intenta ejecutar auditorías después de transcurridas 72 horas (o si editas la fecha en <code className="text-slate-400">storage/clientes.json</code> para simular 4 días), el decorador de Python bloqueará inmediatamente la llamada con código <strong>403 TRIAL_EXPIRADO</strong> y mostrará los datos de pago al <strong>Banco BHD León (Cuenta 08694150021 - Pedro Baldera)</strong>.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-sm block">3. Activación y Factura PDF:</span>
                  <p>
                    Cuando el cliente envíe su comprobante, Pedro Baldera puede activar su cuenta inmediatamente haciendo una llamada a:
                    <code className="text-emerald-400 block mt-1 font-mono">POST /api/admin/activar/correo_cliente@ejemplo.com</code>
                    Esto generará la factura oficial en PDF con ReportLab y enviará la notificación por WhatsApp a <strong>+1 829-771-7390</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
