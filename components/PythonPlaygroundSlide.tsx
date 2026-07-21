'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Terminal, Code2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// ─── Default Python script ─────────────────────────────────────────────────
const DEFAULT_CODE = `def get_key_order(keyword):
    """Assign ranks to keyword letters alphabetically. Duplicates share a rank."""
    sorted_unique = sorted(set(keyword))
    rank_map = {char: i + 1 for i, char in enumerate(sorted_unique)}
    return [rank_map[c] for c in keyword]


def myszkowski_encrypt(plaintext, keyword):
    plaintext = plaintext.upper().replace(" ", "")
    keyword   = keyword.upper()
    key_order = get_key_order(keyword)
    n_cols    = len(keyword)

    # Pad with X so plaintext fills the grid completely
    rem = len(plaintext) % n_cols
    if rem:
        plaintext += "X" * (n_cols - rem)

    n_rows = len(plaintext) // n_cols
    matrix = [list(plaintext[r * n_cols:(r + 1) * n_cols]) for r in range(n_rows)]

    # Extract columns by ascending rank; shared-rank cols are read row-by-row together
    cipher = []
    for rank in sorted(set(key_order)):
        cols = [i for i, k in enumerate(key_order) if k == rank]
        for r in range(n_rows):
            for c in cols:
                cipher.append(matrix[r][c])

    return "".join(cipher)


def myszkowski_decrypt(ciphertext, keyword):
    keyword   = keyword.upper()
    key_order = get_key_order(keyword)
    n_cols    = len(keyword)
    n_rows    = len(ciphertext) // n_cols

    matrix = [[""] * n_cols for _ in range(n_rows)]

    # Refill matrix in the same rank order used during encryption
    idx = 0
    for rank in sorted(set(key_order)):
        cols    = [i for i, k in enumerate(key_order) if k == rank]
        n_cells = n_rows * len(cols)
        chunk   = ciphertext[idx: idx + n_cells]
        idx    += n_cells
        pos = 0
        for r in range(n_rows):
            for c in cols:
                matrix[r][c] = chunk[pos]
                pos += 1

    return "".join("".join(row) for row in matrix)


# ── Entry point ─────────────────────────────────────────────────────────────
# The variables \`plaintext\` and \`keyword\` are injected by the UI.
print(f"Keyword   : {keyword}")
print(f"Plaintext : {plaintext}")
print()

encrypted = myszkowski_encrypt(plaintext, keyword)
print(f"Encrypted : {encrypted}")

decrypted = myszkowski_decrypt(encrypted, keyword)
print(f"Decrypted : {decrypted}")
`;

// ─── Pyodide type shim ─────────────────────────────────────────────────────
declare global {
  interface Window {
    loadPyodide?: (options?: { indexURL?: string }) => Promise<any>;
    _pyodideInstance?: any;
    _pyodideLoading?: Promise<any>;
  }
}

// ─── Component ─────────────────────────────────────────────────────────────
const PythonPlaygroundSlide: React.FC = () => {
  const [code, setCode]           = useState(DEFAULT_CODE);
  const [plaintext, setPlaintext] = useState('DEFEND THE CASTLE');
  const [keyword, setKeyword]     = useState('ATTACK');
  const [output, setOutput]       = useState('');
  const [error, setError]         = useState('');
  const [running, setRunning]     = useState(false);
  const [pyStatus, setPyStatus]   = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  // ── Load Pyodide on mount ──────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (window._pyodideInstance) { setPyStatus('ready'); return; }

      if (window._pyodideLoading) {
        setPyStatus('loading');
        await window._pyodideLoading;
        setPyStatus('ready');
        return;
      }

      setPyStatus('loading');

      // Inject the Pyodide CDN script if not already present
      if (!document.querySelector('#pyodide-script')) {
        await new Promise<void>((resolve, reject) => {
          const script    = document.createElement('script');
          script.id       = 'pyodide-script';
          script.src      = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          script.onload   = () => resolve();
          script.onerror  = () => reject(new Error('Failed to load Pyodide script'));
          document.head.appendChild(script);
        });
      }

      window._pyodideLoading = (window.loadPyodide as any)({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });

      try {
        window._pyodideInstance = await window._pyodideLoading;
        setPyStatus('ready');
      } catch {
        setPyStatus('error');
      }
    };

    init();
  }, []);

  // ── Run Python ────────────────────────────────────────────────────────
  const runCode = useCallback(async () => {
    if (!window._pyodideInstance) return;
    setRunning(true);
    setOutput('');
    setError('');

    const pyodide = window._pyodideInstance;

    try {
      // Redirect stdout to a StringIO buffer
      await pyodide.runPythonAsync(`
import sys, io as _io
_stdout_buffer = _io.StringIO()
sys.stdout = _stdout_buffer
`);

      // Inject plaintext & keyword as Python globals
      pyodide.globals.set('plaintext', plaintext);
      pyodide.globals.set('keyword',   keyword);

      // Execute user code
      await pyodide.runPythonAsync(code);

      // Capture output
      const captured: string = await pyodide.runPythonAsync(
        '_stdout_buffer.getvalue()'
      );

      // Restore stdout
      await pyodide.runPythonAsync(`sys.stdout = sys.__stdout__`);

      setOutput(captured || '(no output)');
    } catch (err: any) {
      // Restore stdout even on error
      try { await pyodide.runPythonAsync(`sys.stdout = sys.__stdout__`); } catch {}
      setError(String(err));
    } finally {
      setRunning(false);
    }
  }, [code, plaintext, keyword]);

  // ── Spacebar runs code when this slide is active ───────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (pyStatus === 'ready' && !running) runCode();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pyStatus, running, runCode]);

  // ── Auto-resize textarea ──────────────────────────────────────────────
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full text-left">

      {/* ── LEFT: Code Editor ──────────────────────────────────────────── */}
      <div className="backdrop-blur-md bg-white/[0.02] rounded-[2rem] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">

        {/* Editor titlebar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white">myszkowski.py</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
        </div>

        {/* Code textarea */}
        <div className="flex-grow relative overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            spellCheck={false}
            className="w-full h-full min-h-[420px] bg-transparent text-green-300 resize-none outline-none border-none p-6 text-[12.5px] leading-[1.7] tracking-wide"
            style={{ fontFamily: "'Fira Code', 'Fira Mono', 'Cascadia Code', monospace" }}
          />
          {/* Line number gutter overlay (cosmetic) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 border-r border-white/[0.04] flex flex-col pt-6 items-end pr-2"
            style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.12)', lineHeight: '1.7' }}
          >
            {code.split('\n').map((_, i) => (
              <div key={i} className="leading-[1.7]">{i + 1}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Runner ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {/* Python engine status badge */}
        <div className="backdrop-blur-md bg-white/[0.02] rounded-2xl border border-white/[0.08] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white font-medium">Python Engine</span>
            <span className="text-xs text-gray-500">(Pyodide v0.26 · WASM)</span>
          </div>
          <div className="flex items-center gap-2">
            {pyStatus === 'loading' && (
              <>
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-xs text-blue-400">Initialising…</span>
              </>
            )}
            {pyStatus === 'ready' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400">Ready</span>
              </>
            )}
            {pyStatus === 'error' && (
              <>
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">Load failed</span>
              </>
            )}
            {pyStatus === 'idle' && (
              <span className="text-xs text-gray-500">Waiting…</span>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="backdrop-blur-md bg-white/[0.02] rounded-[2rem] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4">
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">Inputs</p>

          <div className="flex flex-col gap-3">
            {/* Plaintext field */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Plaintext</label>
              <input
                type="text"
                value={plaintext}
                onChange={e => setPlaintext(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder-gray-600"
                style={{ fontFamily: "'Fira Code', monospace" }}
                placeholder="e.g. DEFEND THE CASTLE"
              />
            </div>
            {/* Keyword field */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder-gray-600"
                style={{ fontFamily: "'Fira Code', monospace" }}
                placeholder="e.g. ATTACK"
              />
            </div>
          </div>

          {/* Run button */}
          <button
            onClick={runCode}
            disabled={pyStatus !== 'ready' || running}
            className="w-full flex items-center justify-center gap-2.5 font-semibold text-sm py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_4px_36px_rgba(59,130,246,0.55)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
          >
            {running
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</>
              : <><Play className="w-4 h-4 fill-current" /> Run Python Code</>}
          </button>
          <p className="text-center text-[10px] text-gray-600 font-mono">
            or press <span className="text-gray-400">Ctrl + Enter</span>
          </p>
        </div>

        {/* Console output */}
        <div className="flex-grow backdrop-blur-md bg-white/[0.02] rounded-[2rem] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06]">
            <span className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">Console Output</span>
            {(output || error) && (
              <button
                onClick={() => { setOutput(''); setError(''); }}
                className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-300 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="flex-grow p-5 overflow-y-auto min-h-[130px]">
            <AnimatePresence mode="wait">
              {!output && !error && (
                <motion.p
                  key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-gray-600 text-xs font-mono"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  {pyStatus === 'loading'
                    ? '# Initialising Python WebAssembly engine…'
                    : pyStatus === 'ready'
                    ? '# Press "Run Python Code" to execute'
                    : '# Engine unavailable'}
                </motion.p>
              )}

              {error && (
                <motion.pre
                  key="error"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-red-400 text-xs leading-relaxed whitespace-pre-wrap break-all"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  {error}
                </motion.pre>
              )}

              {output && !error && (
                <motion.pre
                  key="output"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-emerald-300 text-[13px] leading-relaxed whitespace-pre-wrap"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  {output}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PythonPlaygroundSlide;
