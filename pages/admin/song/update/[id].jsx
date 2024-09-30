import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import IconMusic from '../../../../public/images/commonthumbnails/gramaphone.jpg';
const updateSongById = () => {
  const router = useRouter();
  const fileInputRef1 = useRef();
  const fileInputRef2 = useRef();

  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataGenre, setDataGenre] = useState([]);

  const [oldArtist, setOldArtist] = useState('');
  const [oldAlbum, setOldAlbum] = useState('');
  const [oldTrackName, setOldTrackName] = useState('');
  const [oldReleased, setOldReleased] = useState('');
  const [oldGenre, setOldGenre] = useState('');
  const [oldImageSong, setOldImageSong] = useState('');
  const [oldAudioSong, setOldAudioSong] = useState('');

  const [newImageSong, setNewImageSong] = useState(null);
  const [newAudioSong, setNewAudioSong] = useState(null);

  const { id } = router.query;
  const [idArtist, setIdArtist] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${baseURL}/admin/song?id=${id}`);
        setOldArtist(response.data.Artist.name);
        setOldAlbum(response.data.album);
        setOldTrackName(response.data.name);
        setOldReleased(response.data.release_date);
        setOldGenre(response.data.genre);
        setOldImageSong(response.data.image);
        setOldAudioSong(response.data.audio);
        setIdArtist(response.data.id_artist);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    fetchDataGenre();
  }, []);

  useEffect(() => {
    fetchDataAlbum();
  }, [idArtist]);

  const fetchDataAlbum = async () => {
    await axios
      .get(`${baseURL}/admin/album?id_artist=${idArtist}`)
      .then((res) => {
        setDataAlbum(res.data.data);
      })
      .catch((err) => console.error('error' + err));
  };
  const fetchDataGenre = async () => {
    await axios
      .get(`${baseURL}/genre`)
      .then((res) => {
        setDataGenre(res.data.data);
      })
      .catch((err) => console.error('error' + err));
  };

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleImageChange = (event) => {
    setNewImageSong(event.target.files[0]);
  };
  const handleAudioChange = (event) => {
    setNewAudioSong(event.target.files[0]);
  };
  const handleUpdate = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (newImageSong) {
      data.append('image', newImageSong);
    }
    if (newAudioSong) {
      data.append('audio', newAudioSong);
    }
    await axios
      .put(`${baseURL}/admin/song?id=${id}`, data)
      .then(alert('Data berhasil diubah'), router.push('/admin/song/data'))
      .catch((err) => console.error('error' + err));
  };

  const removeImageSong = async () => {
    await axios
      .put(`${baseURL}/admin/song/remove/avatar?id=${id}`)
      .then(router.reload())
      .catch((err) => console.error('error' + err));
  };
  const removeAudioSong = async () => {
    await axios
      .put(`${baseURL}/admin/song/remove/audio?id=${id}`)
      .then(router.reload())
      .catch((err) => console.error('error' + err));
  };

  return (
    <>
      <div className="flex h-screen w-full">
        <div className="absolute h-1/4 w-full bg-blue-500 dark:hidden"> </div>
        <div className="h-screen w-2/12">
          <Sidebar />
        </div>
        <div className="h-screen w-10/12">
          <Navbar />
          <div className="mt-1 flex h-auto w-full">
            <div class="relative my-4 w-full border bg-white px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4">
              <div class="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div class="mr-auto shrink-0 sm:py-3">
                  <p class="font-medium">Identity Details</p>
                  <p class="text-sm text-gray-600">Update existing data</p>
                </div>
                <a
                  href="/admin/song/data"
                  class="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring sm:inline"
                >
                  Back
                </a>
                <button
                  onClick={handleUpdate}
                  class="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring sm:inline"
                >
                  Update
                </button>
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Artist</p>
                <input
                  readOnly={true}
                  value={oldArtist}
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Album</p>
                <div className="relative w-full rounded-lg ">
                  <select
                    onChange={(e) => updateField('album', e.target.value)}
                    className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  >
                    <option value="#">Please select album...</option>
                    <option value="-">-</option>
                    {dataAlbum.map((item) => (
                      <option value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Track Name</p>
                <input
                  defaultValue={oldTrackName}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Type track name"
                  className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Genre</p>
                <div className="relative w-full rounded-lg ">
                  <select
                    onChange={(e) => updateField('genre', e.target.value)}
                    className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  >
                    <option value="#">Please select genre...</option>
                    {dataGenre.map((item) => (
                      <option value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Release Date</p>
                <input
                  value={oldReleased}
                  onChange={(e) => updateField('release_date', e.target.value)}
                  type="date"
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 py-4  lg:flex-row">
                <div class="w-32 shrink-0  sm:py-4">
                  <p class="mb-auto font-medium">Properties Song</p>
                  <p class="text-sm text-gray-600">
                    Change your image or Audio
                  </p>
                </div>
                <div class="flex h-56 w-80 flex-col items-center rounded-xl border border-dashed border-gray-300 p-5 text-center">
                  <img
                    class="h-full w-full"
                    src={`${baseURLFile}/assets/image/song/${oldImageSong}`}
                  />
                  <button
                    class="my-2 -mt-32 items-center rounded-md border border-transparent bg-gray-900 px-2 py-2 text-xs
        font-semibold uppercase tracking-widest text-gray-50 shadow-md ring-gray-300 transition duration-150 
       ease-in-out hover:bg-gray-700 focus:border-gray-900 focus:outline-none focus:ring active:bg-gray-900 disabled:opacity-25"
                  >
                    remove image
                  </button>
                  <button
                    onClick={() => fileInputRef1.current.click()}
                    class="my-2 items-center rounded-md border border-transparent bg-gray-900 px-2 py-2 text-xs
        font-semibold uppercase tracking-widest text-gray-50 shadow-md ring-gray-300 transition duration-150 
       ease-in-out hover:bg-gray-700 focus:border-gray-900 focus:outline-none focus:ring active:bg-gray-900 disabled:opacity-25"
                  >
                    replace image
                  </button>
                  <input
                    onChange={handleImageChange}
                    type="file"
                    ref={fileInputRef1}
                    hidden
                  />
                </div>
                <div class="flex h-56 w-80 flex-col items-center rounded-xl border border-dashed border-gray-300 p-5 text-center">
                  <img class="h-full w-full" src={IconMusic} />
                  <button
                    class="my-2 -mt-40 items-center rounded-md border border-transparent bg-gray-900 px-2 py-2 text-xs
        font-semibold uppercase tracking-widest text-gray-50 shadow-md ring-gray-300 transition duration-150 
       ease-in-out hover:bg-gray-700 focus:border-gray-900 focus:outline-none focus:ring active:bg-gray-900 disabled:opacity-25"
                  >
                    play audio
                  </button>
                  <button
                    onClick={() => fileInputRef2.current.click()}
                    class="my-2 items-center rounded-md border border-transparent bg-gray-900 px-2 py-2 text-xs
        font-semibold uppercase tracking-widest text-gray-50 shadow-md ring-gray-300 transition duration-150 
       ease-in-out hover:bg-gray-700 focus:border-gray-900 focus:outline-none focus:ring active:bg-gray-900 disabled:opacity-25"
                  >
                    replace audio
                  </button>
                  <button
                    class="my-2 items-center rounded-md border border-transparent bg-gray-900 px-2 py-2 text-xs
        font-semibold uppercase tracking-widest text-gray-50 shadow-md ring-gray-300 transition duration-150 
       ease-in-out hover:bg-gray-700 focus:border-gray-900 focus:outline-none focus:ring active:bg-gray-900 disabled:opacity-25"
                  >
                    remove audio
                  </button>
                  <input
                    onChange={handleAudioChange}
                    type="file"
                    ref={fileInputRef2}
                    hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default updateSongById;
