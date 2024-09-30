import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/user/fans/Navbar';
import { Schedule } from '@mui/icons-material';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

export default function DetailAlbum() {
  const router = useRouter();
  const { id } = router.query;
  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataSong, setDataSong] = useState([]);

  const [nameAlbum, setNameAlbum] = useState('');
  const [nameArtist, setNameArtist] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    async function fetchDataSong() {
      try {
        const response = await axios.get(`${baseURL}/album/song?id=${id}`);
        setDataSong(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchDataSong();
  }, [id]);

  useEffect(() => {
    async function fetchDataAlbum() {
      try {
        const response = await axios.get(`${baseURL}/album?id=${id}`);
        setDataAlbum(response.data);
        setNameAlbum(response.data.name);
        setNameArtist(response.data.Artist.name);
        setThumbnail(response.data.image);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchDataAlbum();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end">
        <img
          className="w-72 rounded"
          src={`${baseURLFile}/assets/image/album/${thumbnail}`}
          alt=""
        />
        <div className="flex flex-col">
          <p>Album</p>
          <h2 className="mb-4 text-5xl font-bold md:text-7xl">{nameAlbum}</h2>
          <p className="mt-1">
            <img
              className="inline-block w-5 rounded-full"
              src={`${baseURLFile}/assets/image/album/${thumbnail}`}
              alt=""
            />
            <b> {nameArtist}</b> · 1,234,154 likes · <b>20 songs, </b>
            about 5 hr 30 min
          </p>
        </div>
      </div>
      <div className="mb-4 mt-10 grid grid-cols-2 pl-2 text-[#a7a7a7] sm:grid-cols-4">
        <p>
          <b className="mr-4">#</b>
          Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <Schedule className="m-auto w-4" />
      </div>
      <hr />
      {dataSong.map((item, i) => (
        <div
          key={i}
          className="grid cursor-pointer grid-cols-3 items-center gap-2 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b] sm:grid-cols-4"
        >
          <p className="text-white">
            <b className="mr-4 text-[#a7a7a7]">{i + 1}</b>
            <img
              className="mr-5 inline w-10"
              src={`${baseURLFile}/assets/image/song/${item.image}`}
            />
            {item.name}
          </p>
        </div>
      ))}
    </>
  );
}
