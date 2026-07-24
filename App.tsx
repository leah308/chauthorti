import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, BookOpen, ChevronRight } from 'lucide-react';
import { Dimension, Writer, DIMENSION_NAMES, DIMENSION_POLARS } from './types';
import { WRITERS, QUESTIONS } from './data';

const INITIAL_SCORES: Record<Dimension, number> = {
  emotional: 3,
  rational: 3,
  social: 3,
  life: 3,
  belief: 3,
  resilience: 3,
};

type ViewState = 'start' | 'quiz' | 'result';

export default function App() {
  const [view, setView] = useState<ViewState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<Dimension, number>>(INITIAL_SCORES);
  const [scoreHistory, setScoreHistory] = useState<Record<Dimension, number>[]>([]);

  const handleStart = () => {
    setScores(INITIAL_SCORES);
    setScoreHistory([]);
    setCurrentQuestionIndex(0);
    setView('quiz');
  };

  const handleRestart = () => {
    setScores(INITIAL_SCORES);
    setScoreHistory([]);
    setCurrentQuestionIndex(0);
    setView('start');
  };

  const handleAnswer = (effects: Partial<Record<Dimension, number>>) => {
    setScoreHistory((prev) => [...prev, { ...scores }]);
    setScores((prev) => {
      const next = { ...prev };
      Object.entries(effects).forEach(([dim, val]) => {
        const d = dim as Dimension;
        next[d] = next[d] + (val || 0);
      });
      return next;
    });

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setView('result');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0 && scoreHistory.length > 0) {
      const prevScores = scoreHistory[scoreHistory.length - 1];
      setScores(prevScores);
      setScoreHistory((prev) => prev.slice(0, -1));
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentQuestionIndex === 0) {
      setView('start');
    }
  };

  const matchedWriter = useMemo(() => {
    if (view !== 'result') return null;

    const WRITER_PINYIN: Record<string, string> = {
      '艾青': 'aiqing',
      '巴金': 'bajin',
      '冰心': 'bingxin',
      '丁玲': 'dingling',
      '郭沫若': 'guomoruo',
      '老舍': 'laoshe',
      '鲁迅': 'luxun',
      '路翎': 'luling',
      '茅盾': 'maodun',
      '钱钟书': 'qianzhongshu',
      '沈从文': 'shencongwen',
      '汪曾祺': 'wangzengqi',
      '萧红': 'xiaohong',
      '张爱玲': 'zhangailing',
      '赵树理': 'zhaoshuli',
      '周作人': 'zhouzuoren',
    };

    let bestMatch: Writer = WRITERS[0];
    let minDistance = Infinity;

    WRITERS.forEach((writer) => {
      let distance = 0;
      (Object.keys(scores) as Dimension[]).forEach((dim) => {
        const clampedScore = Math.max(1, Math.min(5, scores[dim]));
        distance += Math.pow(clampedScore - writer.scores[dim], 2);
      });

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = writer;
      } else if (distance === minDistance) {
        const pinyinA = WRITER_PINYIN[writer.name] || writer.name;
        const pinyinB = WRITER_PINYIN[bestMatch.name] || bestMatch.name;
        if (pinyinA.localeCompare(pinyinB) < 0) {
          bestMatch = writer;
        }
      }
    });

    return bestMatch;
  }, [view, scores]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-black selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-sm w-full paper-card p-6 text-center space-y-6 relative overflow-hidden font-typewriter"
          >
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 3.0, ease: "easeOut" }}
                className="tracking-tight mt-4 font-huiwen font-normal text-3xl"
              >
                寻找你在文学史中的倒影
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 3.0, delay: 1.2, ease: "easeOut" }}
                className="text-sm border-y border-black/10 py-8 leading-loose text-dark-indigo font-medium"
              >
                当我们钩沉日渐遥远的历史，<br />那些不朽的灵魂是否还能回应我们的叩问？
              </motion.p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleStart}
                className="w-full py-4 bg-black text-white rounded font-bold tracking-widest hover:bg-black/90 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                开始测试
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
              </button>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 3.0, delay: 2.2, ease: "easeOut" }}
                className="text-xs italic text-stone-500 font-semibold pt-1"
              >
                文学之外，作家们还能有什么？
              </motion.p>
            </div>
          </motion.div>
        )}

        {view === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-lg w-full paper-card p-8 space-y-8"
          >
            <div className="flex justify-between items-center text-xs tracking-widest">
              <span className="text-dark-indigo font-bold">临水自照</span>
              <span className="text-dark-indigo">进度 {currentQuestionIndex + 1} / 20</span>
            </div>
            
            <div className="space-y-6">
              <div className="w-full bg-black/5 h-0.5 overflow-hidden">
                <motion.div 
                  className="h-full bg-black/40"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / 20) * 100}%` }}
                />
              </div>
              <h2 className="text-xl font-bold leading-relaxed font-songti border-l-4 border-black pl-4">
                {QUESTIONS[currentQuestionIndex].text}
              </h2>
            </div>

            <div className="grid gap-4">
              {QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.effects)}
                  className="option-btn w-full p-5 text-left paper-card rounded text-sm leading-relaxed font-songti shadow-sm cursor-pointer"
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-black/5 flex justify-between items-center">
              <button
                onClick={handleBack}
                className="text-[10px] text-dark-indigo opacity-85 hover:opacity-100 transition-opacity flex items-center gap-1 font-serif uppercase tracking-[0.2em] cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 rotate-180"/>
                返回上一页
              </button>
            </div>
          </motion.div>
        )}

        {view === 'result' && matchedWriter && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl w-full paper-card p-10 space-y-8 relative overflow-hidden"
          >
            <div className="space-y-8 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-black/5 rounded-full blur-3xl opacity-50" />
              
              <div className="text-center space-y-8 relative">
                <div className="space-y-3 mt-4 flex flex-col items-center">
                  <h2 
                    className="text-6xl font-bold tracking-tighter mb-1 font-huiwen text-zinc-950"
                  >
                    {matchedWriter.name}
                  </h2>
                </div>
                
                <div className="py-6 border-y border-black/15 space-y-4">
                  <p 
                    style={{ fontFamily: 'Georgia, serif' }} 
                    className="text-lg leading-relaxed italic text-zinc-950 font-extrabold px-4"
                  >
                     {matchedWriter.quote}
                  </p>
                </div>

                <div className="text-left space-y-4 pt-4">
                  <p className="font-songti text-base leading-loose text-justify text-zinc-950 font-semibold indent-8">
                    {matchedWriter.detailedDescription}
                  </p>

                  <div className="pt-6 border-t border-black/15 space-y-4">
                    <h3 className="text-xs font-bold font-songti tracking-wider text-black flex items-center gap-2 uppercase">
                      <span className="w-1.5 h-3.5 bg-black inline-block"></span>
                      人格维度测试分析
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(Object.keys(DIMENSION_NAMES) as Dimension[]).map((dim) => {
                        const uVal = Math.max(1, Math.min(5, scores[dim]));
                        const polars = DIMENSION_POLARS[dim];
                        return (
                          <div key={dim} className="flex flex-col gap-2.5 p-3.5 bg-black/[0.03] border border-black/15 shadow-sm">
                            <div className="flex justify-between items-baseline border-b border-black/[0.08] pb-1">
                              <span className="font-songti font-bold text-xs text-zinc-950">{DIMENSION_NAMES[dim]}</span>
                            </div>
                            
                            <div className="space-y-2 pt-1">
                              {/* User row */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-zinc-800 font-bold font-songti w-9 text-right shrink-0">{polars.left}</span>
                                <div className="flex-1 flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <div 
                                      key={num} 
                                      className={`flex-1 h-2 border border-black/45 ${
                                        num <= uVal ? 'bg-zinc-950' : 'bg-transparent'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] text-zinc-800 font-bold font-songti w-9 text-left shrink-0">{polars.right}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {matchedWriter.literatureExcerpt && (
                    <div className="mt-8 p-6 bg-zinc-950 text-stone-100 rounded-none text-left space-y-4 font-songti shadow-lg border border-zinc-900 relative">
                      <div className="text-xs uppercase tracking-[0.2em] text-stone-400 font-sans font-bold border-b border-zinc-800 pb-3 flex justify-between items-center">
                        <span>水下的蕤纳斯</span>
                        <BookOpen className="w-4 h-4 text-stone-500"/>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed text-justify whitespace-pre-wrap text-stone-200">
                        {matchedWriter.literatureExcerpt}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <button
                  onClick={handleRestart}
                  className="w-full py-4 border border-black/20 rounded text-xs font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all font-songti tracking-widest cursor-pointer"
                >
                  <RefreshCcw className="w-4 h-4"/>
                  重新测试
                </button>
                <p 
                  style={{ marginTop: '25px' }} 
                  className="text-xs italic text-dark-indigo font-medium text-center font-songti"
                >
                  你与他们的体验在此刻联结。
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
