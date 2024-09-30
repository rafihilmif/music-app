import React from 'react';
import Image from 'next/image';
import MusicThumb from '../../../../public/images/commonthumbnails/Taylor_Swift_-_Folklore.png';
export default function SongItem() {
  return (
    <div className="min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700">
      <Image className="w-56 rounded" src={MusicThumb} />
      <p className="mb-1 mt-2 font-bold">Pierce The Abyssheart</p>
      <p className="text-sm text-slate-200">Exhumation</p>
    </div>
  );
}
