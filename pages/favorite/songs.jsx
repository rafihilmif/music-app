import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { PlayArrow, Schedule } from '@mui/icons-material';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { MoreHoriz, ThumbUpAlt } from '@mui/icons-material';

import { baseURLFile } from '@/baseURLFile';

export default function FavoriteSongs() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [avatar, setAvatar] = useState();
  const [dataFavoriteSongs, setDataFavoriteSongs] = useState([]);
  const [totalSongFavorite, setTotalSongFavorite] = useState();
  const [dataSearchSongResults, setDataSearchSongResults] = useState([]);

  const [hoverIndex, setHoverIndex] = useState(null);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('');

  const email =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('email'))
      : null;

  useEffect(() => {
    const fetchDataUser = async () => {
      if (status === 'authenticated' && session.user.email === email) {
        try {
          let response;
          if (session.user.role === 'artist') {
            response = await axios.get(
              `${baseURL}/detail/artist?email=${email}`,
            );
            setId(response.data.id_artist);
            setName(response.data.username);
            setAvatar(response.data.avatar);
          } else if (session.user.role === 'fans') {
            response = await axios.get(`${baseURL}/detail/fans?email=${email}`);
            setId(response.data.id_fans);
            setName(response.data.username);
            setAvatar(response.data.avatar);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchDataUser();
  }, [email, status, session]);

  useEffect(() => {
    const fetchDataFavoriteSongs = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/like/song?id=${id}`);
        setDataFavoriteSongs(response.data.songs);
        setTotalSongFavorite(response.data.totalSongs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataFavoriteSongs();
  }, [id]);

  useEffect(() => {
    const fetchDataSearch = async () => {
      if (searchQuery) {
        try {
          const response = await axios.get(
            `${baseURL}/search/song/like?q=${searchQuery}`,
          );
          setDataSearchSongResults(response.data);
        } catch (error) {
          console.error('Error fetching search data:', error);
        }
      }
    };

    fetchDataSearch();
  }, [searchQuery, dataFavoriteSongs]);

  const handleAddSong = async (idSong) => {
    try {
      await axios
        .post(`${baseURL}/user/add/like/song?idUser=${id}&idSong=${idSong}`)
        .then(alert('Successfully added song to favorite'), router.reload());
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleRemoveSong = async (idSong) => {
    try {
      await axios
        .delete(`${baseURL}/user/like/song?id=${idSong}`)
        .then(alert('Successfully remove song to like'), router.reload());
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    setBackgroundColor(getRandomColor());
  }, []);

  return (
    <>
      <Navbar />
      <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end">
        <div className="relative h-72 w-72">
          <div
            className="h-full w-full rounded-sm"
            style={{
              backgroundColor: backgroundColor,
            }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <ThumbUpAlt className="text-white" style={{ fontSize: 120 }} />
          </div>
        </div>

        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="mb-4 text-5xl font-bold md:text-7xl">
            Like an Song's
          </h2>
          <p className="mt-1">
            <img
              className="inline-block w-5 rounded-full"
              src={`${baseURLFile}/assets/image/avatar/${avatar}`}
              alt=""
            />
            <b> {name} · </b> <b>{totalSongFavorite} songs</b>
          </p>
        </div>
      </div>
      {dataFavoriteSongs.length > 0 && (
        <>
          <div className="mb-4 mt-10 grid grid-cols-3 text-[#a7a7a7]">
            <p className="pl-2">
              <b className="mr-4">#</b>
              Title
            </p>
            <div className="ml-8 flex justify-center">
              <Schedule className="w-4" />
            </div>
            <p className="mr-2 justify-self-end">Options</p>
          </div>

          <hr />

          {dataFavoriteSongs.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className="'grid-cols-2 grid items-center gap-2 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b] sm:grid-cols-2"
            >
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
              <div className="flex items-center justify-between pr-4">
                <p className="mr-4 text-right text-sm text-[#a7a7a7]">3:01</p>
                <div className="relative">
                  <MoreHoriz
                    onClick={() =>
                      setShowOptionsIndex(
                        showOptionsIndex === index ? null : index,
                      )
                    }
                    className="cursor-pointer text-gray-400 hover:text-white"
                  />
                  {showOptionsIndex === index && (
                    <div className="absolute -right-8 z-40 mt-1 w-28 rounded-md bg-[#2f3135] shadow-lg">
                      <button
                        onClick={() => handleRemoveSong(item.id_song)}
                        className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#3e4043]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
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

        {dataSearchSongResults.length > 0 && (
          <div className="max-w-full px-4">
            {dataSearchSongResults.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[auto,1fr,auto,auto] items-center gap-4 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b]"
              >
                <div className="flex items-center">
                  <img
                    className="mr-5 inline w-10 rounded-sm"
                    src={`${baseURLFile}/assets/image/song/${item.image}`}
                    alt={item.name}
                  />
                  <b className="truncate">{item.name}</b>
                </div>
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
