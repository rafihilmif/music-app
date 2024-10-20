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
  const [id, setId] = useState();

  const [discoverArtist, setDiscoverArtist] = useState([]);
  const [dataRandomPlaylist, setDataRandomPlaylist] = useState([]);
  const [dataRandomMerchandise, setDataRandomMerchandise] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/artist?email=${session.user.email}`,
        );
        setGenre(response.data.genre);
        setUserName(response.data.username);
        setId(response.data.id_artist);
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
          `${baseURL}/discover/artist/genre?id=${id}&name=${genre}`,
        );
        setDiscoverArtist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataDiscoverArtist();
    }
  }, [id, genre]);

  useEffect(() => {
    const fetchDataRandomPlaylist = async () => {
      try {
        const response = await axios.get(`${baseURL}/playlist?id=${id}`);
        setDataRandomPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataRandomPlaylist();
    }
  }, [id]);

  useEffect(() => {
    const fetchDataRandomMerch = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/discover/artist/merchandise?id=${id}`,
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
  }, [id]);

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
        <h1 className="my-5 text-2xl font-bold">Another merchandise</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
              {dataRandomMerchandise.map((item) => (
                <Link href={`/detail/merchandise/${item.id_merchandise}`}>
                  <div
                    key={item.id_merchandise}
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
        <h1 className="my-5 text-2xl font-bold">Your Album</h1>
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
