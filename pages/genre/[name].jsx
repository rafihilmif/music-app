import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

export default function index() {
  const router = useRouter();
  const { name } = router.query;

  const [dataAlbumRecom, setDataAlbumRecom] = useState([]);
  const [dataArtistGenre, setDataArtistGenre] = useState([]);
  const [dataMerchandiseGenre, setDataMerchandiseGenre] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataRecom = async () => {
      try {
        const response = await axios.get(`${baseURL}/album/genre?name=${name}`);
        setDataAlbumRecom(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataRecom();
    }
  }, [name]);

  useEffect(() => {
    const fetchDataArtistGenre = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/genre/artist?name=${name}`,
        );

        setDataArtistGenre(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataArtistGenre();
    }
  }, [name]);

  useEffect(() => {
    const fetchDataMercGenre = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/genre/artist/merchandise?name=${name}`,
        );
        const merchandiseData = response.data;
        const updatedMerchandiseData = await Promise.all(
          merchandiseData.map(async (item) => {
            const images = await fetchImageData(item.id_merchandise);
            return { ...item, images };
          }),
        );

        setDataMerchandiseGenre(updatedMerchandiseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataMercGenre();
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

  return (
    <>
      <Navbar />
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Recommended for you</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataAlbumRecom.map((item, i) => (
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
        <h1 className="my-2 text-2xl font-bold">Artists of {name}</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataArtistGenre.map((item, i) => (
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
        <h1 className="my-5 text-2xl font-bold">Merchandise from {name}</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataMerchandiseGenre.map((item, i) => (
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
