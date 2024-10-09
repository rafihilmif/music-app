import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/user/Navbar';
import { Schedule, PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { getSession, useSession } from 'next-auth/react';
import usePlayerStore from '@/store/usePlayerStore';

export default function index() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataSong, setDataSong] = useState([]);

  const [nameAlbum, setNameAlbum] = useState('');
  const [nameArtist, setNameArtist] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [durations, setDurations] = useState({});
  const [totalSongs, setTotalSongs] = useState();

  const [idFans, setIdFans] = useState(null);
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
    const fetchDataFansCheck = async () => {
      try {
        if (status === 'authenticated' && session.user.role === 'fans') {
          const response = await axios.get(
            `${baseURL}/detail/fans?email=${session.user.email}`,
          );
          setIdFans(response.data.id_fans);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataFansCheck();
  }, [status, session]);

  useEffect(() => {
    const fetchDataPlan = async () => {
      if (status === 'authenticated' && session.user.role === 'fans') {
        try {
          const response = await axios.get(
            `${baseURL}/fans/plan/detail?id=${idFans}`,
          );
          setPlanStatus(response.data.type);
        } catch (error) {
          console.log("You're not fans");
        }
      }
    };
    if (idFans) {
      fetchDataPlan();
    }
  }, [status, session, idFans]);

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
    async function fetchDataSong() {
      try {
        const response = await axios.get(`${baseURL}/album/song?id=${id}`);
        setDataSong(response.data.songs);
        setSongs(response.data.songs);
        setTotalSongs(response.data.totalSongs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchDataSong();
  }, [id]);

  useEffect(() => {
    async function fetchDataAlbum() {
      try {
        const response = await axios.get(`${baseURL}/album?id=${id}`);
        setDataAlbum(response.data);
        setNameAlbum(response.data.name);
        setNameArtist(response.data.Artist.name);
        setThumbnail(response.data.image);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchDataAlbum();
  }, [id]);

  useEffect(() => {
    if (dataSong.length > 0) {
      dataSong.forEach((song, index) => {
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
  }, [dataSong, baseURLFile]);

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

  return (
    <>
      <Navbar />
      <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end">
        <img
          className="w-72 rounded"
          src={`${baseURLFile}/assets/image/album/${thumbnail}`}
          alt=""
        />
        <div className="flex flex-col">
          <p>Album</p>
          <h2 className="mb-4 text-5xl font-bold md:text-7xl">{nameAlbum}</h2>
          <p className="mt-1">
            <img
              className="inline-block w-5 rounded-full"
              src={`${baseURLFile}/assets/image/album/${thumbnail}`}
              alt=""
            />
            <b> {nameArtist}</b> · <b>{totalSongs} songs</b>
          </p>
        </div>
      </div>
      <div className="mb-4 mt-10 grid grid-cols-2 text-[#a7a7a7] sm:grid-cols-2">
        <p className="pl-2">
          <b className="mr-4">#</b>
          Title
        </p>
        <Schedule className="mr-2 w-4 justify-self-end" />
      </div>
      <hr />
      {dataSong.map((item, index) => (
        <div
          key={index}
          onClick={
            planStatus !== 'free' ? () => handlePlaySong(item, index) : null
          }
          onMouseEnter={planStatus !== 'free' ? () => onHover(index) : null}
          onMouseLeave={
            planStatus !== 'free' ? () => onHoverLeave(index) : null
          }
          className={`grid items-center gap-2 p-2 text-[#a7a7a7] sm:grid-cols-2 ${
            planStatus === 'free'
              ? 'cursor-not-allowed'
              : 'cursor-pointer hover:bg-[#ffffff2b]'
          }`}
        >
          <div className="flex items-center text-white">
            <button
              className="relative mr-4 flex h-8 w-8 items-center justify-center text-[#a7a7a7] transition-opacity duration-300"
              onClick={planStatus !== 'free' ? () => toggleSong() : null}
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
          <p className="mr-2 w-4 justify-self-end">{durations[index]}</p>
        </div>
      ))}
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
