import React, { useEffect, useRef, useState } from 'react';
import { PlayArrow, Pause, SkipNext, SkipPrevious } from '@mui/icons-material';
import usePlayerStore from '@/store/usePlayerStore';
import { baseURLFile } from '@/baseURLFile';

export default function Player() {
  const audioRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const {
    currentSong,
    playStatus,
    isLoading,
    time,
    playPause,
    nextSong,
    prevSong,
    updateProgress,
    initializeAudio,
  } = usePlayerStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isClient) return;

    initializeAudio(audio);

    const handleTimeUpdate = () => {
      updateProgress(audio);
    };

    const handleLoadedMetadata = () => {
      updateProgress(audio);
    };

    const handleEnded = () => {
      nextSong();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [updateProgress, nextSong, isClient, initializeAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong || !isClient) return;

    const newSrc = `${baseURLFile}/assets/audio/${currentSong.audio}`;
    if (audio.src !== newSrc) {
      audio.src = newSrc;
      if (playStatus) {
        audio.play().catch(console.error);
      }
    } else if (playStatus) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [currentSong, playStatus, isClient]);

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentageClicked = clickPosition / progressBarWidth;
    const newTime = percentageClicked * audio.duration;

    audio.currentTime = newTime;
    updateProgress(audio);
  };

  if (!isClient || !currentSong) return null;

  const progressPercentage =
    time.totalTime.minute * 60 + time.totalTime.second === 0
      ? 0
      : ((time.currentTime.minute * 60 + time.currentTime.second) /
          (time.totalTime.minute * 60 + time.totalTime.second)) *
        100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black p-4">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-center">
          <img
            src={`${baseURLFile}/assets/image/song/${currentSong.image}`}
            alt={currentSong.name}
            className="h-12 w-12 rounded"
          />
          <div className="ml-4">
            <div className="text-white">{currentSong.name}</div>
            <div className="text-gray-400">{currentSong.artist}</div>
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={prevSong}
            disabled={isLoading}
            className="text-white hover:text-gray-300"
          >
            <SkipPrevious />
          </button>
          <button
            onClick={playPause}
            disabled={isLoading}
            className="mx-4 text-white hover:text-gray-300"
          >
            {playStatus ? <Pause /> : <PlayArrow />}
          </button>
          <button
            onClick={nextSong}
            disabled={isLoading}
            className="text-white hover:text-gray-300"
          >
            <SkipNext />
          </button>
        </div>

        <div className="flex w-1/3 items-center">
          <span className="mr-2 text-sm text-white">
            {String(time.currentTime.minute).padStart(2, '0')}:
            {String(time.currentTime.second).padStart(2, '0')}
          </span>
          <div
            className="flex-grow cursor-pointer"
            onClick={handleProgressClick}
          >
            <div className="h-1 rounded-full bg-gray-600">
              <div
                className="h-1 rounded-full bg-white"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <span className="ml-2 text-sm text-white">
            {String(time.totalTime.minute).padStart(2, '0')}:
            {String(time.totalTime.second).padStart(2, '0')}
          </span>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}
