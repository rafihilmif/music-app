import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import { Clear } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import Swal from 'sweetalert2';

export default function index() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [idArtist, setIdArtist] = useState();

  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  const [dataAlbum, setDataAlbum] = useState([]);
  const [dataGenre, setDataGenre] = useState([]);

  const [OldName, setOldName] = useState('');
  const [OldGenre, setOldGenre] = useState('');
  const [OldAlbum, setOldAlbum] = useState('');
  const [OldAlbumId, setOldAlbumId] = useState('');
  const [OldReleaseDate, setOldReleaseData] = useState('');
  const [OldCredit, setOldCredit] = useState('');
  const [OldLyric, setOldLyric] = useState('');
  const [OldImage, setOldImage] = useState(null);

  const [formData, setFormData] = useState({});
  const [newStatus, setNewStatus] = useState();
  const [newImageSong, setNewImageSong] = useState(null);
  const [newAudioSong, setNewAudioSong] = useState(null);

  const checkboxRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);


  useEffect(() => {
    const fetchDataAlbum = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/album?name=${OldAlbum}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        setDataAlbum(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (idArtist) {
      fetchDataAlbum();
    }
  }, [idArtist, OldAlbum]);

  useEffect(() => {
    const fetchDataSong = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/detail/song?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log(response.data.name);
        setOldName(response.data.name);
        setOldAlbum(response.data.album);
        setOldGenre(response.data.genre);
        setOldReleaseData(response.data.release_date);
        setOldCredit(response.data.credit);
        setOldLyric(response.data.lyric);
        setOldImage(response.data.image);
        setOldAlbumId(response.data.id_album);
        setIsChecked(response.data.status === 1);

        // setOldAudio(response.data.audio);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDataSong();
    }
  }, [id]);

  useEffect(() => {
    const fetchDataGenre = async () => {
      try {
        const response = await axios.get(`${baseURL}/genre?name=${OldGenre}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setDataGenre(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (OldGenre) {
      fetchDataGenre();
    }
  }, [OldGenre]);

  const uploadImageToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setNewImageSong(i);
    }
  };

  const uploadAudioToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const a = event.target.files[0];
      setNewAudioSong(a);
    }
  };

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    if (isChecked) {
      setNewStatus(1);
    } else {
      setNewStatus(0);
    }
  }, [isChecked]);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (newImageSong != null) {
      data.append('image', newImageSong);
    }
    if (newAudioSong != null) {
      data.append('audio', newAudioSong);
    }

    data.append('status', newStatus);
    try {
      const response = await axios.put(
        `${baseURL}/artist/song/update?id=${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Error updating song:', error);
      alert('Error updating song: ' + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <h1 className="mb-4 text-3xl font-bold">Update an Track</h1>
        <div className="mb-2 flex w-full justify-center space-x-6 ">
          <div className="h-full w-9/12 rounded-lg border  p-6 shadow-md md:mt-0">
            <div className=" w-full border  px-4 ">
              <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div className="mr-auto shrink-0 sm:py-3">
                  <p className="text-lg font-medium">Track Details</p>
                  <p className="text-sm text-gray-400">Update your track</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Track Name</p>
                <input
                  defaultValue={OldName}
                  onChange={(e) => updateField('name', e.target.value)}
                  type="text"
                  placeholder="Type track name"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>

              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Genre</p>
                <div className="relative w-full rounded-lg ">
                  <select
                    onChange={(e) => updateField('genre', e.target.value)}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  >
                    <option value={OldGenre} className="text-black">
                      {OldGenre}
                    </option>
                    {dataGenre.map((item, i) => (
                      <option className="text-black" key={i} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Album</p>
                <div className="relative w-full rounded-lg ">
                  <select
                    onChange={(e) => {
                      const selectedAlbum = dataAlbum.find(
                        (album) => album.name === e.target.value,
                      );
                      setFormData((prevData) => ({
                        ...prevData,
                        album: selectedAlbum.name,
                        id_album: selectedAlbum.id_album,
                      }));
                    }}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  >
                    <option value={OldAlbum} className="text-black">
                      {OldAlbum}
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
                  defaultValue={OldReleaseDate}
                  onChange={(e) => updateField('release_date', e.target.value)}
                  placeholder="Release date songs"
                  type="date"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
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
              <div className="flex flex-col gap-4 py-4 lg:flex-row">
                <div className="w-32 shrink-0  sm:py-4">
                  <p className="mb-auto text-lg font-medium">Image</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <label
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="relative flex min-h-[200px] w-64 items-center justify-center rounded-md border border-solid border-gray-300 p-4 text-center shadow-lg"
                  >
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                      <img
                        height={100}
                        width={100}
                        className="block h-full w-auto rounded-xl"
                        alt=""
                        src={`${baseURLFile}/assets/image/song/${OldImage}`}
                      />
                      {hovered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex flex-col items-center">
                            <label
                              htmlFor={`file-input`}
                              className="text-md group relative h-10 w-36 cursor-pointer overflow-hidden rounded-md bg-blue-500 p-2 font-bold text-white"
                            >
                              Change Picture
                              <input
                                id={`file-input`}
                                type="file"
                                name="image"
                                className="hidden"
                                onChange={(event) => uploadImageToClient(event)}
                              />
                              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
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
                  checked={isChecked}
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
                defaultValue={OldLyric}
                onChange={(e) => updateField('lyric', e.target.value)}
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
                defaultValue={OldCredit}
                onChange={(e) => updateField('credit', e.target.value)}
                className="peer block min-h-[auto] w-full rounded-lg border-gray-300 bg-transparent  py-[0.32rem]  leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:text-neutral-200  data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 "
                rows="7"
                placeholder="Message"
              />
            </div>
            <div className="my-4"></div>
            <div className="mt-5 w-full">
              <button
                onClick={handleUpdate}
                className="hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 inline-block w-full rounded bg-purple-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white hover:bg-purple-700"
              >
                Update
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
