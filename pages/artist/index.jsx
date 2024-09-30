import React, { useContext, useState, useEffect } from 'react';
import { PlayerContext } from '@/context/PlayerContext';
import { useRouter } from 'next/navigation';
import { baseURLFile } from '@/baseURLFile';
import Navbar from '@/components/user/Navbar';
import { useSession, getSession } from 'next-auth/react';

export default function MainLayoutArtist() {
  return (
    <>
      <Navbar />
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Discover a</h1>
        <div className="flex flex-wrap gap-6 overflow-auto"></div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Popular Song</h1>
        <div className="flex flex-wrap gap-6 overflow-auto"></div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Popular Artist</h1>
        <div className="flex flex-wrap gap-6 overflow-auto"></div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Album</h1>
        <div className="flex flex-wrap gap-6 overflow-auto"></div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Your Playlist</h1>
        <div className="flex flex-wrap gap-6 overflow-auto"></div>
      </div>
    </>
  );
}
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...session,
    },
  };
}
