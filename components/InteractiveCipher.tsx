import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Check, ChevronRight } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────
const KEYWORD = [
  { char: 'A', rank: 1 },
  { char: 'T', rank: 4 },
  { char: 'T', rank: 4 },
  { char: 'A', rank: 1 },
  { char: 'C', rank: 2 },
  { char: 'K', rank: 3 },
];

interface LetterItem {
  id: number;
  char: string;
  row: number;
  col: number;
  fillStep: number;
  extractStep: number;
  cipherSlot: number;
}

const LETTERS: LetterItem[] = [
  { id: 0,  char: 'D', row: 0, col: 0, fillStep: 1, extractStep: 2, cipherSlot: 0  },
  { id: 1,  char: 'E', row: 0, col: 1, fillStep: 1, extractStep: 4, cipherSlot: 12 },
  { id: 2,  char: 'F', row: 0, col: 2, fillStep: 1, extractStep: 4, cipherSlot: 13 },
  { id: 3,  char: 'E', row: 0, col: 3, fillStep: 1, extractStep: 2, cipherSlot: 1  },
  { id: 4,  char: 'N', row: 0, col: 4, fillStep: 1, extractStep: 3, cipherSlot: 6  },
  { id: 5,  char: 'D', row: 0, col: 5, fillStep: 1, extractStep: 3, cipherSlot: 9  },
  { id: 6,  char: 'T', row: 1, col: 0, fillStep: 1, extractStep: 2, cipherSlot: 2  },
  { id: 7,  char: 'H', row: 1, col: 1, fillStep: 1, extractStep: 4, cipherSlot: 14 },
  { id: 8,  char: 'E', row: 1, col: 2, fillStep: 1, extractStep: 4, cipherSlot: 15 },
  { id: 9,  char: 'C', row: 1, col: 3, fillStep: 1, extractStep: 2, cipherSlot: 3  },
  { id: 10, char: 'A', row: 1, col: 4, fillStep: 1, extractStep: 3, cipherSlot: 7  },
  { id: 11, char: 'S', row: 1, col: 5, fillStep: 1, extractStep: 3, cipherSlot: 10 },
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
    label: 'Initialise',
    title: 'Grid Setup',
    desc: 'Keyword <strong class="text-white">ATTACK</strong> is ranked alphabetically: A=1, C=2, K=3, T=4. Duplicate letters share the same rank. The plaintext <em>DEFENDTHECASTLEXXX</em> is ready to fill the 6×3 matrix.',
  },
  {
    label: 'Fill Matrix',
    title: 'Fill Row by Row',
    desc: 'Plaintext letters flow into the 6×3 grid left-to-right, row-by-row. The grid is now ready for ranked column extraction.',
  },
  {
    label: 'Extract A (1)',
    title: 'Rank 1 — Columns A',
    desc: '<strong class="text-white">Columns 1 & 4</strong> share rank A(1). We sweep them <em>simultaneously</em> left-to-right, row-by-row — not top-to-bottom. Yields: <strong class="text-blue-300">D E T C T X</strong>.',
  },
  {
    label: 'Extract C, K (2, 3)',
    title: 'Ranks 2 & 3 — Columns C, K',
    desc: 'Column 5 (C=2) and Column 6 (K=3) are unique ranks — treated as classic columnar. Read straight down each: <strong class="text-blue-300">N A X</strong> then <strong class="text-blue-300">D S X</strong>.',
  },
  {
    label: 'Extract T (4)',
    title: 'Rank 4 — Columns T',
    desc: '<strong class="text-white">Columns 2 & 3</strong> share rank T(4). Sweep simultaneously left-to-right, row-by-row: <strong class="text-blue-300">E F H E L E</strong>. Encryption complete.',
  },
];

// Rank colour palette — matches the blue/indigo accent of the app
const rankColor = (col: number, step: number) => {
  // Rank 1 cols (0,3) → blue
  if ((col === 0 || col === 3) && step >= 2)
    return { header: 'border-blue-500/50 bg-blue-500/10 text-blue-300', cell: 'text-blue-300' };
  // Rank 2/3 cols (4,5) → indigo
  if ((col === 4 || col === 5) && step >= 3)
    return { header: 'border-indigo-400/50 bg-indigo-400/10 text-indigo-300', cell: 'text-indigo-300' };
  // Rank 4 cols (1,2) → violet
  if ((col === 1 || col === 2) && step >= 4)
    return { header: 'border-violet-500/50 bg-violet-500/10 text-violet-300', cell: 'text-violet-300' };
  return { header: 'border-white/[0.08] bg-white/[0.03] text-gray-300', cell: 'text-gray-200' };
};

const slotColor = (slot: number) => {
  if (slot < 6)  return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
  if (slot < 12) return 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300';
  return 'border-violet-500/30 bg-violet-500/10 text-violet-300';
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 text-left w-full">

      {/* ── LEFT: Visual panel ───────────────────────────────────────── */}
      <div className="backdrop-blur-md bg-white/[0.02] rounded-[2rem] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-6">

        {/* Plaintext strip */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3 font-medium">Plaintext Input</p>
          <div className="flex gap-1.5 flex-wrap">
            {PLAINTEXT.map((ch, i) => {
              const letter = LETTERS[i];
              const gone = step >= letter.fillStep;
              return (
                <div key={i} className="w-9 h-10 relative flex items-center justify-center">
                  {!gone && (
                    <motion.div
                      layoutId={`enc-letter-${i}`}
                      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                      className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl text-blue-200"
                    >
                      {ch}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Keyword header + grid */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3 font-medium">
            Keyword: <span className="text-blue-300 font-semibold">ATTACK</span>
            <span className="ml-3 text-gray-600">→</span>
            <span className="ml-2 text-gray-400">Ranks: 1 · 4 · 4 · 1 · 2 · 3</span>
          </p>
          {/* Keyword row */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            {KEYWORD.map((kw, i) => {
              const colors = rankColor(i, step);
              return (
                <div
                  key={i}
                  className={`h-12 rounded-2xl border flex flex-col items-center justify-center font-mono font-bold text-base relative transition-all duration-400 ${colors.header}`}
                >
                  {kw.char}
                  <span className="absolute bottom-1 right-2 text-[9px] text-red-400/80 font-normal">{kw.rank}</span>
                </div>
              );
            })}
          </div>
          {/* Letter cells */}
          <div className="grid grid-cols-6 grid-rows-3 gap-2">
            {Array.from({ length: 18 }).map((_, idx) => {
              const c = idx % 6;
              const letter = LETTERS[idx];
              const colors = rankColor(c, step);
              return (
                <div
                  key={idx}
                  className="h-12 backdrop-blur-sm bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center relative font-mono text-base font-semibold"
                >
                  {inGrid(letter) && (
                    <motion.div
                      layoutId={`enc-letter-${idx}`}
                      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                      className={`absolute inset-0 flex items-center justify-center rounded-2xl ${colors.cell}`}
                    >
                      {letter.char}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Ciphertext output */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">Ciphertext Output</p>
            {step >= 2 && (
              <motion.span
                key={step}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-mono text-blue-400"
              >
                {step === 2 ? 'Rank A(1) → slots 1–6' : step === 3 ? 'Ranks C,K(2,3) → slots 7–12' : 'Rank T(4) → slots 13–18'}
              </motion.span>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {cipherSlots.map((letter) => (
              <div key={letter.id} className="w-9 h-10 relative flex items-center justify-center">
                <div className="absolute inset-0 border border-white/[0.06] rounded-xl bg-white/[0.02]" />
                <span className="absolute bottom-0.5 right-1 text-[7px] text-gray-700 font-mono z-10">
                  {letter.cipherSlot + 1}
                </span>
                {extracted(letter) && (
                  <motion.div
                    layoutId={`enc-letter-${letter.id}`}
                    transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                    className={`absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold rounded-xl border ${slotColor(letter.cipherSlot)}`}
                  >
                    {letter.char}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Step panel ────────────────────────────────────────── */}
      <div className="backdrop-blur-md bg-white/[0.02] rounded-[2rem] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-6">

        {/* Step list */}
        <div className="flex flex-col gap-2">
          {STEPS.map((s, i) => {
            const isDone    = i < step;
            const isActive  = i === step;
            const isPending = i > step;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/20' :
                  isDone    ? 'bg-white/[0.02] border border-white/[0.04]' :
                              'border border-transparent opacity-40'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all duration-300 ${
                  isDone   ? 'bg-blue-500/20 border border-blue-500/40' :
                  isActive ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_0_16px_rgba(59,130,246,0.4)]' :
                             'bg-white/[0.05] border border-white/10'
                }`}>
                  {isDone
                    ? <Check className="w-3 h-3 text-blue-400" />
                    : <span className={isActive ? 'text-white' : 'text-gray-500'}>{i}</span>}
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive ? 'text-white' : isDone ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Description card */}
        <div className="flex-grow bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">
              {STEPS[step].title}
            </p>
            <p
              className="text-gray-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: STEPS[step].desc }}
            />
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-300"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                  <Check className="w-3 h-3 text-blue-400" />
                </div>
                Encryption complete.
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center">
          <button
            onClick={advance}
            disabled={step === 4}
            className="flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_24px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_32px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 font-semibold text-sm py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-gray-600 font-mono ml-auto">[SPACE]</span>
        </div>
      </div>

    </div>
  );
};

export default InteractiveCipher;
