import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';

export default function Section() {
  const [data, setData] = useState([]);
  const [id, setId] = useState();

  const email =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('email'))
      : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/browse/genre`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="flex flex-col ">
      <div className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {data.map((item, i) => (
          <a href={`/genre/${item.name}`} key={i}>
            <div className="relative flex min-w-[180px] cursor-pointer flex-col rounded p-2 px-2 hover:bg-gray-700">
              <div
                className="h-44 w-auto rounded"
                style={{ backgroundColor: getRandomColor() }}
              >
                <h1 className="mt-2 p-2 text-xl font-semibold"> {item.name}</h1>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
