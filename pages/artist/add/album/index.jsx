import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import Swal from 'sweetalert2';
export default function CreateAlbum() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);

  const [createObjectURL, setCreateObjectURL] = useState(null);

  const [errors, setErrors] = useState({});

  const checkboxRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [status, setStatus] = useState();

  const [imageProgress, setImageProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleCheckboxChange = () => {
    if (checkboxRef.current) {
      setIsChecked(checkboxRef.current.checked);
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

  const uploadImageToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
      setImageProgress(0);
    }
  };

  const handleUploadAlbum = async () => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('description', desc);
    formData.append('status', status);

    try {
      const response = await axios.post(
        `${baseURL}/artist/album/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setImageProgress(percentCompleted);
          },
        },
      );

      if (response.status === 201) {
        setIsUploading(false);
        setImageProgress(0);

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
      setIsUploading(false);
      setImageProgress(0);

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
        <h1 className="mb-4 text-3xl font-bold">Create new Album</h1>
        <div className="mb-2 flex w-full justify-center space-x-6  ">
          <div className="h-full w-10/12 rounded-lg border  p-6 shadow-md md:mt-0">
            <div className=" w-full border px-4 ">
              <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div className="mr-auto shrink-0 sm:py-3">
                  <p className="text-lg font-medium">Album Details</p>
                  <p className="text-sm text-gray-400">Add your album</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Album Name</p>
                <input
                  placeholder="Type album name"
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              {errors.name && (
                <p className="mb-1 text-red-500">{errors.name}</p>
              )}
              <div className="flex flex-col gap-4 py-4 lg:flex-row">
                <div className="w-32 shrink-0 sm:py-4">
                  <p className="mb-auto text-lg font-medium">Image</p>
                </div>
                <div className="w-full">
                  <input
                    onChange={uploadImageToClient}
                    name="image"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-md border bg-transparent px-2 py-2 text-blue-600 outline-none ring-blue-600 focus:ring-1"
                  />
                  {image && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">{image.name}</div>
                      <div className="relative mt-2 h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                        <div
                          className="absolute left-0 right-0 h-full rounded-lg bg-[#6A64F1]"
                          style={{ width: `${imageProgress}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {isUploading ? `${imageProgress}%` : 'Ready to upload'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4 h-full w-3/12 rounded-lg border p-6 shadow-md md:mt-0">
            <div className="flex justify-between">
              <p className="text-white">Visible</p>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  ref={checkboxRef}
                  onChange={handleCheckboxChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              </label>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between ">
              <p className="mb-1 text-white">About this album</p>
            </div>
            <div className="flex justify-between rounded-lg border">
              <textarea
                onChange={(e) => setDesc(e.target.value)}
                className="peer block min-h-[auto] w-full rounded-lg border-gray-300 bg-transparent  py-[0.32rem]  leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:text-neutral-200  data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 "
                rows="4"
                placeholder="Message"
              />
            </div>

            <div className="my-4"></div>
            <div className="mt-5 w-full">
              <button
                onClick={handleUploadAlbum}
                disabled={isUploading}
                className={`inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white ${
                  isUploading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-600 active:bg-blue-700'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Publish'}
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
