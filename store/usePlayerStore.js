import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { baseURLFile } from '@/baseURLFile';

const usePlayerStore = create(
  persist(
    (set, get) => ({
      playStatus: false,
      currentSong: null,
      songs: [],
      currentSongIndex: 0,
      isLoading: false,
      audioElement: null,
      time: {
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 },
      },

      setSongs: (songs) => set({ songs }),
      setCurrentSongIndex: (index) => set({ currentSongIndex: index }),
      setPlayStatus: (status) => set({ playStatus: status }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      initializeAudio: (audioElement) => {
        set({ audioElement });
        const { currentSong, playStatus } = get();
        if (currentSong && playStatus) {
          audioElement.src = `${baseURLFile}/assets/audio/${currentSong.audio}`;
          audioElement.play().catch(console.error);
        }
      },

      setTime: (newTime) =>
        set((state) => ({
          time: {
            ...state.time,
            ...newTime,
          },
        })),

      setCurrentSong: async (song) => {
        set({ isLoading: true, currentSong: song });
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          set({ playStatus: true, isLoading: false });
        } catch (error) {
          console.error('Error setting current song:', error);
          set({ isLoading: false });
        }
      },

      playPause: () => {
        const { playStatus, audioElement } = get();
        if (audioElement) {
          if (!playStatus) {
            audioElement.play().catch(console.error);
          } else {
            audioElement.pause();
          }
        }
        set({ playStatus: !playStatus });
      },

      nextSong: () => {
        const { songs, currentSongIndex } = get();
        const nextIndex = (currentSongIndex + 1) % songs.length;
        const nextSong = songs[nextIndex];

        if (nextSong) {
          get().setCurrentSong(get().formatSongData(nextSong));
          set({ currentSongIndex: nextIndex });
        }
      },

      prevSong: () => {
        const { songs, currentSongIndex } = get();
        const prevIndex =
          currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
        const prevSong = songs[prevIndex];

        if (prevSong) {
          get().setCurrentSong(get().formatSongData(prevSong));
          set({ currentSongIndex: prevIndex });
        }
      },

      formatSongData: (song) => {
        if (song.Song) {
          return {
            id: song.Song.id_song,
            name: song.Song.name,
            artist: song.Song.Artist.name,
            image: song.Song.image,
            audio: song.Song.audio,
          };
        } else {
          return {
            id: song.id_song,
            name: song.name,
            artist: song.Artist.name,
            image: song.image,
            audio: song.audio,
          };
        }
      },

      updateProgress: (audioElement) => {
        if (!audioElement) return;

        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration || 0;

        set({
          time: {
            currentTime: {
              minute: Math.floor(currentTime / 60),
              second: Math.floor(currentTime % 60),
            },
            totalTime: {
              minute: Math.floor(duration / 60),
              second: Math.floor(duration % 60),
            },
          },
        });
      },
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        currentSong: state.currentSong,
        songs: state.songs,
        currentSongIndex: state.currentSongIndex,
        playStatus: state.playStatus,
        time: state.time,
        currentTime: state.currentTime,
      }),
    },
  ),
);

export default usePlayerStore;
