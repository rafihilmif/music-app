import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/user/Navbar';

import { Edit, Delete, PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import usePlayerStore from '@/store/usePlayerStore';
import { getSession, useSession } from 'next-auth/react';
export default function index() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { name } = router.query;

  const [dataSongTop, setDataSongTop] = useState([]);
  const [dataArtist, setDataArtist] = useState([]);
  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataMerchandise, setDataMerchandise] = useState([]);
  const [dataShows, setDataShows] = useState([]);
  const [dataPlaylist, setDataPlaylist] = useState([]);

  const [nameArtistTop, setNameArtistTop] = useState('');
  const [idArtistTop, setidArtistTop] = useState('');
  const [imageArtistTop, setImageArtistTop] = useState('');
  const [loading, setLoading] = useState(true);
  const [durations, setDurations] = useState({});

  const [planStatus, setPlanStatus] = useState(null);

  const audioRef = useRef(null);
  const {
    setSongs,
    setCurrentSong,
    setCurrentSongIndex,
    playStatus,
    setPlayStatus,
  } = usePlayerStore();

  useEffect(() => {
    const fetchDataPlan = async () => {
      if (status === 'authenticated' && session.user.role === 'fans') {
        try {
          const response = await axios.get(`${baseURL}/fans/plan/detail`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          setPlanStatus(response.data.type);
        } catch (error) {
          console.log("You're not fans");
        }
      }
    };
    if (session) {
      fetchDataPlan();
    }
  }, [status, session]);

  useEffect(() => {
    const fetchDataArtistTop = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/top/artist?name=${name}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        
        setNameArtistTop(response.data.name);
        setidArtistTop(response.data.id_artist);
        setImageArtistTop(response.data.avatar);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (name) {
      fetchDataArtistTop();
    }
  }, [name, session]);

  const handlePlaySong = async (song, index) => {
    if (!song) return;

    const songData = {
      id: song.id_song,
      name: song.name,
      artist: song.Artist.name,
      image: song.image,
      audio: song.audio_path || song.audio,
    };
    try {
      await setCurrentSong(songData);
      setCurrentSongIndex(index);
      setPlayStatus(true);
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error setting up song:', error);
    }
  };

  const toggleSong = async (e, song, index) => {
    if (e) {
      e.stopPropagation();
    }
    const currentSong = usePlayerStore.getState().currentSong;
    if (currentSong && song && currentSong.id === song.id_song) {
      if (playStatus) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      await handlePlaySong(song, index);
    }
  };

  useEffect(() => {
    if (dataSongTop.length > 0) {
      dataSongTop.forEach((song, index) => {
        const audio = new Audio(`${baseURLFile}/assets/audio/${song.audio}`);
        audio.onloadedmetadata = () => {
          const duration = audio.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

          setDurations((prev) => ({
            ...prev,
            [index]: formattedTime,
          }));
        };
      });
    }
  }, [dataSongTop, baseURLFile]);

  useEffect(() => {
    const fetchDataSongTop = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/top/song?name=${name}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataSongTop(response.data);
        setSongs(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataSongTop();
    }
  }, [name, session]);

  useEffect(() => {
    const fetchDataArtist = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/artist?name=${name}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataArtist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataArtist();
    }
  }, [name, session]);

  useEffect(() => {
    const fetchDataAlbum = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/album?name=${name}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataAlbum(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataAlbum();
    }
  }, [name, session]);

  useEffect(() => {
    const fetchDataMerch = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/merchandise?name=${name}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const merchandiseData = response.data;

        const updatedMerchandiseData = await Promise.all(
          merchandiseData.map(async (item) => {
            const images = await fetchImageData(item.id_merchandise);
            return { ...item, images };
          }),
        );

        setDataMerchandise(updatedMerchandiseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchDataMerch();
    }
  }, [name, session]);

  const fetchImageData = async (id_merch) => {
    try {
      const response = await axios.get(
        `${baseURL}/image/merchandise?id=${id_merch}&number=1`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching image data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchDataShows = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/show?name=${name},`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataShows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataShows();
    }
  }, [name, session]);

  useEffect(() => {
    const fetchDataPlaylist = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/playlist?name=${name}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataPlaylist();
    }
  }, [name, session]);

  const [hoverIndex, setHoverIndex] = useState([]);

  const onHover = (index) => {
    const newHoverIndex = [...hoverIndex];
    newHoverIndex[index] = true;
    setHoverIndex(newHoverIndex);
  };

  const onHoverLeave = (index) => {
    const newHoverIndex = [...hoverIndex];
    newHoverIndex[index] = false;
    setHoverIndex(newHoverIndex);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="mb-4 mt-4 flex px-2">
        <div className="flex max-w-md flex-1 flex-col">
          <h1 className="my-2 text-2xl font-bold">Result</h1>
          <a href={`/profile/${idArtistTop}`}>
            <div className="flex h-full min-w-[300px] cursor-pointer flex-col items-center justify-center rounded-lg bg-[#181818] p-2 px-2 hover:bg-gray-700">
              <img
                className="h-44 w-44 rounded-full"
                src={`${baseURLFile}/assets/image/avatar/${imageArtistTop}`}
                alt={nameArtistTop}
              />
              <div className="text-center">
                <p className="mb-1 mt-2 text-4xl font-bold">{nameArtistTop}</p>
                <p className="text-sm text-slate-200">Artist</p>
              </div>
            </div>
          </a>
        </div>

        <div className="ml-4 flex-1">
          <h1 className="my-2 text-2xl font-bold">Top Songs</h1>
          <div className="flex flex-col gap-2 overflow-auto">
            {dataSongTop.map((item, index) => (
              <div
                key={index}
                onClick={() => handlePlaySong(item, index)}
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onHoverLeave(index)}
                className="flex cursor-pointer items-center space-x-4 rounded-lg p-3 hover:bg-gray-700"
              >
                <div className="flex items-center text-white">
                  <button
                    onClick={planStatus !== 'free' ? () => toggleSong() : null}
                    className="relative mr-4 flex h-8 w-8 items-center justify-center text-[#a7a7a7] transition-opacity duration-300"
                    disabled={planStatus === 'free'}
                  >
                    <span
                      className={`absolute font-medium transition-opacity duration-300 ${
                        hoverIndex[index] ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <PlayArrow
                      className={`absolute transition-opacity duration-300 ${
                        hoverIndex[index] ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </button>
                  <img
                    className="mr-5 inline w-10 rounded-sm"
                    src={`${baseURLFile}/assets/image/song/${item.image}`}
                    alt={item.name}
                  />
                  <b>{item.name}</b>
                </div>
                <p>{durations[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-2 text-2xl font-bold">Artists</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataArtist.map((item, i) => (
            <a key={i} href={`/profile/${item.id_artist}`}>
              <div className="min-w-[140px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                <img
                  className="h-36 w-36 rounded-full object-cover"
                  src={`${baseURLFile}/assets/image/avatar/${item.avatar}`}
                />
                <p className="mb-1 mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-slate-200">Artist</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Albums</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataAlbum.map((item, i) => (
            <a key={i} href={`/album/${item.id_album}`}>
              <div className="w-[180px] min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700">
                <div className="aspect-square w-full overflow-hidden rounded">
                  <img
                    className="h-full w-full object-cover"
                    src={`${baseURLFile}/assets/image/album/${item.image}`}
                    alt={item.name}
                  />
                </div>
                <p className="mb-1 mt-2 truncate font-bold">{item.name}</p>
                <p className="truncate text-sm text-slate-200">
                  {item.Artist.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Merchandise</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataMerchandise.map((item, i) => (
            <a href={`/detail/merchandise/${item.id_merchandise}`} key={i}>
              <div className="w-[180px] min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700">
                <div className="aspect-square w-full overflow-hidden rounded">
                  <img
                    className="h-full w-full object-cover"
                    src={`${baseURLFile}/assets/image/merchandise/${item.images[0].name}`}
                    alt={item.name}
                  />
                </div>
                <p className="mb-1 mt-2 truncate font-bold">{item.name}</p>
                <p className="truncate text-sm text-slate-200">
                  {item.Artist.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Shows</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataShows.map((item, i) => (
            <a href={`/detail/show/${item.id_show}`} key={i}>
              <div className="w-[180px] min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700">
                <div className="aspect-square w-full overflow-hidden rounded">
                  <img
                    className="h-full w-full object-cover"
                    src={`${baseURLFile}/assets/image/shows/${item.image}`}
                  />
                </div>
                <p lassName="mb-1 mt-2 truncate font-bold">{item.name}</p>
                <p className="truncate text-sm text-slate-200">
                  {item.duedate}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-2 text-2xl font-bold">Playlists</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          <div className="flex flex-wrap gap-6 overflow-auto">
            {dataPlaylist.map((item, i) => (
              <a href={`/playlist/${item.id_playlist}`} key={i}>
                <div className="w-[180px] min-w-[180px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                  <div className="aspect-square w-full overflow-hidden rounded">
                    <img
                      className="h-full w-full object-cover"
                      src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                    />
                  </div>
                  <p className="mb-1 mt-2 truncate font-bold">{item.name}</p>
                  <p className="truncate text-sm text-slate-200">Playlist</p>
                </div>
              </a>
            ))}
          </div>
        </div>
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
