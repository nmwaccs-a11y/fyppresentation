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
  cipherPos: number;
  row: number;
  col: number;
  fillStep: number;
  extractStep: number;
}

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

// Plaintext order: read grid left-to-right, row-by-row
const PLAINTEXT_ORDER = [...LETTERS].sort((a, b) => (a.row * 6 + a.col) - (b.row * 6 + b.col));

const STEPS = [
  {
    label: 'Initialise',
    title: 'Reverse Setup',
    desc: 'Keyword <strong class="text-white">ATTACK</strong> ranks: A=1, C=2, K=3, T=4. The ciphertext <em>DETCTXNAXDSXEFHELE</em> sits in the buffer. We reverse the fill order to reconstruct the original matrix.',
  },
  {
    label: 'Fill Rank A (1)',
    title: 'Fill Columns A — Rank 1',
    desc: 'Rank 1 columns are <strong class="text-white">cols 1 & 4</strong>. They were filled simultaneously left-to-right when encrypting, so we reverse that: first 6 ciphertext chars <strong class="text-blue-300">D E T C T X</strong> fill these two columns.',
  },
  {
    label: 'Fill Ranks C, K (2, 3)',
    title: 'Fill Columns C, K — Ranks 2 & 3',
    desc: 'Rank 2 (col 5 / C) and rank 3 (col 6 / K) were unique — filled top-to-bottom. Next 3 chars <strong class="text-blue-300">N A X</strong> go into col 5; next 3 chars <strong class="text-blue-300">D S X</strong> go into col 6.',
  },
  {
    label: 'Fill Rank T (4)',
    title: 'Fill Columns T — Rank 4',
    desc: 'Rank 4 columns are <strong class="text-white">cols 2 & 3</strong>. Filled simultaneously left-to-right when encrypting. Remaining 6 chars <strong class="text-blue-300">E F H E L E</strong> fill these columns.',
  },
  {
    label: 'Extract Plaintext',
    title: 'Read the Grid',
    desc: 'The matrix is fully reconstructed. Read left-to-right, row-by-row to recover the original plaintext: <strong class="text-blue-300">DEFENDTHECASTLEXXX</strong>.',
  },
];

// Rank colour palette — consistent with the blue/indigo/violet app accent
const rankColor = (col: number, step: number) => {
  if ((col === 0 || col === 3) && step >= 1)
    return { header: 'border-blue-500/50 bg-blue-500/10 text-blue-300', cell: 'text-blue-300' };
  if ((col === 4 || col === 5) && step >= 2)
    return { header: 'border-indigo-400/50 bg-indigo-400/10 text-indigo-300', cell: 'text-indigo-300' };
  if ((col === 1 || col === 2) && step >= 3)
    return { header: 'border-violet-500/50 bg-violet-500/10 text-violet-300', cell: 'text-violet-300' };
  return { header: 'border-white/[0.08] bg-white/[0.03] text-gray-300', cell: 'text-gray-200' };
};

const cipherSlotColor = (cipherPos: number) => {
  if (cipherPos < 6)  return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
  if (cipherPos < 12) return 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300';
  return 'border-violet-500/30 bg-violet-500/10 text-violet-300';
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 text-left w-full">

      {/* ── LEFT: Visual panel ───────────────────────────────────────── */}
      <div className="backdrop-blur-md bg-white/[0.02] rounded-[2rem] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-6">

        {/* Ciphertext strip */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3 font-medium">Ciphertext Input</p>
          <div className="flex gap-1.5 flex-wrap">
            {cipherOrder.map((letter) => (
              <div key={letter.id} className="w-9 h-10 relative flex items-center justify-center">
                {inCipher(letter) && (
                  <motion.div
                    layoutId={`dec-letter-${letter.id}`}
                    transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                    className={`absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold backdrop-blur-sm border rounded-xl ${cipherSlotColor(letter.cipherPos)}`}
                  >
                    {letter.char}
                  </motion.div>
                )}
              </div>
            ))}
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
              const r = Math.floor(idx / 6);
              const c = idx % 6;
              const letter = LETTERS.find(l => l.row === r && l.col === c);
              const colors = rankColor(c, step);
              return (
                <div
                  key={idx}
                  className="h-12 backdrop-blur-sm bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center relative font-mono text-base font-semibold"
                >
                  {letter && inGrid(letter) && (
                    <motion.div
                      layoutId={`dec-letter-${letter.id}`}
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

        {/* Plaintext output */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">Plaintext Output</p>
            {step === 4 && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-mono text-blue-400"
              >
                Row-by-row read
              </motion.span>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {PLAINTEXT_ORDER.map((letter) => (
              <div key={letter.id} className="w-9 h-10 relative flex items-center justify-center">
                <div className="absolute inset-0 border border-white/[0.06] rounded-xl bg-white/[0.02]" />
                {extracted(letter) && (
                  <motion.div
                    layoutId={`dec-letter-${letter.id}`}
                    transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                    className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300"
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
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/20' :
                  isDone   ? 'bg-white/[0.02] border border-white/[0.04]' :
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
                Decryption complete.
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

export default InteractiveDecryption;
