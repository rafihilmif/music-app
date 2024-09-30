import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { PlayArrow, Schedule } from '@mui/icons-material';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { MoreHoriz } from '@mui/icons-material';

import { baseURLFile } from '@/baseURLFile';

export default function Index() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [idOwnerPlaylist, setIdOwnerPlaylist] = useState('');
  const [idOwnerCheck, setIdOwnerCheck] = useState('');
  const [namePlaylist, setNamePlaylist] = useState('');
  const [imagePlaylist, setImagePlaylist] = useState('');
  const [nameOwner, setNameOwner] = useState('');
  const [avatarOwner, setAvatarOwner] = useState();
  const [dataPlaylistSong, setDataPlaylistSong] = useState([]);
  const [totalSongPlaylist, setTotalSongPlaylist] = useState('');
  const [dataSearchSongResults, setDataSearchSongResults] = useState([]);

  const [hoverIndex, setHoverIndex] = useState(null);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);

  useEffect(() => {
    const fetchDataPlaylist = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/user/detail/playlist?id=${id}`,
        );
        setNamePlaylist(response.data.name);
        setImagePlaylist(response.data.image);
        setIdOwnerPlaylist(response.data.id_user);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataPlaylist();
  }, [id]);

  const email =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('email'))
      : null;

  useEffect(() => {
    const fetchDataOwnerCheck = async () => {
      if (status === 'authenticated' && session.user.email === email) {
        try {
          let response;
          if (session.user.role === 'artist') {
            response = await axios.get(
              `${baseURL}/detail/artist?email=${email}`,
            );
            setIdOwnerCheck(response.data.id_artist);
          } else if (session.user.role === 'fans') {
            response = await axios.get(`${baseURL}/detail/fans?email=${email}`);
            setIdOwnerCheck(response.data.id_fans);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchDataOwnerCheck();
  }, [email, status, session]);

  useEffect(() => {
    const fetchDataOwner = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/owner/playlist?id=${idOwnerPlaylist}`,
        );
        setNameOwner(response.data.name);
        setAvatarOwner(response.data.avatar);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataOwner();
  }, [idOwnerPlaylist]);

  useEffect(() => {
    const fetchDataPlaylistSong = async () => {
      try {
        const response = await axios.get(`${baseURL}/playlist/song?id=${id}`);
        setDataPlaylistSong(response.data.songs);
        setTotalSongPlaylist(response.data.totalSongs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataPlaylistSong();
  }, [id]);

  useEffect(() => {
    const fetchDataSearch = async () => {
      if (searchQuery) {
        try {
          const response = await axios.get(
            `${baseURL}/search/song/playlist?q=${searchQuery}`,
          );
          setDataSearchSongResults(response.data);
        } catch (error) {
          console.error('Error fetching search data:', error);
        }
      }
    };

    fetchDataSearch();
  }, [searchQuery, dataPlaylistSong]);

  const handleAddSong = async (idSong) => {
    try {
      await axios
        .post(
          `${baseURL}/user/add/song/playlist?idPlaylist=${id}&idSong=${idSong}`,
        )
        .then(alert('Successfully added song to playlist'), router.reload());
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleRemoveSong = async (idSong) => {
    try {
      await axios
        .delete(`${baseURL}/user/playlist/song?id=${idSong}`)
        .then(alert('Successfully remove song to playlist'), router.reload());
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end">
        <img
          className="max-h-50 max-w-72 rounded"
          src={`${baseURLFile}/assets/image/playlist/${imagePlaylist}`}
          alt=""
        />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="mb-4 text-5xl font-bold md:text-7xl">
            {namePlaylist}
          </h2>
          <p className="mt-1">
            <img
              className="inline-block w-5 rounded-full"
              src={`${baseURLFile}/assets/image/avatar/${avatarOwner}`}
              alt=""
            />
            <b> {nameOwner} · </b> <b>{totalSongPlaylist} songs</b>
          </p>
        </div>
      </div>

      {/* Playlist Songs */}
      {dataPlaylistSong.length > 0 && (
        <>
          {/* Header Row */}
          <div
            className={`mb-4 mt-10 grid text-[#a7a7a7] ${idOwnerCheck === idOwnerPlaylist ? 'grid-cols-3' : 'grid-cols-2'} sm:grid-cols-${idOwnerCheck === idOwnerPlaylist ? '3' : '2'}`}
          >
            {/* Column 1: Index and Title */}
            <p className="pl-2">
              <b className="mr-4">#</b>
              Title
            </p>

            {/* Column 2: Schedule Icon (centered) */}
            <div
              className={`flex ${idOwnerCheck === idOwnerPlaylist ? 'ml-8 justify-center' : 'justify-self-end pr-10'}`}
            >
              <Schedule className="w-4" />
            </div>

            {/* Column 3: Options Text (aligned right) - only for owner */}
            {idOwnerCheck === idOwnerPlaylist && (
              <p className="mr-2 justify-self-end">Options</p>
            )}
          </div>

          <hr />

          {dataPlaylistSong.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className={`grid items-center gap-2 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b] ${idOwnerCheck === idOwnerPlaylist ? 'grid-cols-2 sm:grid-cols-2' : 'grid-cols-[1fr,auto] sm:grid-cols-[1fr,auto]'}`}
            >
              {/* Song Information */}
              <div className="flex items-center text-white">
                <button className="relative mr-4 flex h-8 w-8 items-center justify-center text-[#a7a7a7] transition-opacity duration-300">
                  <span
                    className={`absolute font-medium transition-opacity duration-300 ${hoverIndex === index ? 'opacity-0' : 'opacity-100'}`}
                  >
                    {index + 1}
                  </span>
                  <PlayArrow
                    className={`absolute transition-opacity duration-300 ${hoverIndex === index ? 'opacity-100' : 'opacity-0'}`}
                  />
                </button>
                <img
                  className="mr-5 inline w-10 rounded-sm"
                  src={`${baseURLFile}/assets/image/song/${item.Song.image}`}
                  alt={item.Song.name}
                />
                <div>
                  <b className="text-md">{item.Song.name}</b>
                  <p className="text-xs text-[#a7a7a7]">
                    {item.Song.Artist.name}
                  </p>
                </div>
              </div>

              {/* Right Column: Song Duration and Options */}
              <div className="flex items-center justify-between pr-4">
                {/* Song Duration */}
                <p className="mr-4 text-right text-sm text-[#a7a7a7]">3:01</p>

                {/* Options for owner only */}
                {idOwnerCheck === idOwnerPlaylist && (
                  <div className="relative">
                    <MoreHoriz
                      onClick={() =>
                        setShowOptionsIndex(
                          showOptionsIndex === index ? null : index,
                        )
                      }
                      className="cursor-pointer text-gray-400 hover:text-white"
                    />

                    {/* Dropdown menu for the song */}
                    {showOptionsIndex === index && (
                      <div className="absolute -right-8 z-40 mt-1 w-28 rounded-md bg-[#2f3135] shadow-lg">
                        <button
                          onClick={() =>
                            handleRemoveSong(item.id_playlist_song)
                          }
                          className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#3e4043]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Search Input and Results */}
      {idOwnerCheck === idOwnerPlaylist && (
        <div className="mt-10 flex flex-col justify-start">
          <h1 className="mb-2">
            Let's find something darkness for your playlist
          </h1>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs"
            className="mb-4 w-full max-w-lg rounded-lg bg-[#2f3135] p-2 text-white"
          />

          {/* Search Results */}
          {dataSearchSongResults.length > 0 && (
            <div className="max-w-full px-4">
              {dataSearchSongResults.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[auto,1fr,auto,auto] items-center gap-4 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b]"
                >
                  {/* Song Name */}
                  <div className="flex items-center">
                    <img
                      className="mr-5 inline w-10 rounded-sm"
                      src={`${baseURLFile}/assets/image/song/${item.image}`}
                      alt={item.name}
                    />
                    <b className="truncate">{item.name}</b>
                  </div>

                  {/* Add Button */}
                  <div className="justify-self-end">
                    <button
                      onClick={() => handleAddSong(item.id_song)}
                      className="rounded-full bg-transparent px-3 py-1 text-white outline outline-1 outline-white hover:outline-2 hover:outline-gray-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
