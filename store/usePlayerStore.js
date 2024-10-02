import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  track: null,
  playStatus: false,
  time: {
    currentTime: { minute: '00', second: '00' },
    totalTime: { minute: '00', second: '00' },
  },
  seekBar: null,
  seekBg: null,

  setTrack: (track) => set({ track }),
  setPlayStatus: (status) => set({ playStatus: status }),
  setTime: (time) => set({ time }),
  setSeekBar: (ref) => set({ seekBar: ref }),
  setSeekBg: (ref) => set({ seekBg: ref }),

  play: () => set({ playStatus: true }),
  pause: () => set({ playStatus: false }),
}));

export default usePlayerStore;
