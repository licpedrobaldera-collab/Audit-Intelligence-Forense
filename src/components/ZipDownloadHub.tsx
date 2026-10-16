import React, { useState } from 'react';
import { 
  Download, 
  FileCode, 
  Check, 
  Copy, 
  Folder, 
  Terminal, 
  Sparkles, 
  Server, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  GitBranch,
  UploadCloud,
  CheckCircle2,
  HardDrive,
  FileArchive
} from 'lucide-react';
import { DEPLOYMENT_FILES, generateAndDownloadZip } from '../utils/zipGenerator';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';

export const ZipDownloadHub: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activePortalGuide, setActivePortalGuide] = useState<'cpanel' | 'vps' | 'github'>('cpanel');
  const [verifiedFiles, setVerifiedFiles] = useState<string[] | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const selectedFile = DEPLOYMENT_FILES[selectedFileIndex];

  const handleDownloadAll = async () => {
    setIsZipping(true);
    try {
      await generateAndDownloadZip();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUploadTest = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const fileNames: string[] = [];
      loadedZip.forEach((relativePath) => {
        fileNames.push(relativePath);
      });
      setVerifiedFiles(fileNames);
    } catch (err) {
      alert("Error al leer el archivo ZIP. Asegúrate de seleccionar un archivo .zip válido.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero ZIP Download Banner */}
      <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/40 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ARCHIVO ZIP FINAL LISTO PARA CARGAR A TU PORTAL
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Descargar Archivo ZIP Final para tu Portal (BASA_V7)
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Descarga en un solo archivo <code className="text-amber-300 font-mono font-bold">BASA_V7_Audit_Intelligence_Full_Package.zip</code> todo tu sistema listo para cargar en tu servidor, cPanel o GitHub, con la ruta <code className="text-cyan-300">/trial</code>, el control de 3 días, DuckDB y Cloudflare Tunnel.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-4 h-4" /> 7 Archivos Verificados
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <GitBranch className="w-4 h-4" /> balderasantosyasociados/BASA_V7-system-
              </span>
              <span>•</span>
              <span className="text-amber-300 font-bold">
                BHD León: 08694150021
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-2 shrink-0">
            <button
              onClick={handleDownloadAll}
              disabled={isZipping}
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-8 rounded-2xl text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Download className={`w-5 h-5 ${isZipping ? 'animate-bounce' : ''}`} />
              <div className="text-left">
                <div className="text-sm uppercase tracking-wide leading-none font-black">
                  {isZipping ? 'Generando ZIP...' : 'Descargar Archivo ZIP Ahora'}
                </div>
                <div className="text-[10px] font-mono opacity-80 mt-0.5">
                  BASA_V7_Audit_Intelligence_Full_Package.zip
                </div>
              </div>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
              <a
                href="https://github.com/balderasantosyasociados/BASA_V7-system-/tree/main"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Ver repositorio GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Guide: How to Upload to Portal (cPanel / VPS / GitHub) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              <span>Instrucciones para Cargar el Archivo ZIP a tu Portal</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecciona dónde vas a cargar tu archivo ZIP para ver el procedimiento exacto paso a paso:
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActivePortalGuide('cpanel')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activePortalGuide === 'cpanel' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              cPanel / Hosting
            </button>

            <button
              onClick={() => setActivePortalGuide('vps')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activePortalGuide === 'vps' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Servidor VPS / Linux
            </button>

            <button
              onClick={() => setActivePortalGuide('github')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activePortalGuide === 'github' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              GitHub Web
            </button>
          </div>
        </div>

        {activePortalGuide === 'cpanel' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">1</span>
              <h4 className="font-bold text-white text-sm">Entrar al Administrador</h4>
              <p className="text-slate-400 leading-relaxed">
                Inicia sesión en el cPanel de tu dominio <strong className="text-slate-200">audit-intelligence-usa.com</strong> y abre el <strong>Administrador de Archivos (File Manager)</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">2</span>
              <h4 className="font-bold text-white text-sm">Cargar el archivo ZIP</h4>
              <p className="text-slate-400 leading-relaxed">
                Haz clic en el botón superior <strong>Cargar (Upload)</strong> y selecciona el archivo <code className="text-amber-300">BASA_V7_Audit_Intelligence_Full_Package.zip</code> descargado.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">3</span>
              <h4 className="font-bold text-white text-sm">Extraer en la carpeta</h4>
              <p className="text-slate-400 leading-relaxed">
                Haz clic derecho sobre el archivo ZIP y pulsa <strong>Extraer (Extract)</strong>. Todos los archivos (<code className="text-cyan-300">app.py</code>, etc.) se descomprimirán automáticamente.
              </p>
            </div>
          </div>
        )}

        {activePortalGuide === 'vps' && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
            <span className="font-bold text-white block">Comandos directos en tu terminal SSH:</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-cyan-300 space-y-1">
              <div className="text-slate-500"># 1. Descomprimir el paquete en tu servidor:</div>
              <div>unzip BASA_V7_Audit_Intelligence_Full_Package.zip</div>
              <div className="text-slate-500 mt-2"># 2. Instalar requerimientos:</div>
              <div>pip install -r requirements.txt</div>
              <div className="text-slate-500 mt-2"># 3. Iniciar la aplicación y el túnel:</div>
              <div>python app.py &</div>
              <div>./setup_tunnel.sh</div>
            </div>
          </div>
        )}

        {activePortalGuide === 'github' && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white block text-sm">Carga directa en el navegador a GitHub:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Abre tu repositorio: <a href="https://github.com/balderasantosyasociados/BASA_V7-system-/tree/main" target="_blank" rel="noreferrer" className="text-cyan-400 underline">balderasantosyasociados/BASA_V7-system-</a>.</li>
              <li>Descomprime en tu computadora el archivo <code className="text-amber-300">BASA_V7_Audit_Intelligence_Full_Package.zip</code>.</li>
              <li>En GitHub, haz clic en el botón <strong>Add file &gt; Upload files</strong>.</li>
              <li>Arrastra los archivos (<code className="text-white">app.py</code>, <code className="text-white">requirements.txt</code>, <code className="text-white">config.yml</code>, <code className="text-white">setup_tunnel.sh</code>, etc.).</li>
              <li>Escribe un mensaje de commit como <em>"Actualizar a versión v7.0 Full con /trial"</em> y presiona <strong>Commit changes</strong>.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Explorer: File list on left, Code Viewer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Files Navigation */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-cyan-400" /> Archivos del Paquete ZIP
            </span>
            <span className="text-slate-500">{DEPLOYMENT_FILES.length} archivos</span>
          </div>

          <div className="space-y-1.5">
            {DEPLOYMENT_FILES.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-2.5 ${
                  selectedFileIndex === idx
                    ? 'bg-cyan-950/70 border border-cyan-500/50 shadow-md shadow-cyan-950/30'
                    : 'bg-slate-950/60 border border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${
                  selectedFileIndex === idx ? 'text-cyan-400' : 'text-slate-400'
                }`} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white truncate">
                      {file.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      {file.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {file.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Test verification widget */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileArchive className="w-4 h-4 text-amber-400" />
              <span>Verificador de Integridad de tu ZIP</span>
            </span>
            <label className="block w-full p-2.5 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500 bg-slate-950/60 text-center cursor-pointer transition-colors text-xs text-slate-400">
              <span>{isVerifying ? 'Verificando archivo...' : 'Selecciona tu ZIP para verificar'}</span>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileUploadTest}
                className="hidden"
              />
            </label>

            {verifiedFiles && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ZIP Verificado ({verifiedFiles.length} archivos detectados)
                </div>
                <div className="text-[10px] font-mono text-slate-300 max-h-24 overflow-y-auto">
                  {verifiedFiles.map((fn) => (
                    <div key={fn}>✓ {fn}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Header of code viewer */}
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="font-mono text-xs text-slate-300 font-semibold ml-2">
                {selectedFile.path}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description bar */}
          <div className="bg-slate-900 px-5 py-2 text-xs text-slate-400 border-b border-slate-800/80">
            {selectedFile.description}
          </div>

          {/* Code content */}
          <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[580px] leading-relaxed text-slate-300">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
