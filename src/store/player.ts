import { create } from 'zustand';

/** Représentation d'une piste dans le store du player. */
export interface Track {
  id: string;
  title: string;
  /** Nom de l'artiste principal. */
  artist: string;
  /** URL de la pochette de l'album. */
  artworkUrl?: string;
  /** URL de lecture (preview Deezer ou stream résolu). */
  audioUrl: string;
  /** Durée en secondes (issue de l'API, avant que l'audio la détecte). */
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  /**
   * Lance la lecture d'une piste et remplace la queue.
   * @param {Track} track Piste à lire.
   * @param {Track[]} [queue=[]] File d'attente associée.
   */
  play: (track: Track, queue?: Track[]) => void;
  /** Met la lecture en pause. */
  pause: () => void;
  /** Reprend la lecture. */
  resume: () => void;
  /**
   * Ajuste le volume.
   * @param {number} volume Valeur entre 0 et 1.
   */
  setVolume: (volume: number) => void;
  /**
   * Met à jour la position de lecture (appelé par l'élément audio).
   * @param {number} time Position en secondes.
   */
  setCurrentTime: (time: number) => void;
  /**
   * Met à jour la durée totale (appelé par l'élément audio).
   * @param {number} duration Durée en secondes.
   */
  setDuration: (duration: number) => void;
  /** Passe à la piste suivante dans la queue. */
  next: () => void;
  /** Passe à la piste précédente dans la queue. */
  previous: () => void;
}

/**
 * Store global pour l'état du lecteur audio.
 * @returns {PlayerState} État et actions du player.
 */
export const usePlayerStore = create<PlayerState>()((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,

  play: (track, queue = []) =>
    set({ currentTrack: track, queue, isPlaying: true, currentTime: 0, duration: 0 }),

  pause: () => set({ isPlaying: false }),

  resume: () => set({ isPlaying: true }),

  setVolume: (volume) => set({ volume }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  next: () => {
    const { queue, currentTrack } = get();
    if (!currentTrack) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = queue[idx + 1];
    if (nextTrack) set({ currentTrack: nextTrack, isPlaying: true, currentTime: 0, duration: 0 });
  },

  previous: () => {
    const { queue, currentTrack } = get();
    if (!currentTrack) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = queue[idx - 1];
    if (prevTrack) set({ currentTrack: prevTrack, isPlaying: true, currentTime: 0, duration: 0 });
  },
}));
