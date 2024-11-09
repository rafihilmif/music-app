import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { getSession, useSession } from 'next-auth/react';
import Navbar from '@/components/user/Navbar';
import Link from 'next/link';

export default function index() {
  const { data: session } = useSession();

  const [genre, setGenre] = useState();
  const [userName, setUserName] = useState();

  const [discoverArtist, setDiscoverArtist] = useState([]);
  const [dataRandomPlaylist, setDataRandomPlaylist] = useState([]);
  const [dataRandomMerchandise, setDataRandomMerchandise] = useState([]);
  const [dataRandomAlbum, setDataRandomAlbum] = useState([]);

  const [dataPlaylist, setDataPlaylist] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/detail/artist`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setGenre(response.data.genre);
        setUserName(response.data.username);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    const fetchDataDiscoverArtist = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/discover/artist/genre?name=${genre}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDiscoverArtist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataDiscoverArtist();
    }
  }, [session, genre]);

  useEffect(() => {
    const fetchDataRandomPlaylist = async () => {
      try {
        const response = await axios.get(`${baseURL}/playlist`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setDataRandomPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataRandomPlaylist();
    }
  }, [session]);

  useEffect(() => {
    const fetchDataAlbum = async () => {
      try {
        const response = await axios.get(`${baseURL}/discover/artist/album`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setDataRandomAlbum(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataAlbum();
    }
  }, [session]);

  useEffect(() => {
    const fetchDataRandomMerch = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/discover/artist/merchandise?`,
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

        setDataRandomMerchandise(updatedMerchandiseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataRandomMerch();
  }, [session]);

  useEffect(() => {
    const fetchDataPlaylist = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/playlist`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setDataPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataPlaylist();
    }
  }, [session]);

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

  return (
    <>
      <Navbar />
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Discover a {genre}</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {discoverArtist.map((item, i) => (
            <Link key={i} href={`/profile/${item.id_artist}`}>
              <div className="min-w-[140px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                <img
                  className="h-36 w-36 rounded-full object-cover"
                  src={`${baseURLFile}/assets/image/avatar/${item.avatar}`}
                />
                <p className="mb-1 mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-slate-200">Artist</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Playlist for {userName}</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
              {dataRandomPlaylist.map((item, i) => (
                <Link
                  key={i}
                  href={`/playlist/${item.id_playlist}`}
                  className="cursor-pointer rounded-lg bg-[#181818] p-4 hover:bg-gray-700"
                >
                  <img
                    src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                    className="mb-4 aspect-square w-full rounded object-cover"
                  />
                  <h3 className="mb-2 truncate font-bold">{item.name}</h3>
                  <p className="line-clamp-2 text-sm text-gray-400">playlist</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Discover a merchandise</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
              {dataRandomMerchandise.map((item, i) => (
                <Link href={`/detail/merchandise/${item.id_merchandise}`}>
                  <div
                    key={i}
                    className="cursor-pointer rounded-lg bg-[#181818] p-4 hover:bg-gray-700"
                  >
                    <img
                      src={`${baseURLFile}/assets/image/merchandise/${item.images[0].name}`}
                      className="mb-4 aspect-square w-full rounded object-cover"
                    />
                    <h3 className="mb-2 truncate font-bold">{item.name}</h3>
                    <p className="text-sm text-slate-200">{item.Artist.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Album from another artist</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
              {dataRandomAlbum.map((item, i) => (
                <Link href={`/album/${item.id_album}`}>
                  <div
                    key={i}
                    className="cursor-pointer rounded-lg bg-[#181818] p-4 hover:bg-gray-700"
                  >
                    <img
                      src={`${baseURLFile}/assets/image/album/${item.image}`}
                      className="mb-4 aspect-square w-full rounded object-cover"
                    />
                    <h3 className="mb-2 truncate font-bold">{item.name}</h3>
                    <p className="text-sm text-slate-200">{item.Artist.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Your Playlist</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {dataPlaylist.map((item) => (
                <Link href={`/playlist/${item.id_playlist}`}>
                  <div
                    key={item.id_playlist}
                    className="cursor-pointer rounded-lg bg-[#181818] p-4 hover:bg-gray-700"
                  >
                    <img
                      src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                      className="mb-4 aspect-square w-full rounded object-cover"
                    />
                    <h3 className="mb-2 truncate font-bold">{item.name}</h3>
                    <p className="line-clamp-2 text-sm text-gray-400">
                      playlist
                    </p>
                  </div>
                </Link>
              ))}
            </div>
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
  if (session.user.role === 'fans') {
    return {
      redirect: {
        destination: '/fans',
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
