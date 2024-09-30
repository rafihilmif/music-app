import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import {
  Home,
  Search,
  Receipt,
  LibraryBooks,
  ArrowForward,
  Add,
  Summarize,
  QueueMusic,
  AudioFile,
  StoreMallDirectory,
  CalendarMonth,
  ShoppingCart,
  FavoriteBorder,
  History,
  MoreHoriz,
  HearingRounded,
} from '@mui/icons-material';

export default function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [id, setId] = useState();
  const email =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('email'))
      : null;

  const [role, setRole] = useState();

  const [dataPlaylist, setDataPlaylist] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setRole(session.user.role);
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session.user && email) {
        try {
          let response;
          if (session.user.role === 'artist') {
            response = await axios.get(
              `${baseURL}/detail/artist?email=${email}`,
            );
            setId(response.data.id_artist);
          } else if (session.user.role === 'fans') {
            response = await axios.get(`${baseURL}/detail/fans?email=${email}`);
            setId(response.data.id_fans);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [email, status, session]);

  useEffect(() => {
    const fetchDataPlaylist = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/playlist?id=${id}`);
        setDataPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataPlaylist();
  }, [id]);

  const handleDeletePlaylist = async (idPlaylist) => {
    try {
      await axios
        .delete(`${baseURL}/user/playlist?id=${idPlaylist}`)
        .then(alert('Successfully playlist'), router.reload());
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="hidden h-full w-[25%] flex-col gap-2 p-2 text-white lg:flex">
      {role === 'artist' ? (
        <div className="flex h-[10%] flex-col justify-around rounded bg-[#121212]">
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <Home className="w-6" />
            <a href="/artist" className="font-bold">
              Home
            </a>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <Search className="w-6" />
            <a href="/search" className="font-bold">
              Search
            </a>
          </div>
        </div>
      ) : role === 'fans' ? (
        <div className="flex h-[10%] flex-col justify-around rounded bg-[#121212]">
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <Home className="w-6" />
            <a href="/fans/home" className="font-bold">
              Home
            </a>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <Search className="w-6" />
            <a href="/search" className="font-bold">
              Search
            </a>
          </div>
        </div>
      ) : null}
      {role === 'artist' ? (
        <div className="flex h-[15%] flex-col justify-around gap-2 rounded bg-[#121212]">
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <Receipt className="w-6" />
            <a href="/artist/transaction" className="font-bold">
              Transaction
            </a>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <Summarize className="w-6" />
            <p className="font-bold">Report</p>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <FavoriteBorder className="w-6" />
            <a href="/favorite/songs" className="font-bold">
              Favorite Songs
            </a>
          </div>
        </div>
      ) : role === 'fans' ? (
        <div className="flex h-[15%] flex-col justify-around rounded bg-[#121212]">
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <ShoppingCart className="w-6" />
            <a className="font-bold" href="/fans/cart">
              Cart
            </a>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <History className="w-6" />
            <a href="/fans/history" className="font-bold">
              History
            </a>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <FavoriteBorder className="w-6" />
            <a href="/favorite/songs" className="font-bold">
              Favorite Songs
            </a>
          </div>
        </div>
      ) : null}

      {role === 'artist' ? (
        <div className="flex h-[20%] flex-col justify-around rounded bg-[#121212]">
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <LibraryBooks className="w-6" />
            <a href="/artist/collection/albums" className="font-bold">
              Collection Album
            </a>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <AudioFile className="w-6" />
            <a href="/artist/collection/song" className="font-bold">
              Collection Song
            </a>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <StoreMallDirectory className="w-6" />
            <a href="/artist/collection/merchandise" className="font-bold">
              Collection Merchandise
            </a>
          </div>
          <div className="flex cursor-pointer items-center gap-3 pl-4">
            <CalendarMonth className="w-6" />
            <a href="/artist/collection/shows" className="font-bold">
              Collection Shows
            </a>
          </div>
        </div>
      ) : null}
      <div className="h-[75%] rounded bg-[#121212]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <QueueMusic className="w-8 cursor-not-allowed transition-opacity duration-300 hover:opacity-50" />
            <p className="font-semibold">Your Playlist</p>
          </div>
          <div className="flex items-center gap-3">
            <ArrowForward className="w-8 cursor-not-allowed transition-opacity duration-300 hover:opacity-50" />
            <a href="/playlist/create">
              <Add className="w-8 cursor-pointer hover:opacity-50" />
            </a>
          </div>
        </div>
        {dataPlaylist.length > 0 ? (
          <>
            <div className="m-2 flex flex-col items-start justify-start gap-1 rounded p-4 pl-4 font-semibold">
              {dataPlaylist.map((item) => (
                <div
                  key={item.id_playlist}
                  className="group relative flex w-full cursor-pointer items-center gap-3 rounded hover:bg-[#2f3135]"
                >
                  <a
                    href={`/playlist/${item.id_playlist}`}
                    className="flex-1 text-white hover:underline"
                  >
                    {item.name}
                  </a>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setHoveredIndex(
                          hoveredIndex === item.id_playlist
                            ? null
                            : item.id_playlist,
                        )
                      }
                      className="flex h-6 w-6 items-center justify-center text-white hover:text-gray-400"
                    >
                      <MoreHoriz className="h-5 w-5" />
                    </button>
                    {hoveredIndex === item.id_playlist && (
                      <div className="absolute left-1 mt-1 w-32 rounded bg-[#2f3135] shadow-lg">
                        <a
                          href={`/playlist/update/${item.id_playlist}`}
                          className="block px-4 py-2 text-xs text-white hover:bg-gray-400"
                        >
                          Edit Details
                        </a>
                        <button
                          onClick={() => handleDeletePlaylist(item.id_playlist)}
                          className="block w-full px-4 py-2 text-left text-xs text-red-500 hover:bg-gray-400"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {dataPlaylist.length > 10 && (
              <div className="flex justify-center">
                <button className="mt-4 rounded-full bg-white px-4 py-1.5 text-[15px] text-black hover:bg-gray-200">
                  See All
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="m-2 flex flex-col items-start justify-start gap-1 rounded bg-[#242424] p-4 pl-4 font-semibold">
            <h1>Create your first playlist</h1>
            <p className="font-light">It's easy, we will help you</p>
            <a
              href="/playlist/create"
              className="mt-4 rounded-full bg-white px-4 py-1.5 text-[15px] text-black hover:bg-gray-200"
            >
              Create Playlist
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
