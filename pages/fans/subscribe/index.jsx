import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import { Done } from '@mui/icons-material';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';

export default function index() {
  const { data: session } = useSession();
  const [id, setId] = useState();
  const [snapToken, setSnapToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/fans?email=${session.user.email}`,
        );
        setId(response.data.id_fans);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    const loadMidtransScript = () => {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      scriptTag.setAttribute('data-client-key', process.env.CLIENT_KEY);
      document.body.appendChild(scriptTag);
    };
    loadMidtransScript();
  }, []);

  const handleBuyNow = async (amount, types) => {
    try {
      const response = await axios.post(`${baseURL}/plan/payment?id=${id}`, {
        amount,
        types,
      });
      const { token } = response.data;
      setSnapToken(token);
      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log('Payment success:', result);
        },
        onPending: function (result) {
          console.log('Payment pending:', result);
        },
        onError: function (result) {
          console.error('Payment error:', result);
        },
        onClose: function () {
          console.log('Payment popup closed');
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden px-2">
        <div className="flex w-full flex-wrap justify-around gap-6 bg-transparent px-2 py-4 font-sans">
          <div className="h-auto w-full overflow-hidden ">
            <div className="flex w-full flex-wrap justify-around gap-1 bg-transparent px-2 font-sans">
              <div className="relative flex w-full max-w-[20rem] flex-col rounded-xl bg-[#2f3135] bg-gradient-to-tr bg-clip-border p-8 text-white shadow-md shadow-gray-900/20">
                <div className="flex-grow">
                  <div className="relative m-0 mb-8 overflow-hidden rounded-none border-b border-white/10 bg-transparent bg-clip-border pb-8 text-center text-gray-700 shadow-none">
                    <p className="block font-sans text-sm font-normal uppercase leading-normal text-white antialiased">
                      Free
                    </p>
                    <h1 className="mt-6 flex justify-center gap-1 font-sans text-7xl font-normal tracking-normal text-white antialiased">
                      <span className="mt-2 text-sm">Rp.</span> 0
                      <span className="self-end text-xl">/-</span>
                    </h1>
                  </div>
                  <div className="p-0">
                    <ul className="flex flex-col gap-4">
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          3 times listening
                        </p>
                      </li>
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Play anywhere
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="relative flex w-full max-w-[20rem] flex-col rounded-xl bg-white bg-gradient-to-tr bg-clip-border p-8 text-white shadow-md shadow-gray-900/20">
                <div className="flex-grow">
                  <div className="relative m-0 mb-8 overflow-hidden rounded-none border-b border-black/20 bg-transparent bg-clip-border pb-8 text-center text-gray-700 shadow-none">
                    <p className="block font-sans text-sm font-normal uppercase leading-normal text-black antialiased">
                      Premium
                    </p>
                    <h1 className="mt-6 flex justify-center gap-1 font-sans text-7xl font-normal tracking-normal text-black antialiased">
                      <span className="mt-2 text-sm ">Rp.</span>66K
                      <span className="self-end text-xl ">/mo</span>
                    </h1>
                  </div>
                  <div className="p-0">
                    <ul className="flex flex-col gap-4 text-black">
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-black/20 bg-black/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Unlimited listening
                        </p>
                      </li>
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-black/20 bg-black/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Your own playlist
                        </p>
                      </li>
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-black/20 bg-black/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Your own favorites
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-12 p-0">
                  <button
                    onClick={() => handleBuyNow(66600, 'premium')}
                    className="block w-full rounded-lg bg-indigo-300 px-7 py-3.5 text-center font-sans text-sm font-bold uppercase shadow-md hover:scale-[1.02] hover:shadow-lg"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
              <div className="relative flex w-full max-w-[20rem] flex-col rounded-xl bg-[#2f3135] bg-gradient-to-tr bg-clip-border p-8 text-white shadow-md shadow-gray-900/20">
                <div className="flex-grow">
                  <div className="relative m-0 mb-8 overflow-hidden rounded-none border-b border-white/20 bg-transparent bg-clip-border pb-8 text-center text-gray-700 shadow-none">
                    <p className="block font-sans text-sm font-normal uppercase leading-normal text-white antialiased">
                      Deluxe
                    </p>
                    <h1 className="mt-6 flex justify-center gap-1 font-sans text-7xl font-normal tracking-normal text-white antialiased">
                      <span className="mt-2 text-sm">Rp.</span> 106K
                      <span className="self-end text-xl">/3mo</span>
                    </h1>
                  </div>
                  <div className="p-0">
                    <ul className="flex flex-col gap-4">
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Unlimited listening
                        </p>
                      </li>
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Play anywhere
                        </p>
                      </li>
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Your own playlist
                        </p>
                      </li>
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Your own favorites
                        </p>
                      </li>
                      <li className="flex items-center gap-4">
                        <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                        <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                          Longer lifetime 3 months
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-12 p-0">
                  <button
                    onClick={() => handleBuyNow(106000, 'deluxe')}
                    className="block w-full rounded-lg bg-[#4d4f53] px-7 py-3.5 text-center font-sans text-sm font-bold uppercase shadow-md hover:scale-[1.02] hover:shadow-lg"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
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
        destination: '/login',
        permanent: false,
      },
    };
  }
  if (session.user.role === 'artist') {
    return {
      redirect: {
        destination: '/artist',
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
