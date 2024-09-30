import React, { useState, useEffect, useContext } from 'react';
import { getSession } from 'next-auth/react';
import Navbar from '@/components/user/Navbar';
import axios from 'axios';
import { MoreHoriz, PlayArrow } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { PlayerContext } from '@/context/PlayerContext';
import Layout from '@/components/user/Layout';
import { useSession } from 'next-auth/react';

export default function index() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [userHasLogin, setUserHasLogin] = useState('');
  const [idUserHasLogin, setIdUserHasLogin] = useState('');
  const [isFollowed, setIsFollowed] = useState(false);

  const [thumbnail, setThumbnail] = useState();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [genre, setGenre] = useState();
  const [desc, setDesc] = useState();

  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataSongPopular, setDataSongPopular] = useState([]);
  const [dataShow, setDataShow] = useState([]);
  const [dataPlaylist, setDataPlaylist] = useState([]);
  const [totalAlbum, setTotalAlbum] = useState();
  const [totalFollower, setTotalFollower] = useState();

  const [dataMerchandise, setDataMerchandise] = useState([]);

  const email =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('email'))
      : null;

  useEffect(() => {
    const fetchDataHasLogin = async () => {
      if (status === 'authenticated' && session.user.email === email) {
        try {
          let response;
          if (session.user.role === 'artist') {
            response = await axios.get(
              `${baseURL}/detail/artist?email=${email}`,
            );
            setUserHasLogin(response.data.username);
          } else if (session.user.role === 'fans') {
            response = await axios.get(`${baseURL}/detail/fans?email=${email}`);
            setUserHasLogin(response.data.username);
            setIdUserHasLogin(response.data.id_fans);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchDataHasLogin();
  }, [email, status, session]);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`${baseURL}/artist?id=${id}`);
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
  }, [id]);

  useEffect(() => {
    const checkIfFollowed = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get(
            `${baseURL}/follow/check?idFans=${idUserHasLogin}&idArtist=${id}`,
          );
          setIsFollowed(response.data?.isFollowed ?? false);
        } catch (error) {
          console.error('Error checking follow status:', error);
          setIsFollowed(false);
        }
      }
    };
    checkIfFollowed();
  }, [status, id, idUserHasLogin]);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/album?id=${id}`,
        );
        setDataAlbum(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAlbumData();
  }, [id]);

  useEffect(() => {
    const fetchDataSongPopular = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/song?id=${id}&limit=1`,
        );
        setDataSongPopular(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataSongPopular();
  }, [id]);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/shows?id=${id}`,
        );
        setDataShow(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchShowData();
  }, [id]);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/playlist?id=${id}`,
        );
        setDataPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchPlaylistData();
  }, [id]);

  useEffect(() => {
    const fetchMerchandiseData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/merchandise?id=${id}`,
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
  }, [id, baseURL]);

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
        const response = await axios.get(`${baseURL}/total/follower?id=${id}`);
        setTotalFollower(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTotalFollower();
  }, [id]);

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
      const response = await axios
        .post(`${baseURL}/follow?idFans=${idUserHasLogin}&idArtist=${id}`)
        .then(router.reload());
      if (response.status === 200) {
        setIsFollowed(true);
      }
    } catch (error) {
      console.error('Error following the artist:', error);
    }
  };
  const handleUnfollow = async () => {
    try {
      const response = await axios
        .delete(`${baseURL}/unfollow?idFans=${idUserHasLogin}&idArtist=${id}`)
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
            <a
              href={`/profile/album/${id}`}
              className="my-5 cursor-pointer text-sm text-gray-400 hover:text-gray-200"
            >
              Show All
            </a>
          </div>
          <div className="flex overflow-auto">
            {dataAlbum.map((item, i) => (
              <a key={i} href={`/album/${item.id_album}`}>
                <div className="min-w-[220px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                  <img
                    className="rounded"
                    width={210}
                    height={210}
                    src={`${baseURLFile}/assets/image/album/${item.image}`}
                  />

                  <p className="mb-1 mt-2 font-bold">{item.name}</p>
                  <p className="text-sm text-slate-200">
                    {item.created_at?.slice(0, 4)} · Album
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <h1 className="text-xl font-bold">Song</h1>
          {dataSongPopular.map((item, index) => (
            <a key={index}>
              <div
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onHoverLeave(index)}
                className="mt-3 grid cursor-pointer grid-cols-2 items-center gap-5 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b] sm:grid-cols-2"
              >
                <div className="flex items-center text-white">
                  <button className="relative mr-4 flex h-8 w-8 items-center justify-center text-[#a7a7a7] transition-opacity duration-300">
                    <span
                      className={`absolute font-medium transition-opacity duration-300 ${hoverIndex[index] ? 'opacity-0' : 'opacity-100'}`}
                    >
                      {index + 1}
                    </span>
                    <PlayArrow
                      className={`absolute transition-opacity duration-300 ${hoverIndex[index] ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </button>
                  <img
                    className="mr-5 inline w-10 rounded-sm"
                    src={`${baseURLFile}/assets/image/song/${item.image}`}
                  />
                  <b>{item.name}</b>
                </div>

                <p>3:01</p>
              </div>
            </a>
          ))}
        </div>
        <h4 hr className="mt-2">
          <a
            className="cursor-pointer text-sm text-gray-400 hover:text-gray-200"
            href={`/profile/song/${id}`}
          >
            See more
          </a>
        </h4>
        <div className="mb-4 mt-10 ">
          <div className="mt-4 flex items-center justify-between">
            <h1 className="my-5 text-xl font-bold">Merchandise</h1>
            <a
              href={`/profile/merchandise/${id}`}
              className="my-5 cursor-pointer text-sm text-gray-400 hover:text-gray-200"
            >
              Show All
            </a>
          </div>
          <div className="flex overflow-auto">
            {dataMerchandise.map((item, i) => (
              <a href={`/detail/merchandise/${item.id_merchandise}`} key={i}>
                <div className="flex min-w-[180px] cursor-pointer flex-col rounded p-2 px-2 hover:bg-gray-700">
                  {item.images && item.images.length > 0 && (
                    <img
                      className="rounded"
                      width={210}
                      height={210}
                      src={`${baseURLFile}/assets/image/merchandise/${item.images[0].name}`}
                      alt={`Merchandise ${item.name}`}
                    />
                  )}
                  <p className="mb-1 mt-2 font-bold">{item.name}</p>
                  <p className="text-sm text-slate-200">{item.artist}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mb-4 mt-10 ">
          <div className="mt-4 flex items-center justify-between">
            <h1 className="my-5 text-xl font-bold">Show</h1>
            <a
              href={`/profile/show/${id}`}
              className="my-5 cursor-pointer text-sm text-gray-400 hover:text-gray-200"
            >
              Show All
            </a>
          </div>
          <div className="flex overflow-auto">
            {dataShow.map((item, i) => (
              <a href={`/detail/show/${item.id_show}`} key={i}>
                <div className="min-w-[220px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                  <img
                    className="rounded"
                    width={210}
                    height={210}
                    src={`${baseURLFile}/assets/image/shows/${item.image}`}
                  />

                  <p className="mb-1 mt-2 font-bold">{item.name}</p>
                  <p className="text-sm text-slate-200">{item.duedate}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mb-4 mt-10 ">
          <h1 className="my-5 text-xl font-bold">Playlist</h1>
          <div className="flex overflow-auto">
            {dataPlaylist.map((item, i) => (
              <a href={`/playlist/${item.id_playlist}`} key={i}>
                <div className="min-w-[220px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                  <img
                    className="rounded"
                    width={210}
                    height={210}
                    src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                  />

                  <p className="mb-1 mt-2 font-bold">{item.name}</p>
                  <p className="text-sm text-slate-200">{item.duedate}</p>
                </div>
              </a>
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
        destination: '/login',
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
