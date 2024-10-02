// import { create } from 'zustand';

// const usePlayerStore = create((set, get) => ({
//   currentSong: 0,
//   audio: null,
//   currentTime: 0,
//   duration: 0,
//   isPlay: false,

//   initAudio: (audioElement) => {
//     set({ audio: audioElement });

//     audioElement.addEventListener('loadedmetadata', () => {
//       set({ duration: audioElement.duration });
//     });
//   },
//   toggleSong: () => {
//     const { audio, isPlay } = get();
//     if (audio) {
//       if (isPlay) {
//         audio.pause();
//       } else {
//         audio.play();
//       }
//       set({ isPlay: !isPlay });
//     }
//     },
//     nextSong: () => {
//         const { audio, currentSong } = get();
//         const nextIndex = (currentSong + 1)
//     }
// }));

// export default usePlayerStore;
