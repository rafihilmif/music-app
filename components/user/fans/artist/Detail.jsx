import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Navbar';
import { shuffle } from 'lodash';
import axios from 'axios';
import { PlayCircle, MoreHoriz, PlayArrow } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { PlayerContext } from '@/context/PlayerContext';

const colors = ['from-indigo-500', 'from-blue-500'];

export default function DetailArtist() {
  const router = useRouter();
  const { id } = router.query;
  const { setTrack } = useContext(PlayerContext);

  const [data, setData] = useState([]);
  const [dataSong, setDataSong] = useState([]);
  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataMerchandise, setDataMerchandise] = useState([]);
  const [dataShow, setDataShow] = useState([]);

  const [thumbnail, setThumbnail] = useState('');
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [desc, setDesc] = useState('');

  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    const fetchDataArtist = async () => {
      try {
        const response = await axios.get(`${baseURL}/artist?id=${id}`);
        setData(response.data);
        setThumbnail(response.data.avatar);
        setName(response.data.name);
        setGenre(response.data.genre);
        setDesc(response.data.description);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataArtist();
  }, [id]);

  useEffect(() => {
    const fetchDataSong = async () => {
      try {
        const response = await axios.get(`${baseURL}/collection/song?id=${id}`);
        setDataSong(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataSong();
  }, [id]);

  useEffect(() => {
    const fetchDataAlbum = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/album?id=${id}`,
        );
        setDataAlbum(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataAlbum();
  }, [id]);

  useEffect(() => {
    const fetchDataMerchandise = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/collection/merchandise?id=${id}`,
        );
        setDataMerchandise(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataMerchandise();
  }, [id]);

  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  const playSong = (dataSong) => {
    setTrack(dataSong);
  };
  return (
    <>
      <Navbar />
      <div className={`mt-10 flex flex-col gap-8 md:flex-row md:items-end`}>
        <div className="bg-gray-100" />
        <img
          className="h-72 w-72 rounded-full"
          src={`${baseURLFile}/assets/image/avatar/${thumbnail}`}
        />
        <div>
          <p className="text-sm font-bold">Artist</p>
          <h1 className="text-2xl font-extrabold md:text-3xl lg:text-8xl">
            {name}
          </h1>
          <p className="text-sm font-bold">
            <b>1,302,211 </b>Follower
          </p>
        </div>
      </div>
      <div className="mt-10 space-x-10">
        <PlayCircle className="h-20 w-20 cursor-pointer" />
        <button className="text-md rounded-full px-2 font-bold text-white outline outline-2 outline-offset-4">
          Follow
        </button>
        <MoreHoriz className="h-10 w-10 cursor-pointer" />
      </div>
      <div className="mt-10 flex flex-col">
        <h1 className="text-xl font-bold">Popular</h1>
        {dataSong.map((item, i) => (
          <div
            key={i}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className="mt-3 grid cursor-pointer grid-cols-3 items-center gap-5 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b] sm:grid-cols-4"
          >
            <p className="text-white">
              <button
                onClick={() => playSong(dataSong)}
                className="mr-4 text-[#a7a7a7]"
              >
                {hover ? <PlayArrow /> : <span>{i + 1}</span>}
              </button>
              <img
                className="mr-5 inline w-10 rounded-sm"
                src={`${baseURLFile}/assets/image/song/${item.image}`}
              />
              <b>{item.name}</b>
            </p>
            <p>3,123,121</p>
            <p>3:01</p>
          </div>
        ))}
      </div>
      <h4 className="mt-2 cursor-pointer text-sm text-gray-400">See More</h4>
      <div className="mb-4 mt-10 ">
        <h1 className="my-5 text-xl font-bold">Discography</h1>
        <div className="flex overflow-auto">
          {dataAlbum.map((item, i) => (
            <div
              key={i}
              className="min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700"
            >
              <img
                className="w-56 rounded"
                src={`${baseURLFile}/assets/image/album/${item.image}`}
              />

              <p className="mb-1 mt-2 font-bold">{item.name}</p>
              <p className="text-sm text-slate-200">
                {item.created_at} · Album
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 mt-10 ">
        <h1 className="my-5 text-xl font-bold">Our Merchandise</h1>
        <div className="flex overflow-auto">
          {dataMerchandise.map((item, i) => (
            <div
              key={i}
              className="min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700"
            >
              <img
                className="w-56 rounded"
                src={`${baseURLFile}/assets/image/merchandise/${item.image}`}
              />
              <p className="mb-1 mt-2 font-bold">{item.name}</p>
              <p className="text-sm text-slate-200">{item.category}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 mt-10 ">
        <h1 className="my-5 text-xl font-bold">Upcoming Show</h1>
        <div className="flex overflow-auto">
          <div className="min-w-[180px] cursor-pointer rounded p-2 px-3 hover:bg-gray-700">
            <img
              className="w-56 rounded"
              // src={`${baseURLFile}/assets/image/album/${item.image}`}
            />

            <p className="mb-1 mt-2 font-bold">Shades of Night</p>
            <p className="text-sm text-slate-200">2024 · Album</p>
          </div>
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
    </>
  );
}
