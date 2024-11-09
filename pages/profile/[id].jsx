import React, { useState, useEffect, useRef } from 'react';
import { getSession } from 'next-auth/react';
import Navbar from '@/components/user/Navbar';
import axios from 'axios';
import { MoreHoriz, PlayArrow } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import Layout from '@/components/user/Layout';
import { useSession } from 'next-auth/react';
import usePlayerStore from '@/store/usePlayerStore';
import Link from 'next/link';

export default function index() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  
  const [userHasLogin, setUserHasLogin] = useState('');
  
  const [isFollowed, setIsFollowed] = useState(false);
  const [planStatus, setPlanStatus] = useState(null);

  const [thumbnail, setThumbnail] = useState();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [genre, setGenre] = useState();
  const [desc, setDesc] = useState();

  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataSong, setDataSong] = useState([]);
  const [dataShow, setDataShow] = useState([]);
  const [dataPlaylist, setDataPlaylist] = useState([]);

  const [totalFollower, setTotalFollower] = useState();
  const [durations, setDurations] = useState({});

  const [dataMerchandise, setDataMerchandise] = useState([]);
  const audioRef = useRef(null);
  const {
    setSongs,
    setCurrentSong,
    setCurrentSongIndex,
    playStatus,
    setPlayStatus,
  } = usePlayerStore();

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
    const fetchDataHasLogin = async () => {
      if (status === 'authenticated') {
        try {
          let response;
          if (session.user.role === 'artist') {
            response = await axios.get(
              `${baseURL}/detail/artist?email=${session.user.email}`,
            );
            setUserHasLogin(response.data.username);
          } else if (session.user.role === 'fans') {
            response = await axios.get(`${baseURL}/detail/fans`, {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
              },
            });
            setUserHasLogin(response.data.username);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchDataHasLogin();
  }, [status, session]);

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
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`${baseURL}/artist?id=${id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setName(response.data.name);
        setUsername(response.data.username);
        setThumbnail(response.data.avatar);
        setGenre(response.data.genre);
        setDesc(response.data.description);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchArtistData();
  }, [id, session]);

  useEffect(() => {
    const checkIfFollowed = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get(
            `${baseURL}/follow/check?idArtist=${id}`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          );
          setIsFollowed(response.data?.isFollowed ?? false);
        } catch (error) {
          console.error('Error checking follow status:', error);
          setIsFollowed(false);
        }
      }
    };
    checkIfFollowed();
  }, [status, id, session]);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/album?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataAlbum(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAlbumData();
  }, [id, session]);

  useEffect(() => {
    const fetchDataSong = async () => {
      try {
        const response = await axios.get(`${baseURL}/collection/song?id=${id}`);
        setDataSong(response.data.data);
        setSongs(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataSong();
  }, [id, session]);

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

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/shows?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataShow(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchShowData();
    }
  }, [id, session]);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/playlist?id=${id}`,
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
      }
    };
    if (session) {
      fetchPlaylistData();
    }
  }, [id, session]);

  useEffect(() => {
    const fetchMerchandiseData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/merchandise?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const merchandiseData = response.data.data;
        const updatedMerchandiseData = await Promise.all(
          merchandiseData.map(async (item) => {
            const images = await fetchImageData(item.id_merchandise);
            return { ...item, images };
          }),
        );
        setDataMerchandise((prevData) => [
          ...prevData,
          ...updatedMerchandiseData,
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchMerchandiseData();
    }
  }, [id, baseURL, session]);

  const fetchImageData = async (id_merch) => {
    try {
      const response = await axios.get(
        `${baseURL}/artist/image/merchandise?id=${id_merch}&number=1`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching image data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchTotalFollower = async () => {
      try {
        const response = await axios.get(`${baseURL}/total/follower?id=${id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setTotalFollower(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchTotalFollower();
    }
  }, [id, session]);

  const [hoverIndex, setHoverIndex] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

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

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/follow?idArtist=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        setIsFollowed(true);
        window.location.reload();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error following the artist';
      alert(errorMessage);
      console.error('Follow error:', error);
    }
  };
  const handleUnfollow = async () => {
    try {
      const response = await axios
        .delete(`${baseURL}/unfollow?idArtist=${id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then(router.reload());
      if (response.data.success) {
        setIsFollowed(false);
      }
    } catch (error) {
      console.error('Error unfollowing the artist:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Layout>
        <div className={`mt-10 flex flex-col gap-8 md:flex-row md:items-end`}>
          <div className="bg-gray-100" />
          <img
            className="h-72 w-72 rounded-full"
            src={`${baseURLFile}/assets/image/avatar/${thumbnail}`}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold">Artist</p>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-extrabold md:text-3xl lg:text-8xl">
                {name}
              </h1>
              {session?.user?.role !== 'artist' &&
                (!isFollowed ? (
                  <button
                    className="rounded-full border border-gray-500 bg-transparent px-6 py-2 text-white transition duration-300 hover:border-white hover:bg-gray-800"
                    onClick={handleFollow}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="cursor-pointer rounded-full border border-gray-500 bg-transparent px-6 py-2 text-gray-500"
                    onClick={handleUnfollow}
                  >
                    Following
                  </button>
                ))}
            </div>
            <p className="text-md font-bold">
              <b>{totalFollower}</b> followers
            </p>
          </div>
        </div>
        <div className="relative mt-10 space-x-10">
          <MoreHoriz
            className="h-10 w-10 cursor-pointer"
            onClick={toggleOptions}
          />
          {showOptions && (
            <div className="absolute -left-10 mt-1 w-48 rounded-lg bg-[#2f3135] shadow-lg">
              <ul className="py-1 text-white">
                {username === userHasLogin ? (
                  <li
                    className="block cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => router.push('/artist/account')}
                  >
                    Edit
                  </li>
                ) : (
                  <li
                    className="block cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => router.push(`/reported/${id}`)}
                  >
                    Report
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className="mb-4 mt-10 ">
          <div className="mt-4 flex items-center justify-between">
            <h1 className="my-5 text-xl font-bold">Discography</h1>
            <Link
              href={`/profile/album/${id}`}
              className="my-5 cursor-pointer text-sm text-gray-400 hover:text-gray-200"
            >
              Show All
            </Link>
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {dataAlbum.map((item, i) => (
              <Link key={i} href={`/album/${item.id_album}`}>
                <div className="w-[230px] flex-shrink-0 cursor-pointer rounded p-2 hover:bg-gray-700">
                  <div className="h-[210px] w-[210px] overflow-hidden rounded">
                    <img
                      className="h-full w-full object-cover"
                      src={`${baseURLFile}/assets/image/album/${item.image}`}
                      alt={item.name}
                    />
                  </div>
                  <p className="mb-1 mt-2 truncate font-bold">{item.name}</p>
                  <p className="truncate text-sm text-slate-200">
                    {item.created_at?.slice(0, 4)} · Album
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <h1 className="text-xl font-bold">Song</h1>
          {dataSong.map((item, index) => (
            <div key={index}>
              <div
                onClick={
                  planStatus !== 'free'
                    ? () => handlePlaySong(item, index)
                    : null
                }
                onMouseEnter={
                  planStatus !== 'free' ? () => onHover(index) : null
                }
                onMouseLeave={
                  planStatus !== 'free' ? () => onHoverLeave(index) : null
                }
                className={`mt-3 grid items-center gap-5 p-2 text-[#a7a7a7] ${
                  planStatus === 'free'
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer hover:bg-[#ffffff2b]'
                } sm:grid-cols-2`}
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
            </div>
          ))}
        </div>
        <h4 className="mt-2">
          <Link
            className="cursor-pointer text-sm text-gray-400 hover:text-gray-200"
            href={`/profile/song/${id}`}
          >
            See more
          </Link>
        </h4>
        <div className="mb-4 mt-10 ">
          <div className="mt-4 flex items-center justify-between">
            <h1 className="my-5 text-xl font-bold">Merchandise</h1>
            <Link
              href={`/profile/merchandise/${id}`}
              className="my-5 cursor-pointer text-sm text-gray-400 hover:text-gray-200"
            >
              Show All
            </Link>
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {dataMerchandise.map((item, i) => (
              <Link href={`/detail/merchandise/${item.id_merchandise}`} key={i}>
                <div className="w-[230px] flex-shrink-0 cursor-pointer rounded p-2 hover:bg-gray-700">
                  <div className="h-[210px] w-[210px] overflow-hidden rounded">
                    {item.images && item.images.length > 0 && (
                      <img
                        className="h-full w-full object-cover"
                        src={`${baseURLFile}/assets/image/merchandise/${item.images[0].name}`}
                        alt={`Merchandise ${item.name}`}
                      />
                    )}
                  </div>
                  <p className="mb-1 mt-2 truncate font-bold">{item.name}</p>
                  <p className="truncate text-sm text-slate-200">
                    {item.artist}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-4 mt-10 ">
          <div className="mt-4 flex items-center justify-between">
            <h1 className="my-5 text-xl font-bold">Show</h1>
            <Link
              href={`/profile/show/${id}`}
              className="my-5 cursor-pointer text-sm text-gray-400 hover:text-gray-200"
            >
              Show All
            </Link>
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {dataShow.map((item, i) => (
              <Link href={`/detail/show/${item.id_show}`} key={i}>
                <div className="w-[230px] flex-shrink-0 cursor-pointer rounded p-2 hover:bg-gray-700">
                  <div className="h-[210px] w-[210px] overflow-hidden rounded">
                    <img
                      className="h-full w-full object-cover"
                      src={`${baseURLFile}/assets/image/shows/${item.image}`}
                      alt={item.name}
                    />
                  </div>
                  <p className="mb-1 mt-2 truncate font-bold">{item.name}</p>
                  <p className="truncate text-sm text-slate-200">
                    {item.duedate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-4 mt-10 ">
          <h1 className="my-5 text-xl font-bold">Playlist</h1>
          <div className="flex space-x-4 overflow-x-auto">
            {dataPlaylist.map((item, i) => (
              <Link href={`/playlist/${item.id_playlist}`} key={i}>
                <div className="w-[230px] flex-shrink-0 cursor-pointer rounded p-2 hover:bg-gray-700">
                  <div className="h-[210px] w-[210px] overflow-hidden rounded">
                    <img
                      className="h-full w-full object-cover"
                      src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                      alt={item.name}
                    />
                  </div>
                  <p className="mb-1 mt-2 truncate font-bold">{item.name}</p>
                  <p className="truncate text-sm text-slate-200">
                    {item.duedate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-4 h-72 max-w-4xl overflow-hidden rounded-xl shadow-lg ">
          <img
            className="z-0 h-72 w-full rounded-lg object-fill transition-all duration-300 hover:scale-110"
            src={`${baseURLFile}/assets/image/avatar/${thumbnail}`}
          />
          <div className="relative -mt-52 px-6 py-5">
            <p className="text-lg font-semibold text-white">
              {totalFollower} followers
            </p>
            <p className="text-justify text-base text-white">{desc}</p>
          </div>
          <div className="px-6 ">
            <span className="relative mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
              {genre}
            </span>
          </div>
        </div>
      </Layout>
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
