import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import Swal from 'sweetalert2';
export default function index() {
  const { data: session } = useSession();
  const router = useRouter();
  const [id, setId] = useState();

  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataGenre, setDataGenre] = useState([]);

  const [name, setName] = useState('');
  const [genre, setGenre] = useState();
  const [album, setAlbum] = useState();
  const [releaseDate, setReleaseData] = useState();
  const [credit, setCredit] = useState();
  const [lyric, setLyric] = useState('');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [status, setStatus] = useState();

  const [errors, setErrors] = useState({});

  const [createObjectImageURL, setCreateObjectImageURL] = useState(null);
  const [createObjectAudioURL, setCreateObjectAudioURL] = useState(null);

  const checkboxRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    if (checkboxRef.current) {
      setIsChecked(checkboxRef.current.checked);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/artist?email=${session.user.email}`,
        );
        setId(response.data.id_artist);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    const fetchDataGenre = async () => {
      try {
        const response = await axios.get(`${baseURL}/genre`);
        setDataGenre(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataGenre();
  }, []);

  useEffect(() => {
    const fetchDataAlbum = async () => {
      try {
        const response = await axios.get(`${baseURL}/artist/album?id=${id}`);
        setDataAlbum(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataAlbum();
  }, [id]);

  const uploadImageToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectImageURL(URL.createObjectURL(i));
    }
  };

  const uploadAudioToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const a = event.target.files[0];
      setAudio(a);
      setCreateObjectAudioURL(URL.createObjectURL(a));
    }
  };

  useEffect(() => {
    if (isChecked) {
      setStatus(1);
    }
    if (!isChecked) {
      setStatus(0);
    }
  }, [isChecked]);

  const handleUploadSong = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('audio', audio);
    formData.append('name', name);
    formData.append('genre', genre);
    formData.append('release_date', releaseDate);
    formData.append('lyric', lyric);
    formData.append('credit', credit);
    formData.append('status', status);

    if (album === '-') {
      formData.append('album', '-');
    } else {
      formData.append('album', album);
    }
    try {
      const response = await axios.post(
        `${baseURL}/artist/song/add?id=${id}`,
        formData,
      );
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          window.location.reload();
          // console.log(response.data.message);
          // console.log(response.data.data);
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { path, message } = error.response.data;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [path]: message,
        }));
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <h1 className="mb-4 text-3xl font-bold">Create new Song</h1>
        <div className="mb-2 flex w-full justify-center space-x-6 ">
          <div className="h-full w-9/12 rounded-lg border  p-6 shadow-md md:mt-0">
            <div className=" w-full border  px-4 ">
              <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div className="mr-auto shrink-0 sm:py-3">
                  <p className="text-lg font-medium">Song Details</p>
                  <p className="text-sm text-gray-400">Add your Song</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Song Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Type track name"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              {errors.name && (
                <p className="mb-1 text-red-500">{errors.name}</p>
              )}
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Genre</p>
                <div className="relative w-full rounded-lg ">
                  <select
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  >
                    <option className="text-black" value="">
                      Please select genre...
                    </option>
                    {dataGenre.map((item, i) => (
                      <option className="text-black" key={i} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.genre && (
                <p className="mb-1 text-red-500">{errors.genre}</p>
              )}
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Album</p>
                <div className="relative w-full rounded-lg ">
                  <select
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  >
                    <option className="text-black" value="">
                      Please select album...
                    </option>
                    <option className="text-black" value="-">
                      -
                    </option>
                    {dataAlbum.map((item, i) => (
                      <option className="text-black" key={i} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">
                  Release Date
                </p>
                <input
                  onChange={(e) => setReleaseData(e.target.value)}
                  placeholder="Release date songs"
                  type="date"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              {errors.release_date && (
                <p className="mb-1 text-red-500">{errors.release_date}</p>
              )}
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">
                  MP3/MP4 File
                </p>
                <input
                  onChange={uploadAudioToClient}
                  type="file"
                  className="w-full rounded-md border bg-transparent px-2 py-2 text-blue-600 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div className="flex flex-col gap-4 py-4  lg:flex-row">
                <div className="w-32 shrink-0  sm:py-4">
                  <p className="mb-auto text-lg font-medium">Image</p>
                </div>
                <input
                  onChange={uploadImageToClient}
                  name="image"
                  type="file"
                  className="bg-transparente w-full rounded-md border px-2 py-2 text-blue-600 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
            </div>
          </div>

          <div className="h-full w-3/12 rounded-lg border p-6 shadow-md md:mt-0">
            <div className="flex justify-between">
              <p className="text-white">Visible</p>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  ref={checkboxRef}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  value=""
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              </label>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between ">
              <p className="mb-1 text-white">Lyric this track</p>
            </div>
            <div className="flex justify-between rounded-lg border">
              <textarea
                onChange={(e) => setLyric(e.target.value)}
                className="peer block min-h-[auto] w-full rounded-lg border-gray-300 bg-transparent  py-[0.32rem]  leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:text-neutral-200  data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 "
                rows="7"
                placeholder="Message"
              />
            </div>
            <div className="my-4"></div>
            <div className="flex justify-between ">
              <p className="mb-1 text-white">Credit</p>
            </div>
            <div className="flex justify-between rounded-lg border">
              <textarea
                onChange={(e) => setCredit(e.target.value)}
                className="peer block min-h-[auto] w-full rounded-lg border-gray-300 bg-transparent  py-[0.32rem]  leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:text-neutral-200  data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 "
                rows="7"
                placeholder="Message"
              />
            </div>
            <div className="my-4"></div>
            <div className="mt-5 w-full">
              <button
                onClick={handleUploadSong}
                className="hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 inline-block w-full rounded bg-blue-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white"
              >
                Publish
              </button>
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
  if (session.user.role === 'fans') {
    return {
      redirect: {
        destination: '/fans',
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
