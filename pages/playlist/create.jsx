import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import Swal from 'sweetalert2';
export default function create() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [name, setName] = useState('');

  const [image, setImage] = useState(null);

  const [createObjectURL, setCreateObjectURL] = useState(null);
    const [imageProgress, setImageProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const uploadImageToClient = (event) => {
      if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setImage(i);
        setCreateObjectURL(URL.createObjectURL(i));
        setImageProgress(0);
      }
    };

    const handleUpload = async () => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', name);

      try {
        const response = await axios.post(
          `${baseURL}/playlist/add`,
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
              setUploadProgress((prevProgress) => {
                const newProgress = {};
                image.forEach((file) => {
                  newProgress[file.name] = percentCompleted;
                });
                return newProgress;
              });
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
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while add the playlist',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        window.location.reload();
      }
    };

    return (
      <>
        <Navbar />
        <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
          <h1 className="mb-4 text-3xl font-bold">Create new Playlist</h1>
          <div className="mb-2 w-full">
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
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  />
                </div>
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
                        <div className="text-sm text-gray-500">
                          {image.name}
                        </div>
                        <div className="relative mt-2 h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                          <div
                            className="absolute left-0 right-0 h-full rounded-lg bg-[#6A64F1]"
                            style={{ width: `${imageProgress}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {isUploading
                            ? `${imageProgress}%`
                            : 'Ready to upload'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUpload}
                className="hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 mt-4 inline-block w-full rounded bg-blue-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white"
              >
                Publish
              </button>
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
