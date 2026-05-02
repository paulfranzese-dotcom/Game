import { useEffect, useMemo, useState } from 'react';
import { BadgeShelf } from './components/BadgeShelf';
import { Dashboard } from './components/Dashboard';
import { GameModeSelector } from './components/GameModeSelector';
import { PlayerSetup } from './components/PlayerSetup';
import { ProgressMap } from './components/ProgressMap';
import { QuestionCard } from './components/QuestionCard';
import { ResultsScreen } from './components/ResultsScreen';
import { GameMode, PlayerData, SessionResult } from './types';
import { createAllFacts, explanation, pickWeightedFact } from './utils/questionEngine';
import { applyAnswer, tableMastery } from './utils/progress';
import { getActivePlayerName, loadPlayer, savePlayer, setActivePlayerName } from './utils/storage';
import { playSound } from './utils/sound';

const initialPlayer = (name: string): PlayerData => ({ playerName: name, xp: 0, level: 1, coins: 0, badges: [], currentStreakDays: 0, bestSpeedRound: 0, totalQuestions: 0, totalCorrect: 0, masteredFacts: 0, facts: createAllFacts(), mistakeQueue: [], unlockedTheme: 'classic', reducedMotion: false, lastPlayDate: null });

function App() {
  const [player, setPlayer] = useState<PlayerData | null>(loadPlayer());
  const [mode, setMode] = useState<GameMode | null>(null);
  const [tableChoice, setTableChoice] = useState(2);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(60);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [session, setSession] = useState({ total: 0, correct: 0, xp: 0, coins: 0 });

  useEffect(() => { if (player) savePlayer(player); }, [player]);
  useEffect(() => { if (mode === 'speed' && timer > 0) { const id = setTimeout(()=>setTimer((t)=>t-1),1000); return ()=>clearTimeout(id);} if (mode==='speed'&&timer===0) finishSession(); }, [timer, mode]);

  const spawnPopup = (text: string, kind: string) => {
    const id = Date.now() + Math.random();
    setPopups((p) => [...p, { id, text, kind }]);
    setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 1600);
  };

  const activeFact = useMemo(() => {
    if (!player || !mode) return null;
    const facts = Object.values(player.facts);
    if (mode === 'practice') return pickWeightedFact(facts, tableChoice);
    if (mode === 'review') return pickWeightedFact(facts, undefined, player.mistakeQueue.length ? player.mistakeQueue : undefined);
    if (mode === 'boss') return pickWeightedFact(facts.filter((f) => f.attempts > 0));
    if (mode === 'adventure') {
      const nextTable = Array.from({ length: 13 }, (_, t) => t).find((t) => !tableMastery(player, t).tableMastered) ?? 12;
      return pickWeightedFact(facts, nextTable);
    }
    return pickWeightedFact(facts);
  }, [player, mode, tableChoice]);

  const addBadge = (p: PlayerData, badge: string) => {
    if (p.badges.includes(badge)) return p;
    playSound('badge', muted); spawnPopup('Badge Unlocked!', 'badge');
    return { ...p, badges: [...p.badges, badge] };
  };

  const switchPlayer = () => {
    const confirmed = window.confirm('Switch player? Current progress is saved.');
    if (!confirmed) return;
    setMode(null); setResult(null); setFeedback(''); setActivePlayerName(null); setPlayer(null);
  };

  const onAnswer = (val: number) => {
    if (!player || !activeFact || Number.isNaN(val)) return;
    const correct = val === activeFact.a * activeFact.b;
    const nextStreak = correct ? streak + 1 : 0;
    setStreak(nextStreak);
    const prevCoins = player.coins;
    const nextPlayer = applyAnswer(player, activeFact.key, correct, nextStreak);
    playSound(correct ? 'correct' : 'wrong', muted);
    setEffectClass(correct ? 'celebrate' : 'shake');
    setTimeout(() => setEffectClass(''), 500);
    if (nextStreak > 0 && nextStreak % 5 === 0) spawnPopup(`Streak: ${nextStreak}! 🔥`, 'streak');
    if (nextPlayer.xp > player.xp) spawnPopup(`+${nextPlayer.xp - player.xp} XP`, 'xp');
    if (nextPlayer.coins > prevCoins) { spawnPopup(`+${nextPlayer.coins - prevCoins} Coins`, 'coin'); playSound('coin', muted); }

    let withBadges = nextPlayer;
    if (nextPlayer.totalCorrect >= 10) withBadges = addBadge(withBadges, 'First 10 Correct');
    if (mode === 'boss' && correct) withBadges = addBadge(withBadges, 'Boss Battle Win');
    setPlayer(withBadges);
    setSession((s) => ({ total: s.total + 1, correct: s.correct + (correct ? 1 : 0), xp: withBadges.xp - player.xp, coins: withBadges.coins - player.coins }));
    setFeedback(correct ? 'Great job! 🌟' : `Not quite. ${activeFact.a} × ${activeFact.b} = ${activeFact.a * activeFact.b}. ${explanation(activeFact.a, activeFact.b)}`);
    if (mode !== 'speed' && session.total >= 9) finishSession();
  };

  const finishSession = () => {
    if (!mode) return;
    playSound('session', muted); spawnPopup('Session Complete! 🎉', 'session');
    setResult({ mode, total: session.total, correct: session.correct, xpEarned: session.xp, coinsEarned: session.coins });
    setMode(null); setSession({ total: 0, correct: 0, xp: 0, coins: 0 }); setTimer(60); setFeedback('');
  };

  if (!player) return <PlayerSetup onStart={(name) => setPlayer(loadPlayer(name) ?? initialPlayer(name))} />;
  if (result) return <ResultsScreen result={result} onClose={() => setResult(null)} />;

  return (
    <main className={`app ${effectClass}`}>
      <div className="popups">{popups.map((p) => <div key={p.id} className={`popup ${p.kind}`}>{p.text}</div>)}</div>
      <header className="card"><h1>Multiplication Quest</h1><div className="row"><button onClick={()=>setPlayer({...player, reducedMotion: !player.reducedMotion})}>Reduced motion: {player.reducedMotion ? 'On' : 'Off'}</button><button onClick={()=>setMuted((m)=>!m)}>{muted ? 'Unmute 🔊' : 'Mute 🔇'}</button><button onClick={switchPlayer}>Switch Player</button></div></header>
      <Dashboard player={player} />
      <BadgeShelf badges={player.badges} />
      <ProgressMap player={player} />
      {!mode && <><label>Practice table: <select value={tableChoice} onChange={(e)=>setTableChoice(Number(e.target.value))}>{Array.from({length:13},(_,n)=><option key={n}>{n}</option>)}</select></label><GameModeSelector onPick={setMode} /></>}
      {mode && activeFact && <><div className="row"><p>{mode==='speed' ? `Time: ${timer}s` : `Question ${session.total+1}/10`}</p><button onClick={switchPlayer}>Start Over</button></div><QuestionCard a={activeFact.a} b={activeFact.b} onAnswer={onAnswer} feedback={feedback} /><button onClick={finishSession}>End Session</button></>}
    </main>
  );
}

export default App;
