import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import Swal from 'sweetalert2';

export default function create() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;

  const [oldName, setOldName] = useState('');
  const [oldImage, setOldImage] = useState(null);

  const [newImage, setNewImage] = useState();

  const [hovered, setHovered] = useState(false);
  const [formData, setFormData] = useState({});

  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadImageToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setNewImage(i);
    }
  };

  useEffect(() => {
    const fetchDataPlaylist = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/user/detail/playlist?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setOldName(response.data.name);
        setOldImage(response.data.image);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataPlaylist();
    }
  }, [session, id]);

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleUpdate = async () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append('image', newImage);

    try {
      const response = await axios.put(
        `${baseURL}/user/update/playlist?id=${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
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
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while add the playlist',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <h1 className="mb-4 text-3xl font-bold">Create new Playlist</h1>
        <form className="mb-2 w-full" onSubmit={handleUpdate}>
          <div className="h-full w-full rounded-lg border p-6 shadow-md md:mt-0">
            <div className="w-full border px-4">
              <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div className="mr-auto shrink-0 sm:py-3">
                  <p className="text-lg font-medium">Playlist Details</p>
                  <p className="text-sm text-gray-400">Add your playlist</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">
                  Playlist Name
                </p>
                <input
                  placeholder="Type playlist name"
                  type="text"
                  defaultValue={oldName}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
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
                        src={`${baseURLFile}/assets/image/playlist/${oldImage}`}
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
            <button
              type="submit"
              className="active:bg-primary-700  mt-4 inline-block w-full rounded bg-purple-500 px-6 pb-2  pt-2.5 text-xs font-medium uppercase leading-normal text-white hover:bg-purple-700 focus:bg-purple-600"
            >
              Update
            </button>
          </div>
        </form>
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
