import { PlayerData } from '../types';
const INDEX_KEY = 'multiplication-quest-players-v1';
const ACTIVE_KEY = 'multiplication-quest-active-player-v1';

const playerKey = (name: string) => `multiplication-quest-save-v1:${name.toLowerCase()}`;

export const loadPlayer = (name: string): PlayerData | null => {
  const raw = localStorage.getItem(playerKey(name));
  if (!raw) return null;
  try { return JSON.parse(raw) as PlayerData; } catch { return null; }
};

export const savePlayer = (data: PlayerData) => {
  localStorage.setItem(playerKey(data.playerName), JSON.stringify(data));
  const names = new Set(listPlayers());
  names.add(data.playerName);
  localStorage.setItem(INDEX_KEY, JSON.stringify(Array.from(names)));
  setActivePlayerName(data.playerName);
};

export const listPlayers = (): string[] => {
  const raw = localStorage.getItem(INDEX_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as string[]; } catch { return []; }
};

export const setActivePlayerName = (name: string | null) => {
  if (!name) localStorage.removeItem(ACTIVE_KEY);
  else localStorage.setItem(ACTIVE_KEY, name);
};

export const getActivePlayerName = (): string | null => localStorage.getItem(ACTIVE_KEY);
