import { PlayerData } from '../types';
const KEY = 'multiplication-quest-save-v1';

export const loadPlayer = (): PlayerData | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as PlayerData; } catch { return null; }
};

export const savePlayer = (data: PlayerData) => localStorage.setItem(KEY, JSON.stringify(data));
