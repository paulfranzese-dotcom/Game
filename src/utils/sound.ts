export type SoundEvent = 'correct' | 'wrong' | 'coin' | 'badge' | 'session';

let audioCtx: AudioContext | null = null;

const tone = (freq: number, duration = 0.12, type: OscillatorType = 'sine') => {
  audioCtx = audioCtx ?? new AudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.value = 0.0001;
  osc.connect(gain); gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.start(now); osc.stop(now + duration);
};

export const playSound = (event: SoundEvent, muted: boolean) => {
  if (muted) return;
  if (event === 'correct') tone(700, 0.1, 'triangle');
  if (event === 'wrong') tone(220, 0.2, 'sawtooth');
  if (event === 'coin') { tone(880, 0.08); setTimeout(()=>tone(1100,0.08), 80); }
  if (event === 'badge') { tone(523,0.12); setTimeout(()=>tone(659,0.12),100); setTimeout(()=>tone(784,0.2),220); }
  if (event === 'session') { tone(392,0.08); setTimeout(()=>tone(523,0.12),100); setTimeout(()=>tone(784,0.2),220); }
};
