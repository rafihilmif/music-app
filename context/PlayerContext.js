import { createContext, useRef, useState, useEffect } from 'react';
export const PlayerContext = createContext();

export const PlayerContextProvider = (props) => {
  const audioRef = useRef(null);
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  useEffect(() => {
    const updateTime = () => {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;

      setTime({
        currentTime: {
          second: Math.floor(currentTime % 60),
          minute: Math.floor(currentTime / 60),
        },
        totalTime: {
          second: Math.floor(duration % 60),
          minute: Math.floor(duration / 60),
        },
      });
    };

    const audioElement = audioRef.current;

    const onLoadedMetadata = () => {
      updateTime();
    };

    if (audioElement) {
      setTimeout(() => {
        audioElement.ontimeupdate = updateTime;
      }, 1000);
      audioElement.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateTime);
        audioElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      }
    };
  }, [audioRef]);


  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};
