import React, { useState, useEffect, useContext } from 'react';
import { getSession } from 'next-auth/react';
import Navbar from '@/components/user/Navbar';
import axios from 'axios';
import { PlayCircle, MoreHoriz, PlayArrow } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { PlayerContext } from '@/context/PlayerContext';
import Layout from '@/components/user/Layout';

export default function index() {
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [genre, setGenre] = useState();
  const [desc, setDesc] = useState();

  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataSongPopular, setDataSongPopular] = useState([]);
  const [dataShow, setDataShow] = useState([]);

  const [dataMerchandise, setDataMerchandise] = useState([]);

  const email =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('email'))
      : null;

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/artist?email=${email}`,
        );
        setId(response.data.id_artist);
        setName(response.data.name);
        setThumbnail(response.data.avatar);
        setGenre(response.data.genre);
        setDesc(response.data.description);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchArtistData();
  }, [email]);

  useEffect(() => {
    const fetchDataSongPopular = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/song?id=${id}&limit=1`,
        );
        setDataSongPopular(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataSongPopular();
  }, [id]);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`${baseURL}/artist/album?id=${id}`);
        setDataAlbum(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAlbumData();
  }, [id]);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const response = await axios.get(`${baseURL}/artist/shows?id=${id}`);
        setDataShow(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchShowData();
  }, [id]);

  useEffect(() => {
    const fetchMerchandiseData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/merchandise?id=${id}`,
        );

        const merchandiseData = response.data;

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
      <Layout>
        <div className={`mt-10 flex flex-col gap-8 md:flex-row md:items-end`}>
          <div className="bg-gray-100" />
          <img
            className="h-72 w-72 rounded-full"
            src={`${baseURLFile}/assets/image/avatar/${thumbnail}`}
          />
          <div>
            <p className="text-sm font-bold">Profile</p>
            <h1 className="text-2xl font-extrabold md:text-3xl lg:text-8xl">
              {name}
            </h1>
            <p className="text-sm font-bold">
              <b>1,302,211 </b>Follower
            </p>
          </div>
        </div>
        <div className="mt-10 space-x-10">
          <MoreHoriz className="h-10 w-10 cursor-pointer" />
        </div>
        <div className="mb-4 mt-10 ">
          <h1 className="my-5 text-xl font-bold">Discography</h1>
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
          <h1 className="text-xl font-bold">Popular</h1>
          {dataSongPopular.map((item, index) => (
            <a key={index}>
              <div
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onHoverLeave(index)}
                className="mt-3 grid cursor-pointer grid-cols-3 items-center gap-5 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b] sm:grid-cols-4"
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
                <p>3,123,121</p>
                <p>3:01</p>
              </div>
            </a>
          ))}
        </div>

        <h4 className="mt-2 cursor-pointer text-sm text-gray-400">See More</h4>
        <div className="mb-4 mt-10 ">
          <div className="mt-4 flex items-center justify-between">
            <h1 className="my-5 text-xl font-bold">Merchandise</h1>
            <p className="my-5 cursor-pointer text-sm text-gray-400">
              Show All
            </p>
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
          <h1 className="my-5 text-xl font-bold">Upcoming Shows</h1>
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
        <div className="mb-4 h-72 max-w-4xl overflow-hidden rounded-xl shadow-lg ">
          <img
            className="z-0 h-72 w-full rounded-lg object-fill transition-all duration-300 hover:scale-110"
            src={`${baseURLFile}/assets/image/avatar/${thumbnail}`}
          />
          <div className="relative -mt-52 px-6 py-5">
            <p className="text-lg font-semibold text-white">
              4,211,421 listeners
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
