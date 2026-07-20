import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Check } from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────
// CIPHERTEXT: DETCTXNAXDSXEFHELE  (18 chars)
// KEYWORD:    ATTACK  →  ranks: A=1, T=4, T=4, A=1, C=2, K=3
//
// Decryption fill order:
//   Step 1 – Rank 1 (cols 0,3): ciphertext[0..5] → fill row-by-row across both cols
//   Step 2 – Rank 2 (col 4):    ciphertext[6..8]  → top-to-bottom
//             Rank 3 (col 5):    ciphertext[9..11] → top-to-bottom
//   Step 3 – Rank 4 (cols 1,2): ciphertext[12..17] → fill row-by-row across both cols
//   Step 4 – Extract:           read grid left-to-right row-by-row → plaintext

interface LetterItem {
  id: number;
  char: string;
  cipherPos: number;
  row: number;
  col: number;
  fillStep: number;
  extractStep: number;
}

const KEYWORD = [
  { char: 'A', rank: 1 },
  { char: 'T', rank: 4 },
  { char: 'T', rank: 4 },
  { char: 'A', rank: 1 },
  { char: 'C', rank: 2 },
  { char: 'K', rank: 3 },
];

const LETTERS: LetterItem[] = [
  // Rank 1 fill (step 1): ciphertext[0..5] → cols 0 & 3, row-by-row
  { id: 0,  char: 'D', cipherPos: 0,  row: 0, col: 0, fillStep: 1, extractStep: 4 },
  { id: 1,  char: 'E', cipherPos: 1,  row: 0, col: 3, fillStep: 1, extractStep: 4 },
  { id: 2,  char: 'T', cipherPos: 2,  row: 1, col: 0, fillStep: 1, extractStep: 4 },
  { id: 3,  char: 'C', cipherPos: 3,  row: 1, col: 3, fillStep: 1, extractStep: 4 },
  { id: 4,  char: 'T', cipherPos: 4,  row: 2, col: 0, fillStep: 1, extractStep: 4 },
  { id: 5,  char: 'X', cipherPos: 5,  row: 2, col: 3, fillStep: 1, extractStep: 4 },
  // Rank 2 fill (step 2): ciphertext[6..8] → col 4, top-to-bottom
  { id: 6,  char: 'N', cipherPos: 6,  row: 0, col: 4, fillStep: 2, extractStep: 4 },
  { id: 7,  char: 'A', cipherPos: 7,  row: 1, col: 4, fillStep: 2, extractStep: 4 },
  { id: 8,  char: 'X', cipherPos: 8,  row: 2, col: 4, fillStep: 2, extractStep: 4 },
  // Rank 3 fill (step 2): ciphertext[9..11] → col 5, top-to-bottom
  { id: 9,  char: 'D', cipherPos: 9,  row: 0, col: 5, fillStep: 2, extractStep: 4 },
  { id: 10, char: 'S', cipherPos: 10, row: 1, col: 5, fillStep: 2, extractStep: 4 },
  { id: 11, char: 'X', cipherPos: 11, row: 2, col: 5, fillStep: 2, extractStep: 4 },
  // Rank 4 fill (step 3): ciphertext[12..17] → cols 1 & 2, row-by-row
  { id: 12, char: 'E', cipherPos: 12, row: 0, col: 1, fillStep: 3, extractStep: 4 },
  { id: 13, char: 'F', cipherPos: 13, row: 0, col: 2, fillStep: 3, extractStep: 4 },
  { id: 14, char: 'H', cipherPos: 14, row: 1, col: 1, fillStep: 3, extractStep: 4 },
  { id: 15, char: 'E', cipherPos: 15, row: 1, col: 2, fillStep: 3, extractStep: 4 },
  { id: 16, char: 'L', cipherPos: 16, row: 2, col: 1, fillStep: 3, extractStep: 4 },
  { id: 17, char: 'E', cipherPos: 17, row: 2, col: 2, fillStep: 3, extractStep: 4 },
];

// Plaintext order: read grid left-to-right, row-by-row (sort by row*6+col)
const PLAINTEXT_ORDER = [...LETTERS].sort((a, b) => (a.row * 6 + a.col) - (b.row * 6 + b.col));

const STEPS = [
  {
    label: 'Step 0 — Initialise',
    desc: 'Keyword <strong>ATTACK</strong> ranks: A=1, C=2, K=3, T=4. The ciphertext <em>DETCTXNAXDSXEFHELE</em> sits in the input buffer. We reverse-engineer the matrix fill order to recover the plaintext.',
  },
  {
    label: 'Step 1 — Fill Rank 1 (A)',
    desc: 'Rank 1 columns are <strong>col 1</strong> and <strong>col 4</strong> (both A). They share a rank, so we fill them simultaneously left-to-right, row-by-row. The first 6 ciphertext characters <strong>D, E, T, C, T, X</strong> go into these two columns.',
  },
  {
    label: 'Step 2 — Fill Ranks 2 & 3 (C, K)',
    desc: 'Rank 2 is <strong>col 5 (C)</strong> and rank 3 is <strong>col 6 (K)</strong>. Unique ranks fill top-to-bottom: next 3 chars <strong>N, A, X</strong> fill col 5; next 3 chars <strong>D, S, X</strong> fill col 6.',
  },
  {
    label: 'Step 3 — Fill Rank 4 (T)',
    desc: 'Rank 4 columns are <strong>col 2</strong> and <strong>col 3</strong> (both T). Fill simultaneously left-to-right, row-by-row with the remaining 6 characters: <strong>E, F, H, E, L, E</strong>.',
  },
  {
    label: 'Step 4 — Extract Plaintext',
    desc: 'The grid is fully populated. Read it left-to-right, row-by-row to recover the original plaintext: <span style="color:#34d399;font-weight:700">DEFENDTHECASTLEXXX</span>.',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const colHighlight = (col: number, step: number): string => {
  if ((col === 0 || col === 3) && step >= 1)
    return 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.22)]';
  if ((col === 4 || col === 5) && step >= 2)
    return 'border-sky-400 bg-sky-400/10 text-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.22)]';
  if ((col === 1 || col === 2) && step >= 3)
    return 'border-violet-500 bg-violet-500/10 text-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.22)]';
  return 'border-white/10 bg-white/[0.02] text-gray-400';
};

const cipherSlotColor = (cipherPos: number): string => {
  if (cipherPos < 6)  return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  if (cipherPos < 12) return 'text-sky-400 border-sky-400/40 bg-sky-950/30';
  return 'text-violet-400 border-violet-500/40 bg-violet-950/30';
};

// ─── Component ─────────────────────────────────────────────────────────────
const InteractiveDecryption = () => {
  const [step, setStep] = useState(0);

  const advance = () => setStep(s => Math.min(s + 1, 4));
  const reset   = () => setStep(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); advance(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const inCipher  = (l: LetterItem) => step < l.fillStep;
  const inGrid    = (l: LetterItem) => step >= l.fillStep && step < l.extractStep;
  const extracted = (l: LetterItem) => step >= l.extractStep;

  const cipherOrder = [...LETTERS].sort((a, b) => a.cipherPos - b.cipherPos);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-8 items-stretch text-left w-full">

      {/* Left: Grid + strips */}
      <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6">

        {/* Ciphertext source strip */}
        <div className="bg-black/40 border border-white/5 rounded-2xl px-4 py-2 flex items-center gap-3">
          <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase shrink-0">Ciphertext</span>
          <div className="flex gap-1 flex-wrap">
            {cipherOrder.map((letter) => (
              <div key={letter.id} className="w-7 h-8 relative flex items-center justify-center">
                {inCipher(letter) && (
                  <motion.div
                    layoutId={`dec-letter-${letter.id}`}
                    transition={{ type: 'spring', stiffness: 110, damping: 16 }}
                    className={`absolute inset-0 flex items-center justify-center font-mono text-sm font-bold border rounded ${cipherSlotColor(letter.cipherPos)}`}
                  >
                    {letter.char}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info row */}
        <div className="flex justify-between font-mono text-[11px] text-gray-500 border-b border-white/10 pb-2">
          <div>KEY: <span className="text-sky-400 font-bold">ATTACK</span></div>
          <div>RANKING: <span className="text-sky-400 font-bold">1, 4, 4, 1, 2, 3</span></div>
        </div>

        {/* Grid */}
        <div className="flex flex-col items-center gap-2">
          <div className="grid grid-cols-6 gap-2">
            {KEYWORD.map((kw, i) => (
              <div
                key={i}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-lg border flex flex-col items-center justify-center font-mono font-bold text-base relative transition-all duration-300 ${colHighlight(i, step)}`}
              >
                {kw.char}
                <span className="absolute bottom-1 right-1.5 text-[9px] text-red-400 font-normal">{kw.rank}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-6 grid-rows-3 gap-2">
            {Array.from({ length: 18 }).map((_, idx) => {
              const r = Math.floor(idx / 6);
              const c = idx % 6;
              const letter = LETTERS.find(l => l.row === r && l.col === c);
              return (
                <div
                  key={idx}
                  className="w-12 h-12 md:w-14 md:h-14 bg-black/60 border border-white/5 rounded-lg flex items-center justify-center relative font-mono text-xl font-bold"
                >
                  {letter && inGrid(letter) && (
                    <motion.div
                      layoutId={`dec-letter-${letter.id}`}
                      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
                      className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                        (letter.col === 0 || letter.col === 3) ? 'text-emerald-400' :
                        (letter.col === 4 || letter.col === 5) ? 'text-sky-300' :
                        'text-violet-400'
                      }`}
                    >
                      {letter.char}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Plaintext output */}
        <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono tracking-wider mb-2">
            <span>PLAINTEXT OUTPUT</span>
            {step === 4 && <span className="text-emerald-400">[ left-to-right, row-by-row ]</span>}
          </div>
          <div className="flex gap-1 flex-wrap">
            {PLAINTEXT_ORDER.map((letter) => {
              const filled = extracted(letter);
              return (
                <div key={letter.id} className="w-8 h-10 md:w-9 md:h-11 relative flex items-center justify-center">
                  <div className="absolute inset-0 border border-white/5 rounded bg-black/40" />
                  {filled && (
                    <motion.div
                      layoutId={`dec-letter-${letter.id}`}
                      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
                      className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold rounded border border-emerald-500/40 bg-emerald-950/25 text-emerald-400"
                    >
                      {letter.char}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Console */}
      <div className="flex flex-col bg-black/80 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-white/[0.02] px-4 py-3 flex items-center gap-1.5 border-b border-white/[0.08]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span className="font-mono text-[11px] text-gray-400 ml-2">decrypt.sh</span>
        </div>

        <div className="p-5 flex-grow flex flex-col font-mono text-xs">
          <div className="flex flex-col gap-2.5 mb-5 text-[11px]">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 transition-all duration-300 ${
                  i < step  ? 'text-green-500' :
                  i === step ? 'text-sky-400 font-bold' : 'text-gray-600'
                }`}
              >
                <span className="mt-0.5">
                  {i < step ? <Check className="w-3.5 h-3.5 text-green-500" /> : <span>&gt;</span>}
                </span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-white/10 my-3"></div>

          <div className="text-gray-400 leading-relaxed text-[11.5px] flex-grow overflow-y-auto pr-1">
            <p dangerouslySetInnerHTML={{ __html: STEPS[step].desc }} />
            {step === 4 && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="mt-3 text-green-400 font-bold text-xs"
              >
                ✓ Decryption Complete.
              </motion.p>
            )}
          </div>
        </div>

        <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] flex gap-2.5 items-center">
          <button
            onClick={advance}
            disabled={step === 4}
            className="flex items-center gap-2 font-sans font-semibold text-xs px-4 py-2.5 rounded-md bg-sky-500 text-black border border-sky-500 shadow-md hover:bg-sky-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <span>Next Step</span>
            <Play className="w-3 h-3 fill-current" />
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 font-sans font-semibold text-gray-400 text-xs px-4 py-2.5 rounded-md border border-white/20 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <span className="font-mono text-[9px] text-gray-500 ml-auto select-none">[SPACEBAR]</span>
        </div>
      </div>

    </div>
  );
};

export default InteractiveDecryption;
