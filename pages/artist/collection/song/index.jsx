import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import Navbar from '@/components/user/Navbar';
import { getSession, useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
export default function index() {
  const { data: session, status } = useSession();
  const [dataSong, setDataSong] = useState([]);
  const [id, setId] = useState();

  const [totalSong, setTotalSong] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const observer = useRef();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const fetchData = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}/artist/collection/song?id=${id}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataSong((prevData) => [...prevData, ...response.data.data]);
        setTotalSong(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    },
    [id],
  );

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`${baseURL}/detail/artist`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setId(response.data.id_artist);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchArtistData();
    }
  }, [session]);

  useEffect(() => {
    if (id) {
      fetchData(currentPage);
    }
  }, [id, currentPage, fetchData]);

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && dataSong.length < totalSong) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, totalSong, dataSong.length],
  );

  const handleFilterAll = useCallback(
    async (page) => {
      setIsLoading(true);
      setCurrentPage(1);
      setDataSong([]);
      try {
        const response = await axios.get(
          `${baseURL}/artist/collection/song?id=${id}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataSong((prevData) => [...prevData, ...response.data.data]);
        setTotalSong(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    },
    [id],
  );

  const handleFilterNew = useCallback(
    async (page) => {
      setIsLoading(true);
      setCurrentPage(1);
      setDataSong([]);
      try {
        const response = await axios.get(
          `${baseURL}/artist/collection/song/sort/new?id=${id}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataSong((prevData) => [...prevData, ...response.data.data]);
        setTotalSong(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    },
    [id],
  );

  const handleFilterOld = useCallback(
    async (page) => {
      setIsLoading(true);
      setCurrentPage(1);
      setDataSong([]);
      try {
        const response = await axios.get(
          `${baseURL}/artist/collection/song/sort/old?id=${id}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataSong((prevData) => [...prevData, ...response.data.data]);
        setTotalSong(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    },
    [id],
  );

  const handleDeleteSong = async (idSong) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });
      if (result.isConfirmed) {
        const response = await axios.delete(
          `${baseURL}/artist/song/delete?id=${idSong}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        await Swal.fire({
          title: 'Deleted!',
          text: response.data.message,
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      }
      window.location.reload();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while deleting the song',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      window.location.reload();
    }
  };

  return (
    <>
      <Navbar />
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Collection of Tracks</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={handleFilterAll}
                  className="rounded-md bg-[#2f3135] px-4 py-2 text-white hover:bg-[#4a545c]"
                >
                  All
                </button>
                <button
                  onClick={handleFilterNew}
                  className="rounded-md bg-[#2f3135] px-4 py-2 text-white hover:bg-[#4a545c]"
                >
                  New
                </button>
                <button
                  onClick={handleFilterOld}
                  className="rounded-md bg-[#2f3135] px-4 py-2 text-white hover:bg-[#4a545c]"
                >
                  Old
                </button>
              </div>
            </div>
            <div className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {dataSong.map((item, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative flex min-w-[180px] cursor-pointer flex-col rounded p-2  hover:bg-gray-700"
                >
                  <img
                    className="mb-4 aspect-square w-full rounded object-cover"
                    width={210}
                    height={210}
                    src={`${baseURLFile}/assets/image/song/${item.image}`}
                  />
                  <p className="mb-1 mt-2 font-bold">{item.name}</p>
                  <p className="text-sm text-slate-200">{item.artist}</p>
                  {hoveredIndex === i && (
                    <div className="absolute right-3 top-3 flex space-x-2">
                      <div className="absolute right-3 top-3 flex space-x-2">
                        <a
                          key={i}
                          href={`/artist/update/track/${item.id_song}`}
                        >
                          <Edit className="rounded-full text-emerald-500 hover:border-emerald-400 hover:text-emerald-600" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteSong(item.id_song);
                          }}
                        >
                          <Delete className="text-red-500 hover:border-red-400 hover:text-red-700" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              ref={lastElementRef}
              className="relative bottom-2 flex items-center justify-center p-4"
            >
              {isLoading && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline h-8 w-8 animate-spin fill-purple-600 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>
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
