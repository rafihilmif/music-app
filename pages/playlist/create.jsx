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
  const [id, setId] = useState();

  const [name, setName] = useState('');

  const [image, setImage] = useState(null);

  const [createObjectURL, setCreateObjectURL] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated') {
        try {
          let response;
          if (session.user.role === 'artist') {
            response = await axios.get(
              `${baseURL}/detail/artist?email=${session.user.email}`,
            );
            setId(response.data.id_artist);
          } else if (session.user.role === 'fans') {
            response = await axios.get(
              `${baseURL}/detail/fans?email=${session.user.email}`,
            );
            setId(response.data.id_fans);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [status, session]);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);

    try {
      const response = await axios.post(
        `${baseURL}/playlist/add?id=${id}`,
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
      window.location.reload();
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <h1 className="mb-4 text-3xl font-bold">Create new Playlist</h1>
        <form className="mb-2 w-full" onSubmit={handleUpload}>
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
                <input
                  type="file"
                  name="image"
                  onChange={uploadToClient}
                  className="w-full rounded-md border px-2 py-2 text-blue-600 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
            </div>
            <button
              type="submit"
              className="hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 mt-4 inline-block w-full rounded bg-blue-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white"
            >
              Publish
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
