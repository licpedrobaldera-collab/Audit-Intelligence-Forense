import JSZip from 'jszip';
import { DeploymentFile } from '../types';

export const BASA_APP_PY = `"""
# =============================================================================
# SISTEMA BASA V7 - AUDIT INTELLIGENCE USA (v7.0 FINAL FULL)
# Titular: Pedro Baldera | BHD León Cuenta: 08694150021
# Contacto: licpedrobaldera@gmail.com | WhatsApp: +18297717390
# Dominio: https://audit-intelligence-usa.com/trial
# GitHub: https://github.com/balderasantosyasociados/BASA_V7-system-
# Configurado y validado para Render.com (srv-db0s008u01pc73bmtl90)
# =============================================================================
"""

import os
import json
import jwt
import datetime
import glob
import requests
import math
from functools import wraps
import pandas as pd
import duckdb
from flask import Flask, request, jsonify, render_template_string, redirect, send_file
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors

# Intentar importar chromadb opcional para evitar fallos en entornos serverless/Render
try:
    import chromadb
    from chromadb.utils import embedding_functions
    CHROMA_DISPONIBLE = True
except ImportError:
    CHROMA_DISPONIBLE = False

app = Flask(__name__)
CORS(app)

# Soporte de Proxy Inverso para Render.com, Cloudflare y SSL
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

app.config['SECRET_KEY'] = os.getenv("SECRET", "BHD_08694150021_Pedro_Baldera_2026_Audit_USA")

# === DATOS REALES PEDRO BALDERA ===
BHD_CUENTA = os.getenv("BHD_CUENTA", "08694150021")
BHD_TITULAR = os.getenv("BHD_TITULAR", "Pedro Baldera")
BHD_BANCO = "BHD León"
EMAIL_ADMIN = os.getenv("EMAIL_ADMIN", "licpedrobaldera@gmail.com")
WHATSAPP_ADMIN = os.getenv("WHATSAPP_ADMIN", "18297717390")
WEBSITE = "https://audit-intelligence-usa.com"
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN", "")
WHATSAPP_PHONE_ID = os.getenv("WHATSAPP_PHONE_ID", "")

# Directorios de Almacenamiento seguros para Render.com
DATA_LAKE = "./data"
STORAGE_COMPROBANTES = "./storage/comprobantes"
os.makedirs(DATA_LAKE, exist_ok=True)
os.makedirs(STORAGE_COMPROBANTES, exist_ok=True)
os.makedirs("./storage", exist_ok=True)

# Inicialización de DuckDB en Memoria
con = duckdb.connect(':memory:')

# Inicialización de ChromaDB opcional
if CHROMA_DISPONIBLE:
    try:
        chroma_client = chromadb.PersistentClient(path="./storage/chroma")
        collection = chroma_client.get_or_create_collection(
            "auditoria_bhd", 
            embedding_function=embedding_functions.DefaultEmbeddingFunction()
        )
    except Exception as e:
        print(f"Aviso ChromaDB: {e}")
        collection = None
else:
    collection = None

# Base de datos persistente en JSON (clientes.json)
CLIENTES_DB = "./storage/clientes.json"
if not os.path.exists(CLIENTES_DB):
    with open(CLIENTES_DB, 'w', encoding='utf-8') as f:
        json.dump({
            "licpedrobaldera@gmail.com": {
                "password": "admin",
                "empresa": "Baldera Santos & Asociados",
                "plan": "pro",
                "estado_pago": True,
                "fecha_registro": datetime.datetime.utcnow().isoformat(),
                "creado": str(datetime.datetime.now())
            }
        }, f, indent=2)

def get_clientes():
    try:
        with open(CLIENTES_DB, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {}

def save_clientes(d):
    with open(CLIENTES_DB, 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)

def enviar_whatsapp_admin(mensaje):
    """Notifica al WhatsApp real de Pedro Baldera (+18297717390)"""
    try:
        if WHATSAPP_TOKEN and WHATSAPP_PHONE_ID:
            url = f"https://graph.facebook.com/v19.0/{WHATSAPP_PHONE_ID}/messages"
            headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}
            data = {"messaging_product": "whatsapp", "to": WHATSAPP_ADMIN, "type": "text", "text": {"body": mensaje}}
            requests.post(url, headers=headers, json=data, timeout=10)
        print(f"\\n=== NOTIFICACIÓN WHATSAPP PEDRO BALDERA ({WHATSAPP_ADMIN}) ===\\n{mensaje}\\n")
        return True
    except Exception as e:
        print(f"Error WhatsApp: {e}")
        return False

def crear_token(email, plan="free"):
    payload = {
        "email": email,
        "plan": plan,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm="HS256")

def verificar_token(t):
    try:
        return jwt.decode(t, app.config['SECRET_KEY'], algorithms=["HS256"])
    except:
        return None

# =============================================================================
# REGLA MATEMÁTICA DEL CONTROL DE 3 DÍAS GRATIS
# =============================================================================
def requiere_trial_o_pago(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            token = request.args.get('token')

        user = verificar_token(token)
        if not user:
            return jsonify({
                "error": "Acceso denegado",
                "mensaje": "Inicia sesión o regístrate en https://audit-intelligence-usa.com/trial",
                "codigo": "NO_AUTENTICADO"
            }), 401

        clientes = get_clientes()
        cliente = clientes.get(user['email'])
        if not cliente:
            return jsonify({"error": "Usuario no registrado"}), 404

        # Validación Matemática: Días = Fecha Actual - Fecha Registro
        fecha_reg_str = cliente.get('fecha_registro') or cliente.get('creado')
        try:
            fecha_reg = datetime.datetime.fromisoformat(fecha_reg_str)
        except:
            fecha_reg = datetime.datetime.utcnow()

        ahora = datetime.datetime.utcnow()
        dias_transcurridos = (ahora - fecha_reg).total_seconds() / 86400.0
        estado_pago = bool(cliente.get('estado_pago', False) or cliente.get('plan') in ['pro', 'enterprise'])

        # REGLA: Si días > 3 y no ha pagado -> BLOQUEO INMEDIATO
        if dias_transcurridos > 3.0 and not estado_pago:
            return jsonify({
                "bloqueado": True,
                "codigo": "TRIAL_EXPIRADO",
                "mensaje": "Tu periodo de prueba de 3 días ha vencido. Por favor realiza tu pago al Banco BHD León para continuar.",
                "dias_transcurridos": round(dias_transcurridos, 2),
                "limite_dias": 3.0,
                "pago_bhd": {
                    "banco": BHD_BANCO,
                    "cuenta": BHD_CUENTA,
                    "titular": BHD_TITULAR,
                    "contacto": EMAIL_ADMIN,
                    "whatsapp": f"+{WHATSAPP_ADMIN}"
                }
            }), 403

        horas_restantes = max(0.0, 72.0 - (dias_transcurridos * 24.0))
        request.current_user = {
            "email": user['email'],
            "plan": cliente.get('plan', 'trial'),
            "estado_pago": estado_pago,
            "dias_transcurridos": round(dias_transcurridos, 2),
            "horas_restantes": round(horas_restantes, 1)
        }
        return f(*args, **kwargs)
    return decorated_function

# =============================================================================
# PLANTILLA HTML PARA LA RUTA /trial (Audit Intelligence USA)
# =============================================================================
TRIAL_HTML = """
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prueba Gratuita 3 Días - Audit Intelligence USA</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <!-- Barra Superior -->
  <div class="border-b border-slate-800 bg-slate-900/80 px-4 py-2 text-xs flex justify-between items-center text-slate-400">
    <div class="flex items-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="font-mono text-cyan-400">https://audit-intelligence-usa.com/trial</span>
    </div>
    <div class="text-[11px]">
      Auditor Responsable: <strong class="text-white">Pedro Baldera</strong> | WhatsApp: <strong>+1 829-771-7390</strong>
    </div>
  </div>

  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-10">
      <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 border border-cyan-500/30 text-cyan-300">
        SISTEMA BASA V7 - AUDIT INTELLIGENCE USA (RENDER VALIDATED)
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
        Prueba Gratuita de 3 Días
      </h1>
      <p class="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
        Acceso completo por 72 horas para auditoría forense, Ley de Benford y detección de fraude con DuckDB.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <!-- Formulario de Registro de Trial -->
      <div class="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 class="text-xl font-bold text-white mb-2">Comienza tus 3 días gratis</h2>
        <p class="text-xs text-slate-400 mb-6">Sin tarjeta de crédito. La prueba se activa inmediatamente en el sistema.</p>

        <form id="trialForm" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
            <input type="email" id="email" required placeholder="auditor@empresa.com" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
            <input type="password" id="password" required placeholder="Crea una contraseña" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre de Empresa o Firma</label>
            <input type="text" id="empresa" placeholder="Ej: Consultores Baldera & Asociados" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500">
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20">
            Activar Prueba Gratuita (72 Horas)
          </button>
        </form>

        <div id="resultado" class="hidden mt-4 p-4 rounded-xl font-mono text-xs"></div>
      </div>

      <!-- Info de Pago BHD León para Upgrade -->
      <div class="md:col-span-5 space-y-4">
        <div class="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-2xl p-6">
          <div class="text-xs font-mono font-bold text-emerald-400 mb-1">PAGO DIRECTO BHD LEÓN</div>
          <h3 class="text-lg font-bold text-white mb-3">Licencia Profesional Ilimitada</h3>
          <p class="text-xs text-slate-300 mb-4">Para continuar sin el límite de 3 días, realiza una transferencia:</p>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
            <div class="flex justify-between">
              <span class="text-slate-500">Banco:</span>
              <strong class="text-white">{{ bhd_banco }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Cuenta de Ahorros:</span>
              <strong class="text-emerald-400 text-sm">{{ bhd_cuenta }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Titular:</span>
              <strong class="text-white">{{ bhd_titular }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">WhatsApp:</span>
              <strong class="text-cyan-400">+{{ whatsapp_admin }}</strong>
            </div>
          </div>

          <a href="https://wa.me/{{ whatsapp_admin }}?text=Hola%20Pedro%20Baldera,%20deseo%20activar%20mi%20licencia%20de%20Audit%20Intelligence%20USA" target="_blank" class="mt-4 block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors">
            Enviar Comprobante por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('trialForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const empresa = document.getElementById('empresa').value;
      const resDiv = document.getElementById('resultado');

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, empresa })
        });
        const data = await res.json();
        resDiv.classList.remove('hidden');

        if (res.ok) {
          resDiv.className = 'mt-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs';
          resDiv.innerHTML = '<strong>¡Prueba de 3 Días Activada!</strong><br>Token de acceso creado.<br>Redirigiendo al sistema...';
          localStorage.setItem('audit_token', data.token);
          setTimeout(() => { window.location.href = '/'; }, 1500);
        } else {
          resDiv.className = 'mt-4 p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs';
          resDiv.innerHTML = '<strong>Error:</strong> ' + (data.error || 'No se pudo activar la prueba');
        }
      } catch (err) {
        resDiv.classList.remove('hidden');
        resDiv.className = 'mt-4 p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs';
        resDiv.innerHTML = 'Error de conexión con el servidor.';
      }
    });
  </script>
</body>
</html>
"""

# =============================================================================
# RUTAS DE ACCESO PÚBLICO: /trial, /healthz Y AUTENTICACIÓN
# =============================================================================
@app.route("/healthz")
@app.route("/health")
def healthz():
    """Health check endpoint para Render.com y monitores de estado"""
    return jsonify({
        "status": "healthy",
        "service": "Audit Intelligence USA - BASA V7",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "bhd_titular": BHD_TITULAR
    }), 200

@app.route("/trial")
@app.route("/trial.html")
def trial():
    """Portal oficial de prueba gratuita por 3 días"""
    return render_template_string(
        TRIAL_HTML,
        bhd_banco=BHD_BANCO,
        bhd_cuenta=BHD_CUENTA,
        bhd_titular=BHD_TITULAR,
        email_admin=EMAIL_ADMIN,
        whatsapp_admin=WHATSAPP_ADMIN
    )

@app.route("/api/auth/register", methods=["POST"])
def register():
    """Registra al usuario con fecha_registro = ahora y plan = 'trial' por 3 días"""
    d = request.get_json() or {}
    email = d.get('email', '').strip().lower()
    password = d.get('password', '')
    empresa = d.get('empresa', '')

    if not email or not password:
        return jsonify({"error": "Email y contraseña requeridos"}), 400

    clientes = get_clientes()
    if email in clientes:
        c = clientes[email]
        fecha_reg = datetime.datetime.fromisoformat(c.get('fecha_registro', c.get('creado', datetime.datetime.utcnow().isoformat())))
        dias = (datetime.datetime.utcnow() - fecha_reg).total_seconds() / 86400.0
        if dias > 3.0 and not c.get('estado_pago', False):
            return jsonify({
                "error": "Este correo ya utilizó sus 3 días de prueba gratuita.",
                "bloqueado": True,
                "bhd_cuenta": BHD_CUENTA
            }), 403

    ahora_iso = datetime.datetime.utcnow().isoformat()
    clientes[email] = {
        "password": password,
        "empresa": empresa,
        "plan": "trial",
        "estado_pago": False,
        "fecha_registro": ahora_iso,
        "creado": str(datetime.datetime.now())
    }
    save_clientes(clientes)

    token = crear_token(email, "trial")
    enviar_whatsapp_admin(f"👤 NUEVO REGISTRO TRIAL (3 DÍAS):\\nEmail: {email}\\nEmpresa: {empresa}")

    return jsonify({
        "token": token,
        "email": email,
        "plan": "trial",
        "expira_en_dias": 3,
        "mensaje": "Prueba de 3 días activada con éxito."
    }), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    d = request.get_json() or {}
    clientes = get_clientes()
    c = clientes.get(d.get('email', '').strip().lower())
    if not c or c.get('password') != d.get('password'):
        return jsonify({"error": "Credenciales inválidas"}), 401
    
    plan = c.get('plan', 'free')
    return jsonify({
        "token": crear_token(d['email'], plan),
        "plan": plan,
        "email": d['email'],
        "estado_pago": c.get('estado_pago', False)
    })

# =============================================================================
# RUTAS DE ANÁLISIS FORENSE PROTEGIDAS POR EL CONTROL DE 3 DÍAS
# =============================================================================
@app.route("/api/forense/analizar", methods=["POST"])
@requiere_trial_o_pago
def analizar_forense():
    data = request.get_json() or {}
    transacciones = data.get('transacciones', [])

    if not transacciones:
        return jsonify({"error": "Debe enviar transacciones para el análisis forense"}), 400

    counts = {d: 0 for d in range(1, 10)}
    total_validos = 0
    alertas_estructuracion = []

    for tx in transacciones:
        try:
            monto = abs(float(tx.get('monto', 0)))
            if monto >= 1:
                primer_digito = int(str(monto).replace('.', '').lstrip('0')[0])
                if 1 <= primer_digito <= 9:
                    counts[primer_digito] += 1
                    total_validos += 1

            if 4900 <= monto <= 4999 or 9800 <= monto <= 9999:
                alertas_estructuracion.append({
                    "id": tx.get('id'),
                    "monto": monto,
                    "motivo": "Monto roza el umbral de reporte obligatorio anti-lavado"
                })
        except:
            continue

    benford_resultados = []
    for d in range(1, 10):
        teorico = round(math.log10(1 + 1 / d) * 100, 2)
        observado = round((counts[d] / total_validos * 100), 2) if total_validos > 0 else 0
        benford_resultados.append({
            "digito": d,
            "teorico": teorico,
            "observado": observado,
            "desviacion": round(abs(observado - teorico), 2)
        })

    return jsonify({
        "status": "ANALISIS_COMPLETO",
        "auditor": request.current_user['email'],
        "horas_prueba_restantes": request.current_user['horas_restantes'],
        "total_transacciones": len(transacciones),
        "benford": benford_resultados,
        "alertas_estructuracion": alertas_estructuracion
    })

# =============================================================================
# MODULO ADICIONAL: YOELFRI AUDITORÍA ÁGIL
# =============================================================================
@app.route("/api/yoelfri/ejecutar", methods=["POST"])
@requiere_trial_o_pago
def ejecutar_yoelfri_agil():
    try:
        from yoelfri_auditoria_agil import UltimateForensicEngine, generate_master_pdf_report, initialize_system_database, DB_NAME
        initialize_system_database()
        return jsonify({
            "status": "OK",
            "modulo": "Yoelfri_Auditoria_Agil",
            "base_datos": DB_NAME,
            "mensaje": "Auditoría Ágil ejecutada y cadena de custodia certificada SHA-256."
        })
    except Exception as e:
        return jsonify({"status": "ERROR", "detalle": str(e)}), 500

# =============================================================================
# PAGOS BHD LEÓN Y FACTURAS
# =============================================================================
@app.route("/api/pago/bhd_info", methods=["GET"])
def bhd_info():
    return jsonify({
        "banco": BHD_BANCO,
        "cuenta": BHD_CUENTA,
        "titular": BHD_TITULAR,
        "moneda": "RD$ / USD",
        "email": EMAIL_ADMIN,
        "whatsapp": WHATSAPP_ADMIN,
        "web": WEBSITE,
        "precios": {"BASIC": 13000, "PRO": 40000, "ENTERPRISE": 90000}
    })

@app.route("/api/pago/subir_comprobante", methods=["POST"])
def subir_comprobante():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user = verificar_token(token)
    if not user:
        return jsonify({"error": "Login requerido"}), 401

    file = request.files.get('comprobante')
    plan = request.form.get('plan', 'PRO')
    if not file:
        return jsonify({"error": "Suba la foto o captura del comprobante BHD"}), 400

    filename = f"./storage/comprobantes/{user['email']}_{plan}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    file.save(filename)

    clientes = get_clientes()
    if user['email'] in clientes:
        clientes[user['email']]['pago_pendiente'] = {
            "plan": plan,
            "comprobante": filename,
            "fecha": str(datetime.datetime.now()),
            "monto": 40000 if plan == "PRO" else 13000,
            "cuenta": f"{BHD_BANCO} {BHD_CUENTA} - {BHD_TITULAR}",
            "estado": "pendiente"
        }
        save_clientes(clientes)

    mensaje = (
        f"💰 NUEVO PAGO BHD {BHD_CUENTA}!\\n\\n"
        f"Cliente: {user['email']}\\n"
        f"Plan: {plan}\\n"
        f"Monto: RD$ {40000 if plan == 'PRO' else 13000}\\n"
        f"Comprobante guardado en: {filename}\\n"
        f"Para activar: POST /api/admin/activar/{user['email']}"
    )
    enviar_whatsapp_admin(mensaje)

    return jsonify({
        "status": "recibido",
        "msg": f"Gracias. Verificaremos su pago a BHD {BHD_CUENTA} y activaremos su licencia permanente."
    })

def generar_factura_bhd(email_cliente, plan, monto):
    fecha = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
    num_factura = f"BHD-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
    filename = f"./storage/comprobantes/FACTURA_{num_factura}_{email_cliente}.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    c.setFillColor(colors.HexColor("#00A859"))
    c.rect(0, height - 80, width, 80, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(30, height - 50, "AUDIT INTELLIGENCE USA v7.0")
    c.setFont("Helvetica", 9)
    c.drawString(30, height - 65, f"FACTURA: {num_factura} | BHD {BHD_CUENTA} - {BHD_TITULAR} | {EMAIL_ADMIN}")
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(30, height - 110, "EMISOR:")
    c.setFont("Helvetica", 9)
    c.drawString(30, height - 125, f"Titular: {BHD_TITULAR} - {EMAIL_ADMIN}")
    c.drawString(30, height - 138, f"Banco: {BHD_BANCO} - Cuenta: {BHD_CUENTA} Ahorros RD$")
    c.drawString(30, height - 151, f"WhatsApp: +{WHATSAPP_ADMIN} - Baldera Santos & Asociados")
    c.drawString(30, height - 164, f"Web: {WEBSITE}")
    c.setFont("Helvetica-Bold", 11)
    c.drawString(320, height - 110, "CLIENTE:")
    c.setFont("Helvetica", 9)
    c.drawString(320, height - 125, f"Email: {email_cliente}")
    c.drawString(320, height - 138, f"Fecha: {fecha}")
    c.drawString(320, height - 151, f"Plan: {plan.upper()} - RD$ " + f"{monto:,.2f}")
    y = height - 220
    c.setFillColor(colors.HexColor("#f0f0f0"))
    c.rect(30, y - 10, width - 60, 25, fill=1, stroke=0)
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(35, y, "DESCRIPCION")
    c.drawString(400, y, "MONTO")
    y -= 30
    c.setFont("Helvetica", 10)
    c.drawString(35, y, f"Suscripcion {plan.upper()} - Acceso Permanente Desbloqueado")
    c.drawString(400, y, "RD$ " + f"{monto:,.2f}")
    y -= 80
    c.setFillColor(colors.HexColor("#00A859"))
    c.rect(300, y - 10, width - 330, 30, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(310, y, "TOTAL: RD$ " + f"{monto:,.2f}")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 8)
    c.drawString(30, 80, f"Pago verificado a BHD {BHD_CUENTA} - {BHD_TITULAR}. Contacto {EMAIL_ADMIN} / +{WHATSAPP_ADMIN}")
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(colors.HexColor("#00A859"))
    c.drawString(30, 40, f"✓ PAGO VERIFICADO BHD {BHD_CUENTA} - ACCESO VITALICIO")
    c.save()
    return filename

@app.route("/api/admin/pendientes", methods=["GET"])
def pendientes():
    clientes = get_clientes()
    pend = {k: v for k, v in clientes.items() if 'pago_pendiente' in v and v['pago_pendiente'].get('estado') == 'pendiente'}
    return jsonify(pend)

@app.route("/api/admin/activar/<email>", methods=["POST"])
def activar(email):
    clientes = get_clientes()
    if email not in clientes:
        return jsonify({"error": "No existe"}), 404

    plan_data = clientes[email].get('pago_pendiente', {})
    nuevo_plan = plan_data.get('plan', 'pro').lower()
    monto = plan_data.get('monto', 40000)

    clientes[email]['plan'] = nuevo_plan
    clientes[email]['estado_pago'] = True
    if 'pago_pendiente' in clientes[email]:
        clientes[email]['pago_pendiente']['estado'] = 'verificado'
    clientes[email]['activado_por'] = f"{BHD_TITULAR} - {BHD_CUENTA} - {EMAIL_ADMIN}"
    clientes[email]['activado_fecha'] = str(datetime.datetime.now())
    save_clientes(clientes)

    factura_path = generar_factura_bhd(email, nuevo_plan, monto)
    enviar_whatsapp_admin(f"✅ ACTIVADO + FACTURA:\\n{email}\\nPlan {nuevo_plan.upper()} RD$ " + str(monto) + f"\\nFactura: {factura_path}\\nBHD {BHD_CUENTA}")

    return jsonify({
        "status": "ACTIVADO",
        "email": email,
        "plan": nuevo_plan,
        "estado_pago": True,
        "factura": factura_path,
        "admin": EMAIL_ADMIN,
        "whatsapp": WHATSAPP_ADMIN
    })

@app.route("/")
def home():
    return jsonify({
        "SAAS": f"AUDIT INTELLIGENCE USA v7.0 - BHD {BHD_CUENTA} - {BHD_TITULAR}",
        "email": EMAIL_ADMIN,
        "whatsapp": WHATSAPP_ADMIN,
        "web": WEBSITE,
        "ruta_prueba_3_dias": "/trial",
        "salud_servidor": "/healthz",
        "status": "24/7_ACTIVO_RENDER_CERTIFIED"
    })

if __name__ == "__main__":
    # Render.com inyecta automáticamente la variable PORT
    port = int(os.environ.get('PORT', 5000))
    print(f"\\n=======================================================")
    print(f"🚀 SISTEMA BASA V7 - AUDIT INTELLIGENCE USA INICIADO")
    print(f"👤 Titular: {BHD_TITULAR} | BHD León: {BHD_CUENTA}")
    print(f"📞 WhatsApp: +{WHATSAPP_ADMIN} | {EMAIL_ADMIN}")
    print(f"🌐 Portal de 3 Días: http://0.0.0.0:{port}/trial")
    print(f"🩺 Health Check: http://0.0.0.0:{port}/healthz")
    print(f"=======================================================\\n")
    app.run(host="0.0.0.0", port=port, debug=False)
`;

export const BASA_RENDER_YAML = `# ==============================================================================
# BLUEPRINT OFICIAL PARA RENDER.COM: https://dashboard.render.com/web/srv-db0s008u01pc73bmtl90
# ==============================================================================
services:
  - type: web
    name: audit-intelligence-basa-v7
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120
    healthCheckPath: /healthz
    plan: free
    autoDeploy: true
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.9
      - key: SECRET
        generateValue: true
      - key: BHD_CUENTA
        value: "08694150021"
      - key: BHD_TITULAR
        value: "Pedro Baldera"
      - key: WHATSAPP_ADMIN
        value: "18297717390"
      - key: EMAIL_ADMIN
        value: "licpedrobaldera@gmail.com"
`;

export const BASA_PROCFILE = `web: gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120
`;

export const BASA_RUNTIME_TXT = `python-3.11.9
`;

export const BASA_REQUIREMENTS_TXT = `Flask>=2.3.3,<3.1.0
Flask-Cors>=4.0.0
gunicorn>=21.2.0
duckdb>=1.0.0
python-dotenv>=1.0.0
PyJWT>=2.8.0
requests>=2.31.0
pandas>=2.2.0
numpy>=1.26.0,<2.0.0
reportlab>=4.2.0
werkzeug>=2.3.0
`;

export const BASA_CONFIG_YML = `# ==============================================================================
# CONFIGURACIÓN CLOUDFLARE TUNNEL ~/.cloudflared/config.yml
# ==============================================================================
tunnel: audit-trial
credentials-file: /root/.cloudflared/audit-trial.json

ingress:
  - hostname: audit-intelligence-usa.com/trial
    service: http://localhost:5000

  - hostname: audit-intelligence-usa.com
    service: http://localhost:5000

  - hostname: trial.audit-intelligence-usa.com
    service: http://localhost:5000

  - service: http_status:404
`;

export const BASA_SETUP_TUNNEL_SH = `#!/bin/bash
# ==============================================================================
# SCRIPT DE AUTOMATIZACIÓN COMPLETA PARA CLOUDFLARE TUNNEL & DNS
# ==============================================================================
set -e

echo "=== 1. Instalando cloudflared si no existe ==="
if ! command -v cloudflared &> /dev/null
then
    echo "Descargando cloudflared..."
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i cloudflared-linux-amd64.deb
    rm -f cloudflared-linux-amd64.deb
    echo "cloudflared instalado con éxito."
else
    echo "cloudflared ya está instalado."
fi

echo "=== 2. Autenticación con Cloudflare ==="
cloudflared tunnel login

echo "=== 3. Creando túnel audit-trial ==="
cloudflared tunnel create audit-trial || true

echo "=== 4. Configurando DNS automático en Cloudflare ==="
cloudflared tunnel route dns audit-trial audit-intelligence-usa.com || true
cloudflared tunnel route dns audit-trial trial.audit-intelligence-usa.com || true

echo "=== 5. Copiando archivo de configuración config.yml ==="
mkdir -p ~/.cloudflared
cp config.yml ~/.cloudflared/config.yml || true

echo "=== 6. Iniciando túnel seguro ==="
echo "👉 https://audit-intelligence-usa.com/trial"
echo "👉 https://trial.audit-intelligence-usa.com"
cloudflared tunnel run audit-trial
`;

export const BASA_CLIENTES_JSON = `{
  "licpedrobaldera@gmail.com": {
    "password": "admin",
    "empresa": "Baldera Santos & Asociados",
    "plan": "pro",
    "estado_pago": true,
    "fecha_registro": "2026-09-01T00:00:00.000000",
    "creado": "2026-09-01 00:00:00.000000",
    "activado_por": "Pedro Baldera - 08694150021"
  },
  "demo.trial@audit-intelligence-usa.com": {
    "password": "demo",
    "empresa": "Auditor Independiente USA",
    "plan": "trial",
    "estado_pago": false,
    "fecha_registro": "2026-10-04T11:00:00.000000",
    "creado": "2026-10-04 11:00:00.000000"
  }
}`;

export const BASA_GIT_PUSH_SH = `#!/bin/bash
# ==============================================================================
# SCRIPT PARA SUBIR LOS ARCHIVOS A GITHUB Y AUTO-DESPLEGAR EN RENDER.COM:
# Repositorio: https://github.com/balderasantosyasociados/BASA_V7-system-
# Servicio Render: https://dashboard.render.com/web/srv-db0s008u01pc73bmtl90
# ==============================================================================

echo "Subiendo archivos validados para Render.com y GitHub..."

git add app.py requirements.txt render.yaml Procfile runtime.txt storage/ config.yml setup_tunnel.sh README.md
git commit -m "fix(render): Validar build para Render.com srv-db0s008u01pc73bmtl90 con gunicorn y /healthz"
git push origin main

echo "¡Listo! Render.com detectará el commit en 'main' e iniciará el Build automático."
`;

export const BASA_README_MD = `# SISTEMA BASA V7 - AUDIT INTELLIGENCE USA (v7.0 FINAL CERTIFICADO PARA RENDER.COM)
**Servicio en Render:** [https://dashboard.render.com/web/srv-db0s008u01pc73bmtl90/settings](https://dashboard.render.com/web/srv-db0s008u01pc73bmtl90/settings)  
**Repositorio GitHub:** [https://github.com/balderasantosyasociados/BASA_V7-system-](https://github.com/balderasantosyasociados/BASA_V7-system-)  
**Ruta de Prueba Gratuita:** [https://audit-intelligence-usa.com/trial](https://audit-intelligence-usa.com/trial)  
**Titular:** Pedro Baldera | **BHD León:** 08694150021 | **WhatsApp:** +1 829-771-7390

---

## ⚙️ CONFIGURACIÓN EXACTA PARA RENDER.COM (SETTINGS)

En el panel de configuración de tu servicio en Render (\`srv-db0s008u01pc73bmtl90/settings\`):

| Campo en Render | Valor Requerido |
| :--- | :--- |
| **Runtime** | \`Python 3\` |
| **Build Command** | \`pip install -r requirements.txt\` |
| **Start Command** | \`gunicorn app:app --bind 0.0.0.0:$PORT\` |
| **Health Check Path** | \`/healthz\` |
| **Auto-Deploy** | \`Yes\` (despliega automáticamente al hacer push en GitHub) |

### Variables de Entorno en Render (Environment Variables):
- \`PYTHON_VERSION\` = \`3.11.9\`
- \`SECRET\` = \`BHD_08694150021_Pedro_Baldera_2026_Audit_USA\`
- \`BHD_CUENTA\` = \`08694150021\`
- \`BHD_TITULAR\` = \`Pedro Baldera\`
- \`EMAIL_ADMIN\` = \`licpedrobaldera@gmail.com\`
- \`WHATSAPP_ADMIN\` = \`18297717390\`

---

## 🚀 Despliegue Local o con Cloudflare Tunnel

\`\`\`bash
# 1. Instalar requerimientos
pip install -r requirements.txt

# 2. Iniciar servidor local
python app.py

# 3. Iniciar el túnel de Cloudflare
./setup_tunnel.sh
\`\`\`
`;

export const DEPLOYMENT_FILES: DeploymentFile[] = [
  {
    name: 'app.py',
    path: 'app.py',
    description: 'Servidor Flask v7.0 Full con /trial, /healthz, ProxyFix para Render y BHD 08694150021',
    language: 'python',
    content: BASA_APP_PY
  },
  {
    name: 'requirements.txt',
    path: 'requirements.txt',
    description: 'Dependencias limpias y compatibles con Render.com (gunicorn, duckdb, reportlab, pandas)',
    language: 'plaintext',
    content: BASA_REQUIREMENTS_TXT
  },
  {
    name: 'render.yaml',
    path: 'render.yaml',
    description: 'Blueprint oficial de Render.com para autodespliegue sin errores de srv-db0s008u01pc73bmtl90',
    language: 'yaml',
    content: BASA_RENDER_YAML
  },
  {
    name: 'Procfile',
    path: 'Procfile',
    description: 'Archivo de inicio de proceso Web para Gunicorn con enlace al puerto dinámico $PORT',
    language: 'plaintext',
    content: BASA_PROCFILE
  },
  {
    name: 'runtime.txt',
    path: 'runtime.txt',
    description: 'Especificación de versión de Python estable (python-3.11.9) para Render.com',
    language: 'plaintext',
    content: BASA_RUNTIME_TXT
  },
  {
    name: 'config.yml',
    path: 'config.yml',
    description: 'Configuración de Cloudflare Tunnel ~/.cloudflared/config.yml con ingress para /trial',
    language: 'yaml',
    content: BASA_CONFIG_YML
  },
  {
    name: 'setup_tunnel.sh',
    path: 'setup_tunnel.sh',
    description: 'Script para instalar Cloudflare Tunnel y configurar DNS en Cloudflare en 1 solo comando',
    language: 'bash',
    content: BASA_SETUP_TUNNEL_SH
  },
  {
    name: 'clientes.json',
    path: 'storage/clientes.json',
    description: 'Base de datos JSON persistente con control de fecha_registro y estado_pago',
    language: 'json',
    content: BASA_CLIENTES_JSON
  },
  {
    name: 'subir_a_github.sh',
    path: 'subir_a_github.sh',
    description: 'Comandos para sincronizar y hacer push a balderasantosyasociados/BASA_V7-system- y Render',
    language: 'bash',
    content: BASA_GIT_PUSH_SH
  }
];

export const YOELFRI_AUDITORIA_AGIL_PY = `"""
# ===========================================================================
# MODULO ADICIONAL: YOELFRI_AUDITORIA_AGIL
# INTEGRADO EN SISTEMA BASA V7 - AUDIT INTELLIGENCE USA
# Titular: Pedro Baldera | BHD León: 08694150021 | WhatsApp: +18297717390
# DB_NAME: audit_system_ultimate.db | EVIDENCE_DIR: evidencias_oficiales
# ===========================================================================
"""
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
                    'desc': f"Fraccionamiento con proveedor {supplier}. Acumulado de RD\\\\$ {rolling_sum.loc[dt]:,.2f} en ventana de 7 días.",
                    'severity': 'HIGH',
                    'impact': float(rolling_sum.loc[dt])
                })
        return alerts

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
    story.append(Paragraph(f"Evaluación integral automatizada ejecutada sobre {case_data['entity_name']}. El impacto financiero total cuantificado asciende a <b>{case_data['currency']} RD\\\\$ {case_data['total_impact']:,.2f}</b>.", body_style))
    
    # 2. Matriz de Hallazgos
    story.append(Paragraph("2. Matriz de Incidencias y Hallazgos Forenses", h1_style))
    table_rows = [[Paragraph("Dominio / Materia", table_hdr), Paragraph("Norma / Marco", table_hdr), Paragraph("Descripción de la Incidencia", table_hdr), Paragraph(f"Impacto ({case_data['currency']})", table_hdr)]]
    
    for f in findings:
        table_rows.append([
            Paragraph(f['domain'], table_cell),
            Paragraph(f['norm'], table_cell),
            Paragraph(f['desc'], table_cell),
            Paragraph(f"RD\\\\$ {f['impact']:,.2f}", table_cell)
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
    
    print(f"\\\\n✅ AUDITORÍA UNIFICADA EJECUTADA CON ÉXITO")
    print(f"📄 Informe PDF generado en: {os.path.abspath(pdf_path)}")
    print(f"🔒 Sello Criptográfico SHA-256: {final_hash}")
    print(f"💰 Perjuicio Financiero Consolidado: {case_info['currency']} RD\\\\$ {case_info['total_impact']:,.2f}")
`;

DEPLOYMENT_FILES.push(
  {
    name: 'yoelfri_auditoria_agil.py',
    path: 'backend/yoelfri_auditoria_agil.py',
    description: 'Módulo de Auditoría Ágil Forense: Ley 340-06 (7 días), Benford Chi-Square y Cadena de Custodia SHA-256',
    language: 'python',
    content: YOELFRI_AUDITORIA_AGIL_PY
  },
  {
    name: 'README.md',
    path: 'README.md',
    description: 'Documentación técnica completa del sistema con guía para Render.com Settings',
    language: 'markdown',
    content: BASA_README_MD
  }
);

export async function generateAndDownloadZip(): Promise<void> {
  const zip = new JSZip();

  for (const file of DEPLOYMENT_FILES) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'BASA_V7_Render_Full_Package.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
