import React, { useContext, useEffect } from 'react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

import {
  SkipPrevious,
  PlayArrow,
  SkipNext,
  VolumeUp,
  CropFree,
  Pause,
} from '@mui/icons-material';
import { PlayerContext } from '@/context/PlayerContext';
export default function Player() {
  const { seekBar, seekBg, playStatus, play, pause, track, time } =
    useContext(PlayerContext);

  if (!track) return null;


  return (
    <div className="flex h-[10%] items-center justify-between bg-black px-4 text-white">
      <div className="hidden items-center gap-4 lg:flex ">
        <img
          className="w-12 rounded"
          src={`${baseURLFile}/assets/image/song/${track[0].image}`}
        />
        <div>
          {track[0].name}
          <p>{track[0].Artist.name}</p>
        </div>
      </div>
      <div className="m-auto flex flex-col items-center gap-1">
        <div className="flex gap-4">
          <SkipPrevious className="w-6 cursor-pointer" />
          {playStatus ? (
            <button onClick={pause}>
              <Pause className="w-6 cursor-pointer" />
            </button>
          ) : (
            <button onClick={play}>
              <PlayArrow className="w-6 cursor-pointer" />
            </button>
          )}
          <SkipNext className="w-6 cursor-pointer" />
        </div>
        <div className="flex items-center gap-5">
          <p>
            {time.currentTime.minute} : {time.currentTime.second}
          </p>
          <div
            ref={seekBg}
            className="w-[60vw] max-w-[500px] cursor-pointer rounded-full bg-gray-300"
          >
            <hr
              ref={seekBar}
              className="h-1 w-10 rounded-full border-none bg-blue-500"
            />
          </div>
          <p>
            {time.totalTime.minute} : {time.totalTime.second}
          </p>
        </div>
      </div>
      <div className="hidden items-center gap-2 opacity-75 lg:flex">
        <VolumeUp className="w-4 cursor-pointer" />
        <div className="h-1 w-24 rounded bg-slate-50"></div>
        <CropFree className="w-4 cursor-pointer" />
      </div>
    </div>
  );
}
