/**
 * brain-router.js — Cascada IA para Email Builder ARTES BUHO
 * Desarrollado por RUBEN COTON
 *
 * Estrategia: MAXIMA EFICIENCIA DE CUOTAS.
 * Adaptada del proyecto ARTES-BUHO_RAMON (Python) al Email Builder (Node).
 *
 * Orden de providers (NO es por potencia, es por coste/cuota):
 *  1. Cache in-memory (10 min)        -> 0 tokens, instantáneo
 *  2. Ollama LOCAL qwen2.5:14b        -> gratis, RTX 4070, sin cuota
 *  3. Groq llama-3.3-70b              -> 14.4K req/dia free
 *  4. OpenRouter gpt-oss-120b:free    -> 50 req/dia free
 *  5. Gemini 2.5 Flash                -> 1500 req/dia free
 *  6. VPS Ollama qwen2.5:1.5b         -> local VPS siempre-on
 *
 * Cooldown 429 COMPARTIDO con RAMON via archivo JSON en %APPDATA%.
 * Si RAMON agota Groq a las 10:00, este Email Builder no lo reintenta hasta 10:01.
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

// ============================================================
// COOLDOWN COMPARTIDO (archivo JSON en APPDATA)
// ============================================================
const COOLDOWN_DIR = path.join(process.env.APPDATA || os.tmpdir(), 'artes-buho');
const COOLDOWN_FILE = path.join(COOLDOWN_DIR, 'brain-cooldowns.json');

function ensureCooldownDir() {
  try { fs.mkdirSync(COOLDOWN_DIR, { recursive: true }); } catch {}
}

function readCooldowns() {
  try {
    const raw = fs.readFileSync(COOLDOWN_FILE, 'utf8');
    return JSON.parse(raw);
  } catch { return {}; }
}

function writeCooldowns(map) {
  ensureCooldownDir();
  try { fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(map, null, 2)); } catch {}
}

function inCooldown(provider) {
  const map = readCooldowns();
  const end = map[provider] || 0;
  return end > Date.now();
}

function markCooldown(provider, seconds) {
  const map = readCooldowns();
  map[provider] = Date.now() + seconds * 1000;
  writeCooldowns(map);
  console.log(`[BRAIN] ${provider} cooldown ${seconds}s`);
}

const COOLDOWN_SECONDS = {
  groq: 60,
  openrouter: 3600,
  gemini: 300,
  cerebras: 60,
  mistral: 5,
};

// ============================================================
// CACHE IN-MEMORY (mismo prompt + tier → respuesta idéntica 10 min)
// ============================================================
const CACHE = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function cacheKey(prompt, tier) {
  return crypto.createHash('sha256').update(tier + '|' + prompt).digest('hex');
}

function cacheGet(key) {
  const hit = CACHE.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) { CACHE.delete(key); return null; }
  return hit.value;
}

function cacheSet(key, value) {
  CACHE.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  // Limitar tamaño cache
  if (CACHE.size > 50) {
    const first = CACHE.keys().next().value;
    CACHE.delete(first);
  }
}

// ============================================================
// HTTP helper (fetch nativo a partir de Node 18)
// ============================================================
async function httpJson(url, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs || 30000);
  try {
    const resp = await fetch(url, { ...opts, signal: controller.signal });
    const text = await resp.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: resp.status, ok: resp.ok, text, json };
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
// PROVIDERS
// ============================================================

// --- Ollama local (PC con RTX, qwen2.5:14b) ---
const OLLAMA_URL = (process.env.PC_OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');
const OLLAMA_MODEL = process.env.PC_OLLAMA_MODEL || 'qwen2.5:14b';

async function callOllamaLocal(prompt, maxTokens, temperature) {
  const r = await httpJson(OLLAMA_URL + '/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      keep_alive: '10m',
      options: { temperature, num_predict: maxTokens, seed: Math.floor(Math.random() * 999999) },
    }),
    timeoutMs: 180000, // 3 min (cold start qwen2.5:14b puede tardar)
  });
  if (!r.ok) throw new Error(`Ollama HTTP ${r.status}`);
  return (r.json && r.json.response || '').trim();
}

async function ollamaLocalAvailable() {
  try {
    const r = await httpJson(OLLAMA_URL + '/api/tags', { timeoutMs: 2000 });
    return r.ok;
  } catch { return false; }
}

// --- OpenAI-compat (Groq, OpenRouter, Cerebras, Mistral, SambaNova) ---
async function callOpenAICompat({ baseUrl, apiKey, model, system, user, maxTokens, temperature, extraHeaders }) {
  const r = await httpJson(baseUrl.replace(/\/$/, '') + '/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      ...(extraHeaders || {}),
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
    timeoutMs: 30000,
  });
  if (r.status === 429) { const e = new Error('429'); e.status = 429; throw e; }
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.text.slice(0, 120)}`);
  const choices = (r.json && r.json.choices) || [];
  if (!choices.length) return '';
  return (choices[0].message && choices[0].message.content || '').trim();
}

// --- Gemini ---
async function callGemini(system, user, maxTokens, temperature) {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  if (!key) throw new Error('GEMINI_API_KEY no configurada');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const r = await httpJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    }),
    timeoutMs: 30000,
  });
  if (r.status === 429) { const e = new Error('429'); e.status = 429; throw e; }
  if (!r.ok) throw new Error(`Gemini HTTP ${r.status}: ${r.text.slice(0, 120)}`);
  const cands = (r.json && r.json.candidates) || [];
  if (!cands.length) return '';
  const parts = (cands[0].content && cands[0].content.parts) || [];
  return parts.map(p => p.text || '').join('').trim();
}

// ============================================================
// REGISTRO DE PROVIDERS
// ============================================================
const PROVIDERS = [
  {
    name: 'ollama_local',
    configured: () => true, // se chequea dinámicamente con /api/tags
    isCloud: false,
    call: (system, user, maxTokens, temp) => callOllamaLocal(system + '\n\n' + user, maxTokens, temp),
  },
  {
    name: 'groq',
    configured: () => !!(process.env.GROQ_API_KEY || '').trim(),
    isCloud: true,
    call: (system, user, maxTokens, temp) => callOpenAICompat({
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      system, user, maxTokens, temperature: temp,
    }),
  },
  {
    name: 'openrouter',
    configured: () => !!(process.env.OPENROUTER_API_KEY || '').trim(),
    isCloud: true,
    call: (system, user, maxTokens, temp) => callOpenAICompat({
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free',
      system, user, maxTokens, temperature: temp,
      extraHeaders: { 'HTTP-Referer': 'https://artesbuhomanagement.com', 'X-Title': 'ARTES BUHO Email Builder' },
    }),
  },
  {
    name: 'cerebras',
    configured: () => !!(process.env.CEREBRAS_API_KEY || '').trim(),
    isCloud: true,
    call: (system, user, maxTokens, temp) => callOpenAICompat({
      baseUrl: 'https://api.cerebras.ai/v1',
      apiKey: process.env.CEREBRAS_API_KEY,
      model: process.env.CEREBRAS_MODEL || 'qwen-3-235b-a22b-instruct-2507',
      system, user, maxTokens, temperature: temp,
    }),
  },
  {
    name: 'gemini',
    configured: () => !!(process.env.GEMINI_API_KEY || '').trim(),
    isCloud: true,
    call: callGemini,
  },
  {
    name: 'vps_ollama',
    configured: () => !!(process.env.OLLAMA_URL || '').trim(),
    isCloud: false,
    call: async (system, user, maxTokens, temp) => {
      const url = (process.env.OLLAMA_URL || '').replace(/\/$/, '');
      const model = process.env.OLLAMA_MODEL || 'qwen2.5:1.5b';
      const r = await httpJson(url + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model, stream: false,
          options: { temperature: temp, num_predict: maxTokens },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }),
        timeoutMs: 60000,
      });
      if (!r.ok) throw new Error(`VPS Ollama HTTP ${r.status}`);
      return (r.json && r.json.message && r.json.message.content || '').trim();
    },
  },
];

// ============================================================
// TIER ROUTING (ahorra tokens: tarea trivial → provider pequeño)
// ============================================================
function classifyTier(prompt) {
  const p = prompt.toLowerCase();
  if (p.length < 200 && /clasifica|etiqueta|si o no|responde solo|extrae|confirma/.test(p)) return 'trivial';
  if (p.length < 400) return 'normal';
  if (/redacta|propuesta|email completo|copywriting|analiza|estrategia/.test(p)) return 'alta';
  return 'normal';
}

// Para EMAIL BUILDER: priorizamos LOCAL siempre. Cloud solo si local falla.
const TIER_ORDER = {
  trivial: ['ollama_local', 'groq', 'openrouter', 'gemini', 'vps_ollama'],
  normal:  ['ollama_local', 'groq', 'openrouter', 'gemini', 'cerebras', 'vps_ollama'],
  alta:    ['ollama_local', 'cerebras', 'openrouter', 'groq', 'gemini', 'vps_ollama'],
};

// ============================================================
// API PUBLICA
// ============================================================
async function generate({ system = '', user = '', prompt = '', tier = null, maxTokens = 800, temperature = 0.7, useCache = true }) {
  const fullPrompt = prompt || (system + '\n\n' + user);
  const finalSystem = system || 'Eres un asistente experto.';
  const finalUser = user || prompt;

  // 1. Cache
  if (useCache) {
    const key = cacheKey(fullPrompt + '|' + maxTokens, tier || 'auto');
    const hit = cacheGet(key);
    if (hit) {
      console.log('[BRAIN] cache HIT');
      return { text: hit.text, provider: hit.provider + '@cache', cached: true };
    }
  }

  // 2. Clasificar tier si no viene
  const actualTier = tier || classifyTier(fullPrompt);
  const order = TIER_ORDER[actualTier] || TIER_ORDER.normal;

  // 3. Chequear Ollama local UNA vez (cacheado 30s)
  const localOn = await ollamaLocalAvailable();

  // 4. Recorrer cascada
  const errors = [];
  for (const providerName of order) {
    const provider = PROVIDERS.find(p => p.name === providerName);
    if (!provider) continue;

    // Filtro por disponibilidad
    if (providerName === 'ollama_local' && !localOn) { errors.push(`${providerName}: off`); continue; }
    if (!provider.configured()) { errors.push(`${providerName}: no configurado`); continue; }
    if (provider.isCloud && inCooldown(providerName)) { errors.push(`${providerName}: cooldown`); continue; }

    try {
      const t0 = Date.now();
      const text = await provider.call(finalSystem, finalUser, maxTokens, temperature);
      const ms = Date.now() - t0;
      if (!text) { errors.push(`${providerName}: vacío`); continue; }

      console.log(`[BRAIN] ${providerName}@${actualTier} OK (${ms}ms, ${text.length} chars)`);

      // Guardar en cache
      if (useCache) {
        const key = cacheKey(fullPrompt + '|' + maxTokens, tier || 'auto');
        cacheSet(key, { text, provider: providerName });
      }
      return { text, provider: `${providerName}@${actualTier}`, cached: false, ms };
    } catch (err) {
      if (err.status === 429) markCooldown(providerName, COOLDOWN_SECONDS[providerName] || 60);
      errors.push(`${providerName}: ${err.message}`);
      console.warn(`[BRAIN] ${providerName} falló:`, err.message);
    }
  }

  throw new Error('Cascada IA agotada. Detalle: ' + errors.join(' | '));
}

function status() {
  const cd = readCooldowns();
  const now = Date.now();
  return {
    providers: PROVIDERS.map(p => ({
      name: p.name,
      configured: p.configured(),
      cooldown_s: Math.max(0, Math.round(((cd[p.name] || 0) - now) / 1000)),
    })),
    cache_size: CACHE.size,
    cache_ttl_min: CACHE_TTL_MS / 60000,
  };
}

module.exports = { generate, status, classifyTier };
