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
  const [dataAlbumNew, setDataAlbumNew] = useState([]);
  const [dataAlbumOld, setDataAlbumOld] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(name);
  }, [name]);

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
    const fetchDataOldFormed = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/album/genre/old?name=${name}`,
        );

        setDataAlbumOld(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataOldFormed();
    }
  }, [name]);

  useEffect(() => {
    const fetchDataNewRelease = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/album/genre/new?name=${name}`,
        );
        setDataAlbumNew(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (name) {
      fetchDataNewRelease();
    }
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Recommended for you</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataAlbumRecom.map((item, i) => (
            <a key={i} href={`/album/${item.id_album}`}>
              <div className="min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700">
                <img
                  className="w-56 rounded"
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
        <h1 className="my-5 text-2xl font-bold">New Release in {name}</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataAlbumNew.map((item, i) => (
            <a key={i} href={`/album/${item.id_album}`}>
              <div className="min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700">
                <img
                  className="w-56 rounded"
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
        <h1 className="my-5 text-2xl font-bold">Classic 90's of {name}</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          {dataAlbumOld.map((item, i) => (
            <a key={i} href={`/album/${item.id_album}`}>
              <div className="min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700">
                <img
                  className="w-56 rounded"
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
        <h1 className="my-5 text-2xl font-bold">Popular {name} playlist</h1>
        <div className="flex flex-wrap gap-6 overflow-auto"></div>
      </div>
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">New Age {name} Essentials</h1>
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

  return {
    props: {
      ...session,
    },
  };
}
