import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Check } from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────
// PLAINTEXT: DEFENDTHECASTLEXXX  (18 chars, fills 6×3 grid perfectly)
// KEYWORD:   ATTACK  →  ranks: A=1, T=4, T=4, A=1, C=2, K=3

interface LetterItem {
  id: number;
  char: string;
  row: number;
  col: number;
  fillStep: number;
  extractStep: number;
  cipherSlot: number;
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
  // row 0: D  E  F  E  N  D
  { id: 0,  char: 'D', row: 0, col: 0, fillStep: 1, extractStep: 2, cipherSlot: 0  },
  { id: 1,  char: 'E', row: 0, col: 1, fillStep: 1, extractStep: 4, cipherSlot: 12 },
  { id: 2,  char: 'F', row: 0, col: 2, fillStep: 1, extractStep: 4, cipherSlot: 13 },
  { id: 3,  char: 'E', row: 0, col: 3, fillStep: 1, extractStep: 2, cipherSlot: 1  },
  { id: 4,  char: 'N', row: 0, col: 4, fillStep: 1, extractStep: 3, cipherSlot: 6  },
  { id: 5,  char: 'D', row: 0, col: 5, fillStep: 1, extractStep: 3, cipherSlot: 9  },
  // row 1: T  H  E  C  A  S
  { id: 6,  char: 'T', row: 1, col: 0, fillStep: 1, extractStep: 2, cipherSlot: 2  },
  { id: 7,  char: 'H', row: 1, col: 1, fillStep: 1, extractStep: 4, cipherSlot: 14 },
  { id: 8,  char: 'E', row: 1, col: 2, fillStep: 1, extractStep: 4, cipherSlot: 15 },
  { id: 9,  char: 'C', row: 1, col: 3, fillStep: 1, extractStep: 2, cipherSlot: 3  },
  { id: 10, char: 'A', row: 1, col: 4, fillStep: 1, extractStep: 3, cipherSlot: 7  },
  { id: 11, char: 'S', row: 1, col: 5, fillStep: 1, extractStep: 3, cipherSlot: 10 },
  // row 2: T  L  E  X  X  X
  { id: 12, char: 'T', row: 2, col: 0, fillStep: 1, extractStep: 2, cipherSlot: 4  },
  { id: 13, char: 'L', row: 2, col: 1, fillStep: 1, extractStep: 4, cipherSlot: 16 },
  { id: 14, char: 'E', row: 2, col: 2, fillStep: 1, extractStep: 4, cipherSlot: 17 },
  { id: 15, char: 'X', row: 2, col: 3, fillStep: 1, extractStep: 2, cipherSlot: 5  },
  { id: 16, char: 'X', row: 2, col: 4, fillStep: 1, extractStep: 3, cipherSlot: 8  },
  { id: 17, char: 'X', row: 2, col: 5, fillStep: 1, extractStep: 3, cipherSlot: 11 },
];

const PLAINTEXT = 'DEFENDTHECASTLEXXX'.split('');

const STEPS = [
  {
    label: 'Step 0 — Initialise',
    desc: 'The keyword <strong>ATTACK</strong> is ranked alphabetically: A=1, C=2, K=3, T=4. Duplicate letters share the same rank. The plaintext <em>DEFENDTHECASTLEXXX</em> sits in the input buffer, ready to fill the matrix.',
  },
  {
    label: 'Step 1 — Fill Matrix',
    desc: 'Letters flow from the plaintext buffer into the 6×3 grid, filling it row-by-row from left to right. The grid is now ready for ranked extraction.',
  },
  {
    label: 'Step 2 — Extract Rank 1 (A)',
    desc: '<strong>Columns 1 and 4</strong> both carry rank <strong>A(1)</strong>. Because they share a rank, we sweep both simultaneously left-to-right, row-by-row: <strong>D, E, T, C, T, X</strong>.',
  },
  {
    label: 'Step 3 — Extract Ranks 2 & 3 (C, K)',
    desc: 'Column 5 has rank <strong>C(2)</strong> and column 6 has rank <strong>K(3)</strong>. Both are unique ranks, so we treat them as classic columnar: col 5 top-to-bottom (<strong>N, A, X</strong>), then col 6 (<strong>D, S, X</strong>).',
  },
  {
    label: 'Step 4 — Extract Rank 4 (T)',
    desc: '<strong>Columns 2 and 3</strong> both carry rank <strong>T(4)</strong>. Sweep them simultaneously left-to-right, row-by-row: <strong>E, F, H, E, L, E</strong>. Encryption complete.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const colHighlight = (col: number, step: number): string => {
  if ((col === 0 || col === 3) && step >= 2)
    return 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.25)]';
  if ((col === 4 || col === 5) && step >= 3)
    return 'border-sky-400 bg-sky-400/10 text-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.25)]';
  if ((col === 1 || col === 2) && step >= 4)
    return 'border-violet-500 bg-violet-500/10 text-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.25)]';
  return 'border-white/10 bg-white/[0.02] text-gray-400';
};

const slotColor = (slot: number): string => {
  if (slot < 6)  return 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400';
  if (slot < 12) return 'border-sky-400/50 bg-sky-950/30 text-sky-400';
  return 'border-violet-500/50 bg-violet-950/30 text-violet-400';
};

// ─── Component ───────────────────────────────────────────────────────────────
const InteractiveCipher = () => {
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

  const inGrid    = (l: LetterItem) => step >= l.fillStep && step < l.extractStep;
  const extracted = (l: LetterItem) => step >= l.extractStep;

  const cipherSlots = [...LETTERS].sort((a, b) => a.cipherSlot - b.cipherSlot);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-8 items-stretch text-left w-full">

      {/* Left: Grid + strips */}
      <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6">

        {/* Plaintext source strip */}
        <div className="bg-black/40 border border-white/5 rounded-2xl px-4 py-2 flex items-center gap-3">
          <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase shrink-0">Plaintext</span>
          <div className="flex gap-1 flex-wrap">
            {PLAINTEXT.map((ch, i) => {
              const letter = LETTERS[i];
              const gone = step >= letter.fillStep;
              return (
                <div key={i} className="w-7 h-8 relative flex items-center justify-center">
                  {!gone && (
                    <motion.div
                      layoutId={`enc-letter-${i}`}
                      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
                      className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold bg-white/[0.04] border border-white/10 rounded text-sky-300"
                    >
                      {ch}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info row */}
        <div className="flex justify-between font-mono text-[11px] text-gray-500 border-b border-white/10 pb-2">
          <div>KEY: <span className="text-sky-400 font-bold">ATTACK</span></div>
          <div>RANKING: <span className="text-sky-400 font-bold">1, 4, 4, 1, 2, 3</span></div>
        </div>

        {/* Grid */}
        <div className="flex flex-col items-center gap-2">
          {/* Keyword header */}
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

          {/* Letter cells */}
          <div className="grid grid-cols-6 grid-rows-3 gap-2">
            {Array.from({ length: 18 }).map((_, idx) => {
              const c = idx % 6;
              const letter = LETTERS[idx];
              return (
                <div
                  key={idx}
                  className="w-12 h-12 md:w-14 md:h-14 bg-black/60 border border-white/5 rounded-lg flex items-center justify-center relative font-mono text-xl font-bold"
                >
                  {inGrid(letter) && (
                    <motion.div
                      layoutId={`enc-letter-${idx}`}
                      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
                      className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                        (step >= 2 && (c === 0 || c === 3)) ? 'text-emerald-400' :
                        (step >= 3 && (c === 4 || c === 5)) ? 'text-sky-300' :
                        (step >= 4 && (c === 1 || c === 2)) ? 'text-violet-400' : 'text-gray-100'
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

        {/* Ciphertext output */}
        <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono tracking-wider mb-2">
            <span>CIPHERTEXT OUTPUT</span>
            {step === 2 && <span className="text-emerald-400">[ A(1) → slots 1-6 ]</span>}
            {step === 3 && <span className="text-sky-400">[ C(2)/K(3) → slots 7-12 ]</span>}
            {step === 4 && <span className="text-violet-400">[ T(4) → slots 13-18 ]</span>}
          </div>
          <div className="flex gap-1 flex-wrap">
            {cipherSlots.map((letter) => {
              const filled = extracted(letter);
              return (
                <div key={letter.id} className="w-8 h-10 md:w-9 md:h-11 relative flex items-center justify-center">
                  <div className="absolute inset-0 border border-white/5 rounded bg-black/40" />
                  <span className="absolute bottom-0.5 right-0.5 text-[6px] text-gray-700 font-mono z-10">
                    {letter.cipherSlot + 1}
                  </span>
                  {filled && (
                    <motion.div
                      layoutId={`enc-letter-${letter.id}`}
                      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
                      className={`absolute inset-0 flex items-center justify-center font-mono text-sm font-bold rounded border ${slotColor(letter.cipherSlot)}`}
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
        {/* Title bar */}
        <div className="bg-white/[0.02] px-4 py-3 flex items-center gap-1.5 border-b border-white/[0.08]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span className="font-mono text-[11px] text-gray-400 ml-2">encrypt.sh</span>
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
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mt-3 text-green-400 font-bold text-xs"
              >
                ✓ Encryption Complete.
              </motion.p>
            )}
          </div>
        </div>

        <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] flex gap-2.5 items-center">
          <button
            onClick={advance}
            disabled={step === 4}
            className="flex items-center gap-2 font-sans font-semibold text-xs px-4 py-2.5 rounded-md bg-emerald-500 text-black border border-emerald-500 shadow-md hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
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

export default InteractiveCipher;
