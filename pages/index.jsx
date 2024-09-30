import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import Musickvlt from '../public/images/icons/musickvlt.png';
import { signIn, useSession } from 'next-auth/react';

export default function index({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
  };
  useEffect(() => {
    if (status === 'unauthenticated') {
      return;
    } else if (status === 'authenticated' && session.user.role === 'artist') {
      localStorage.setItem('email', JSON.stringify(session.user.email));
      router.push('/artist');
    } else if (status === 'authenticated' && session.user.role === 'fans') {
      localStorage.setItem('email', JSON.stringify(session.user.email));
      router.push('/fans/home');
    }
  }, [status]);
  return (
    <>
      <div className="flex h-full w-full flex-col items-center px-3 sm:px-8">
        <Head>
          <title>Login - Musickvlt</title>
          <link></link>
        </Head>
        <header className="flex w-full items-center justify-center border-b py-6">
          <Image src={Musickvlt} height={37} priority={true} alt="" />
        </header>
        <div className="flex w-full flex-col items-center justify-center py-8 sm:w-[450px]">
          <h1 className="text-dark mb-5 mt-5 text-center text-3xl font-bold tracking-tighter">
            Discover a blackened, raw and cold music with us.
          </h1>

          <div className="flex w-full flex-col items-center px-3 sm:px-8">
            <div className="flex w-full flex-col font-bold">
              <label className="text-sm">Email address</label>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="font-book mt-3 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2 focus:border-black"
              />
            </div>
            <div className="mb-4 mt-4 flex w-full flex-col font-bold">
              <label className="text-sm">Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="font-book focous:border-black mt-2 rounded-md border border-slate-500  py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2"
              />
            </div>
            <button
              type="submit"
              onClick={handleLogin}
              className="text-md text-dark w-full rounded-full bg-[#D1E9F6] px-12 py-3 font-bold uppercase transition-transform hover:scale-105"
            >
              log in
            </button>
          </div>

          <div className="font-book flex w-full flex-col items-center px-8 pb-16 pt-4">
            <p className="h-[0.05rem] w-full bg-slate-400"></p>
            <h1 className="mt-6 text-xl font-bold">
              {' '}
              Don&apos;t have an account?
            </h1>

            <a
              onClick={(e) => router.push('/signup/artist')}
              className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-full border-slate-500 bg-white py-3 text-sm uppercase text-slate-500 transition-transform hover:scale-105"
            >
              Sign up for Artist
            </a>
            <a
              onClick={(e) => router.push('/signup/fans')}
              className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-full border-slate-500 bg-white py-3 text-sm uppercase text-slate-500 transition-transform hover:scale-105"
            >
              Sign up for Fans
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
