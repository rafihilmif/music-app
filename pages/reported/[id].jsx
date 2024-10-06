import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import Swal from 'sweetalert2';

export default function index() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [idUser, setIdUser] = useState();

  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session.user.email) {
        try {
          let response;
          if (session.user.role === 'artist') {
            response = await axios.get(
              `${baseURL}/detail/artist?email=${session.user.email}`,
            );
            setIdUser(response.data.id_artist);
          } else if (session.user.role === 'fans') {
            response = await axios.get(
              `${baseURL}/detail/fans?email=${session.user.email}`,
            );
            setIdUser(response.data.id_fans);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [status, session]);

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('comment', comment);
    data.append('category', category);

    try {
      const response = await axios.post(
        `${baseURL}/reported?idUser=${idUser}&&idArtist=${id}`,
        data,
        {
          headers: {
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
        }).then(() => {
          //  window.location.reload();
          console.log(response.data.message);
          console.log(response.data.data);
        });
      }
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <h1 className="mb-4 text-3xl font-bold">Reported a Artist</h1>
        <div className="mb-2 w-full">
          <div className="h-full w-full rounded-lg border p-6 shadow-md md:mt-0">
            <div className="w-full border px-4">
              <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div className="mr-auto shrink-0 sm:py-3">
                  <p className="text-lg font-medium">Report Details</p>
                  <p className="text-sm text-gray-400">Behaviour</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Categories</p>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                >
                  <option className="text-black" value="#">
                    Please select categories...
                  </option>
                  <option className="text-black" value="fraud">
                    Content fraud
                  </option>
                  <option className="text-black" value="violence">
                    Content containing violence
                  </option>
                  <option className="text-black" value="dislike">
                    Content who dislike
                  </option>
                  <option className="text-black" value="harassment">
                    Content harassment
                  </option>
                  <option className="text-black" value="stealing">
                    Content stealing
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Comment</p>
                <textarea
                  placeholder="Type comment"
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  rows="13"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={() => handleSubmit()}
              className="hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 mt-4 inline-block w-full rounded bg-blue-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white"
            >
              Send
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
