import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { GameOverScreen, ScoreDisplay, GameProgressBar } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';
import { getOptions } from '@/utils/gameHelpers';

interface ScenarioChoice {
  id?: string;
  label: string;
  nextNodeId?: string;
  isTerminal?: boolean;
  verdict?: 'HALAL' | 'HARAM' | 'MAKRUH' | 'MUSTAHABB' | 'CORRECT' | 'INCORRECT' | 'VALID' | 'INVALID';
  explanation?: string;
}

interface ScenarioNode {
  id: string;
  prompt: string;
  choices?: ScenarioChoice[];
  terminal?: boolean;
  verdict?: string;
  explanation?: string;
}

/**
 * Fiqh Scenario — branching story.
 *
 * Content shapes supported:
 *   1. content.tree = { startNodeId, nodes: { [id]: ScenarioNode } }
 *   2. content.questionText + options[] + correctAnswer (fallback to single-step MCQ)
 */
export default function FiqhScenarioGame() {
  const r = useGameRunner();
  const {
    activeSession, started, lastResult,
    currentRound, totalRounds, currentContent,
    score, submit, playAgain, exitToHub,
  } = r;

  const c = currentContent?.content;

  const { nodes, startId, isTree } = useMemo(() => {
    const tree = c?.tree as { startNodeId?: string; nodes?: Record<string, ScenarioNode> } | undefined;
    if (tree?.nodes && Object.keys(tree.nodes).length > 0) {
      return {
        nodes: tree.nodes,
        startId: tree.startNodeId || Object.keys(tree.nodes)[0],
        isTree: true,
      };
    }
    const options = getOptions(c?.options);
    const correct = String(c?.correctAnswer ?? '');
    const fakeNodes: Record<string, ScenarioNode> = {
      start: {
        id: 'start',
        prompt: (c?.questionText as string) || 'What is the correct ruling?',
        choices: options.map((label, i) => ({
          id: `c-${i}`,
          label,
          isTerminal: true,
          verdict: label === correct ? 'CORRECT' : 'INCORRECT',
          explanation: label === correct
            ? (c?.explanation as string) || 'This is the correct ruling.'
            : 'This is not the correct ruling. Reflect on the underlying principle.',
        })),
      },
    };
    return { nodes: fakeNodes, startId: 'start', isTree: false };
  }, [c]);

  const [currentNodeId, setCurrentNodeId] = useState<string>(startId);
  const [path, setPath] = useState<string[]>([startId]);
  const [terminalChoice, setTerminalChoice] = useState<ScenarioChoice | null>(null);

  useEffect(() => {
    setCurrentNodeId(startId);
    setPath([startId]);
    setTerminalChoice(null);
  }, [startId, currentRound]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const node = nodes[currentNodeId];
  if (!node) {
    return (
      <div className="text-center py-12 text-gray-500">
        Scenario node missing. Please skip.
        <Button onClick={() => submit({ skipped: true, correct: false })} variant="outline" className="mt-4 mx-auto block">Skip</Button>
      </div>
    );
  }

  const handleChoice = (choice: ScenarioChoice) => {
    if (choice.isTerminal || !choice.nextNodeId) {
      setTerminalChoice(choice);
      return;
    }
    setCurrentNodeId(choice.nextNodeId);
    setPath((p) => [...p, choice.nextNodeId!]);
  };

  const handleNext = () => {
    const correct =
      terminalChoice?.verdict === 'CORRECT' ||
      terminalChoice?.verdict === 'HALAL' ||
      terminalChoice?.verdict === 'VALID' ||
      terminalChoice?.verdict === 'MUSTAHABB';
    submit({ path, terminalVerdict: terminalChoice?.verdict, correct });
  };

  const verdictStyles: Record<string, { bg: string; text: string; label: string }> = {
    HALAL:      { bg: 'bg-emerald-100 border-emerald-400', text: 'text-emerald-700', label: 'Halal' },
    HARAM:      { bg: 'bg-red-100 border-red-400',         text: 'text-red-700',     label: 'Haram' },
    MAKRUH:     { bg: 'bg-amber-100 border-amber-400',     text: 'text-amber-700',   label: 'Makruh' },
    MUSTAHABB:  { bg: 'bg-emerald-50 border-emerald-300',  text: 'text-emerald-700', label: 'Mustahabb' },
    VALID:      { bg: 'bg-emerald-100 border-emerald-400', text: 'text-emerald-700', label: 'Valid' },
    INVALID:    { bg: 'bg-red-100 border-red-400',         text: 'text-red-700',     label: 'Invalid' },
    CORRECT:    { bg: 'bg-emerald-100 border-emerald-400', text: 'text-emerald-700', label: 'Correct Ruling' },
    INCORRECT:  { bg: 'bg-red-100 border-red-400',         text: 'text-red-700',     label: 'Not Quite' },
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <ScoreDisplay score={score} />
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          {isTree ? `Step ${path.length}` : 'Scenario'}
        </span>
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200 mb-5">
        <p className="text-xs text-slate-600 uppercase tracking-wider mb-2 font-semibold">The Situation</p>
        <p className="text-gray-800 leading-relaxed whitespace-pre-line">{node.prompt}</p>
      </div>

      {!terminalChoice ? (
        <div className="space-y-2">
          {node.choices?.map((ch, idx) => (
            <button
              key={ch.id ?? idx}
              onClick={() => handleChoice(ch)}
              className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-500 hover:bg-slate-50 transition-all flex items-center gap-3 group"
            >
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 font-medium text-gray-800">{ch.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      ) : (() => {
        const v = terminalChoice.verdict ?? 'INCORRECT';
        const style = verdictStyles[v] ?? verdictStyles.INCORRECT;
        const ok = ['HALAL', 'VALID', 'CORRECT', 'MUSTAHABB'].includes(v);
        return (
          <div className={clsx('p-6 rounded-2xl border-2 text-center', style.bg)}>
            <div className="flex items-center justify-center gap-2 mb-3">
              {ok ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
              <h3 className={clsx('text-2xl font-bold', style.text)}>{style.label}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {terminalChoice.explanation || node.explanation || 'Reflect on this answer.'}
            </p>
            <Button onClick={handleNext} variant="primary" className="mt-5">
              Next Scenario <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        );
      })()}

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
      </div>
    </div>
  );
}
