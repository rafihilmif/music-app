import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import { Done } from '@mui/icons-material';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';

export default function index() {
  const { data: session } = useSession();
  const [snapToken, setSnapToken] = useState(null);
  const [currentPlan, setCurrentPlan] = useState([]);

  useEffect(() => {
    const fetchDataPlan = async () => {
      try {
        const response = await axios.get(`${baseURL}/fans/plan/detail`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setCurrentPlan(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataPlan();
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
      const response = await axios.post(
        `${baseURL}/plan/payment`,
        {
          amount,
          types,
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const { token } = response.data;
      setSnapToken(token);
      window.snap.pay(token, {
        onSuccess: function (result) {
          alert('Payment success:' + result);
          router.push('/fans');
        },
        onPending: function (result) {
          alert('Payment pending:' + result);
        },
        onError: function (result) {
          alert('Payment error:' + result);
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
      {currentPlan && currentPlan.type !== 'free' ? (
        <div className="my-5 h-screen rounded-lg bg-gray-100 p-6 font-sans">
          <h1 className="mb-4 text-2xl font-bold text-black">Subscription</h1>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Details
            </h2>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current plan</p>
                <div className="flex justify-between">
                  {currentPlan.type === 'premium' ? (
                    <span className="font-medium text-blue-500">
                      {currentPlan.type}
                    </span>
                  ) : (
                    <span className="font-medium text-purple-500">
                      {currentPlan.type}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black">Monthly payment</span>
                <span>
                  {currentPlan.type === 'premium' ? 'Rp. 66K' : 'Rp. 106K'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Current Period</span>
                <span className="text-black">
                  {currentPlan.start} / {currentPlan.expired}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Plan Status</span>
                {currentPlan.status === 1 ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Non-active</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 h-auto w-full overflow-hidden px-2">
          <div className="flex w-full flex-wrap justify-around gap-6 bg-transparent px-2 py-4 font-sans">
            <div className="h-auto w-full overflow-hidden">
              <div className="flex w-full flex-wrap justify-around gap-1 bg-transparent px-2 font-sans">
                {/* Free Plan Card */}
                <div className="relative flex w-full max-w-[20rem] flex-col rounded-xl bg-[#2f3135] p-8 text-white shadow-md">
                  <div className="flex-grow">
                    <div className="relative m-0 mb-8 border-b border-white/10 pb-8 text-center">
                      <p className="block font-sans text-sm uppercase">Free</p>
                      <h1 className="mt-6 flex justify-center gap-1 text-7xl">
                        <span className="mt-2 text-sm">Rp.</span> 0
                        <span className="self-end text-xl">/-</span>
                      </h1>
                    </div>
                    <div className="p-0">
                      <ul className="flex flex-col gap-4">
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                          <p className="text-base">3 times listening</p>
                        </li>
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                          <p className="text-base">Play anywhere</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Premium Plan Card */}
                <div className="relative flex w-full max-w-[20rem] flex-col rounded-xl bg-white p-8 text-black shadow-md">
                  <div className="flex-grow">
                    <div className="relative m-0 mb-8 border-b border-black/20 pb-8 text-center">
                      <p className="block font-sans text-sm uppercase">
                        Premium
                      </p>
                      <h1 className="mt-6 flex justify-center gap-1 text-7xl">
                        <span className="mt-2 text-sm">Rp.</span>66K
                        <span className="self-end text-xl">/mo</span>
                      </h1>
                    </div>
                    <div className="p-0">
                      <ul className="flex flex-col gap-4">
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-black/20 bg-black/20 p-1" />
                          <p className="text-base">Unlimited listening</p>
                        </li>
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-black/20 bg-black/20 p-1" />
                          <p className="text-base">Your own playlist</p>
                        </li>
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-black/20 bg-black/20 p-1" />
                          <p className="text-base">Your own favorites</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-12 p-0">
                    <button
                      onClick={() => handleBuyNow(66600, 'premium')}
                      className="block w-full rounded-lg bg-indigo-300 px-7 py-3.5 text-center text-sm font-bold uppercase shadow-md hover:scale-[1.02] hover:shadow-lg"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Deluxe Plan Card */}
                <div className="relative flex w-full max-w-[20rem] flex-col rounded-xl bg-[#2f3135] p-8 text-white shadow-md">
                  <div className="flex-grow">
                    <div className="relative m-0 mb-8 border-b border-white/20 pb-8 text-center">
                      <p className="block font-sans text-sm uppercase">
                        Deluxe
                      </p>
                      <h1 className="mt-6 flex justify-center gap-1 text-7xl">
                        <span className="mt-2 text-sm">Rp.</span> 106K
                        <span className="self-end text-xl">/3mo</span>
                      </h1>
                    </div>
                    <div className="p-0">
                      <ul className="flex flex-col gap-4">
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                          <p className="text-base">Unlimited listening</p>
                        </li>
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                          <p className="text-base">Play anywhere</p>
                        </li>
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                          <p className="text-base">Your own playlist</p>
                        </li>
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                          <p className="text-base">Your own favorites</p>
                        </li>
                        <li className="flex items-center gap-4">
                          <Done className="rounded-full border border-white/20 bg-white/20 p-1" />
                          <p className="text-base">Longer lifetime 3 months</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-12 p-0">
                    <button
                      onClick={() => handleBuyNow(106000, 'deluxe')}
                      className="block w-full rounded-lg bg-[#4d4f53] px-7 py-3.5 text-center text-sm font-bold uppercase shadow-md hover:scale-[1.02] hover:shadow-lg"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
