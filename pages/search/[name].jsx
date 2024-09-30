import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/user/Navbar';
import { getSession } from 'next-auth/react';
import { Edit, Delete, PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

export default function index() {
  const router = useRouter();
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

  useEffect(() => {
    const fetchDataArtistTop = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/top/artist?name=${name}`,
        );
        setNameArtistTop(response.data.name);
        setidArtistTop(response.data.id_artist);
        setImageArtistTop(response.data.avatar);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataArtistTop();
    }
  }, [name]);

  useEffect(() => {
    const fetchDataSongTop = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/top/song?name=${name}`,
        );
        setDataSongTop(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataSongTop();
    }
  }, [name]);

  useEffect(() => {
    const fetchDataArtist = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/artist?name=${name}`,
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
  }, [name]);

  useEffect(() => {
    const fetchDataAlbum = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/album?name=${name}`,
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
  }, [name]);

  useEffect(() => {
    const fetchDataMerch = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/merchandise?name=${name}`,
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
  }, [name]);

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
        const response = await axios.get(`${baseURL}/result/show?name=${name}`);
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
  }, [name]);

  useEffect(() => {
    const fetchDataPlaylist = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/result/playlist?name=${name}`,
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
  }, [name]);

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
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onHoverLeave(index)}
                className="flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-700"
              >
                <div className="relative h-16 w-16">
                  <img
                    src={`${baseURLFile}/assets/image/song/${item.image}`}
                    alt="album cover"
                    className="h-16 w-16 rounded-lg"
                  />
                  <PlayArrow
                    className={`absolute inset-0 m-auto h-8 w-8 text-white transition-opacity duration-300 ${hoverIndex[index] ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-400">{item.Artist.name}</p>
                </div>
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
        <h1 className="my-2 text-2xl font-bold">Albums</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataAlbum.map((item, i) => (
            <a key={i}>
              <div className="min-w-[140px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                <img
                  className="h-44 w-44 rounded"
                  src={`${baseURLFile}/assets/image/album/${item.image}`}
                />
                <p className="mb-1 mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-slate-200">{item.Artist.name}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-2 text-2xl font-bold">Merchandise</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataMerchandise.map((item, i) => (
            <a href={`/detail/merchandise/${item.id_merchandise}`} key={i}>
              <div className="min-w-[140px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                <img
                  className="h-44 w-44 rounded"
                  src={`${baseURLFile}/assets/image/merchandise/${item.images[0].name}`}
                />
                <p className="mb-1 mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-slate-200">{item.Artist.name}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-2 text-2xl font-bold">Shows</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataShows.map((item, i) => (
            <a href={`/detail/show/${item.id_show}`} key={i}>
              <div className="min-w-[140px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                <img
                  className="h-44 w-44 rounded"
                  src={`${baseURLFile}/assets/image/shows/${item.image}`}
                />
                <p className="mb-1 mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-slate-200">{item.duedate}</p>
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
                <div className="min-w-[140px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
                  <img
                    className="h-44 w-44 rounded"
                    src={`${baseURLFile}/assets/image/playlist/${item.image}`}
                  />
                  <p className="mb-1 mt-2 font-bold">{item.name}</p>
                  <p className="text-sm text-slate-200">Playlist</p>
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
