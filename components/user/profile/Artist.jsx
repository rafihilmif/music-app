import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { shuffle } from 'lodash';
import { PlayIcon } from '@heroicons/react/24/solid';
import MusicThumb from '../../../public/images/commonthumbnails/Taylor_Swift_-_Folklore.png';
const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple',
];

const Artist = () => {
  const [color, setColor] = useState(colors[0]);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  return (
    <div className="h-screen flex-grow">
      <div className="relative -top-20 h-screen bg-neutral-900">
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 p-8 text-white`}
        >
          <Image className="h-44 w-44 rounded-full" src={MusicThumb} />
          <div>
            <p className="text-sm font-bold">Artist</p>
            <h1 className="text-2xl font-extrabold md:text-3xl lg:text-5xl">
              Exhumation
            </h1>
          </div>
        </section>
        <div className="space-y-4">
          <h2 className="px-8 text-xl font-bold text-white ">Top tracks</h2>
          <div className="flex flex-col space-y-1 px-8 pb-6 text-white"></div>
        </div>
        <div className="space-y-4">
          <h2 className="px-8 text-xl font-bold text-white">Related aritsts</h2>
          <div className="flex flex-wrap gap-4 px-8 pb-28">
            <div className="group relative mb-2 w-56 cursor-pointer rounded-md bg-neutral-800 p-4 hover:bg-neutral-600">
              <div className="absolute right-6 top-[156px] z-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 opacity-0 shadow-2xl shadow-neutral-900 transition-all duration-200 ease-in-out group-hover:top-[148px] group-hover:opacity-100">
                <PlayIcon className="h-6 w-6 text-black" />
              </div>
              <Image className="mb-4 h-48 w-48 rounded-full" src={MusicThumb} />
              <p className="mb-1 w-48 truncate text-base text-white">
                Exhumation
              </p>
              <p className="mb-8 w-48 truncate text-sm text-neutral-400">
                Artist
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Artist;
