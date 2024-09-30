import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

export default function ArtistItem() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/artists?page=1`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {data.map((item, i) => (
        <a key={i} href={`/fans/artist?id=${item.id_artist}`}>
          <div className="min-w-[180px] cursor-pointer rounded p-2 px-2 hover:bg-gray-700">
            <img
              className="w-56 rounded-full"
              src={`${baseURLFile}/assets/image/avatar/${item.avatar}`}
            />
            <p className="mb-1 mt-2 font-bold">{item.name}</p>
            <p className="text-sm text-slate-200">Artist</p>
          </div>
        </a>
      ))}
    </>
  );
}
