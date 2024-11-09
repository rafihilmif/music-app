import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import Link from 'next/link';

export default function MainLayoutFans() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userName, setUserName] = useState();

  const [dataArtistFollowed, setDataArtistFollowed] = useState([]);
  const [dataPlaylist, setDataPlaylist] = useState([]);
  const [dataRandomArtist, setDataRandomArtist] = useState([]);
  const [dataRandomPlaylist, setDataRandomPlaylist] = useState([]);
  const [dataRandomMerchandise, setDataRandomMerchandise] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/detail/fans`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
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
    const fetchDataArtistFollowed = async () => {
      try {
        const response = await axios.get(`${baseURL}/fans/follow`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setDataArtistFollowed(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataArtistFollowed();
    }
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
    const fetchDataRandomArtist = async () => {
      try {
        const response = await axios.get(`${baseURL}/artists`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setDataRandomArtist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataRandomArtist();
  }, [session]);

  useEffect(() => {
    const fetchDataRandomMerch = async () => {
      try {
        const response = await axios.get(`${baseURL}/merchandises`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const merchandiseData = response.data;

        console.log(response);
        const updatedMerchandiseData = await Promise.all(
          merchandiseData.map(async (item) => {
            const images = await fetchImageData(item.id_merchandise);
            return { ...item, images };
          }),
        );

        setDataRandomMerchandise(updatedMerchandiseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataRandomMerch();
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
      <div className="p-4 text-white md:p-6">
        <h2 className="mb-4 flex items-center justify-between text-2xl font-bold">
          Artist You've been followed
        </h2>
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {dataArtistFollowed.map((item, i) => (
            <Link
              key={i}
              href={`/profile/${item.id_artist}`}
              className="flex cursor-pointer items-center rounded-lg bg-[#181818] p-4 hover:bg-gray-700"
            >
              <img
                src={`${baseURLFile}/assets/image/avatar/${item.avatar}`}
                className="mr-4 h-12 w-12"
              />
              <span className="flex-grow truncate">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="mb-4 flex items-center justify-between text-2xl font-bold">
            Playlist For {userName}
          </h2>
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

        <div className="mb-4 px-2">
          <h1 className="my-2 text-2xl font-bold">Artists</h1>
          <div className="flex flex-wrap gap-6 overflow-auto">
            {dataRandomArtist.map((item, i) => (
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
        <div className="mb-8">
          <h2 className="mb-4 flex items-center justify-between text-2xl font-bold">
            Your Playlist
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {dataPlaylist.map((item, i) => (
              <Link key={i} href={`/playlist/${item.id_playlist}`}>
                <div className="cursor-pointer rounded-lg bg-[#181818] p-4 hover:bg-gray-700">
                  <img
                    src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                    className="mb-4 aspect-square w-full rounded object-cover"
                  />
                  <h3 className="mb-2 truncate font-bold">{item.name}</h3>
                  <p className="line-clamp-2 text-sm text-gray-400">playlist</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="mb-4 flex items-center justify-between text-2xl font-bold">
            Recommendation Merchandise
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {dataRandomMerchandise.map((item, i) => (
              <Link key={i} href={`/detail/merchandise/${item.id_merchandise}`}>
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
  if (session.user.role === 'artist') {
    return {
      redirect: {
        destination: '/artist',
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
