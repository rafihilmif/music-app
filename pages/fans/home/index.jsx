import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect } from 'react';
import { MusicNote, LocalMall } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

export default function MainLayoutFans() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [id, setId] = useState('');
  const [userName, setUserName] = useState();

  const [dataArtistFollowed, setDataArtistFollowed] = useState([]);
  const [dataPlaylist, setDataPlaylist] = useState([]);
  const [dataRandomArtist, setDataRandomArtist] = useState([]);
  const [dataRandomPlaylist, setDataRandomPlaylist] = useState([]);
  const [dataRandomMerchandise, setDataRandomMerchandise] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      return;
    } else if (status === 'authenticated' && session.user.role === 'artist') {
      router.push('/artist');
    } else if (status === 'authenticated' && session.user.role === 'fans') {
      router.push('/fans/home');
    }
  }, [session]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/fans?email=${session.user.email}`,
        );
        setId(response.data.id_fans);
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
        const response = await axios.get(`${baseURL}/fans/follow?id=${id}`);
        setDataArtistFollowed(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataArtistFollowed();
    }
  }, [id]);

  useEffect(() => {
    const fetchDataPlaylist = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/playlist?id=${id}`);
        setDataPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataPlaylist();
    }
  }, [id]);

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
    const fetchDataRandomArtist = async () => {
      try {
        const response = await axios.get(`${baseURL}/artists`);
        setDataRandomArtist(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataRandomArtist();
  }, []);

  useEffect(() => {
    const fetchDataRandomMerch = async () => {
      try {
        const response = await axios.get(`${baseURL}/merchandises`);

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
      } finally {
        setLoading(false);
      }
    };
    fetchDataRandomMerch();
  }, []);

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
        <div className="mb-6 flex space-x-4 overflow-x-auto">
          <button className="whitespace-nowrap rounded-full bg-[#181818] px-4 py-2">
            All
          </button>
          <button className="flex items-center whitespace-nowrap rounded-full bg-[#181818] px-4 py-2">
            <MusicNote className="mr-2 h-4 w-4" />
            Music
          </button>
          <button className="flex items-center whitespace-nowrap rounded-full bg-[#181818] px-4 py-2">
            <LocalMall className="mr-2 h-4 w-4" />
            Merchandise
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {dataArtistFollowed.map((item) => (
            <div
              key={item.id_follow}
              className="flex cursor-pointer items-center rounded-lg bg-[#181818] p-4 hover:bg-gray-700"
            >
              <img
                src={`${baseURLFile}/assets/image/avatar/${item.avatar}`}
                className="mr-4 h-12 w-12"
              />
              <span className="flex-grow truncate">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="mb-4 flex items-center justify-between text-2xl font-bold">
            Playlist For {userName}
            {/* <button className="flex items-center text-sm text-gray-400">
              Show all
            </button> */}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
            {dataRandomPlaylist.map((item) => (
              <div
                key={item.id_playlist}
                className="cursor-pointer rounded-lg bg-[#181818] p-4 hover:bg-gray-700"
              >
                <img
                  src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                  className="mb-4 aspect-square w-full rounded object-cover"
                />
                <h3 className="mb-2 truncate font-bold">{item.name}</h3>
                <p className="line-clamp-2 text-sm text-gray-400">playlist</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 px-2">
          <h1 className="my-2 text-2xl font-bold">Artists</h1>
          <div className="flex flex-wrap gap-6 overflow-auto">
            {dataRandomArtist.map((item, i) => (
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
        <div className="mb-8">
          <h2 className="mb-4 flex items-center justify-between text-2xl font-bold">
            Your Playlist
            {/* <button className="flex items-center text-sm text-gray-400">
              Show all
            </button> */}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {dataPlaylist.map((item) => (
              <a href={`/playlist/${item.id_playlist}`}>
                <div
                  key={item.id_playlist}
                  className="cursor-pointer rounded-lg bg-[#181818] p-4 hover:bg-gray-700"
                >
                  <img
                    src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                    className="mb-4 aspect-square w-full rounded object-cover"
                  />
                  <h3 className="mb-2 truncate font-bold">{item.name}</h3>
                  <p className="line-clamp-2 text-sm text-gray-400">playlist</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="mb-4 flex items-center justify-between text-2xl font-bold">
            Recommendation Merchandise
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {dataRandomMerchandise.map((item) => (
              <a href={`/detail/merchandise/${item.id_merchandise}`}>
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
