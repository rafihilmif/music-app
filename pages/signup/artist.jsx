import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { baseURL } from '@/baseURL';
import Musickvlt from '../../public/images/icons/musickvlt.png';
import axios from 'axios';

function SignUpArtist() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [genre, setGenre] = useState('');
  const [name, setName] = useState('');
  const [dataGenre, setDataGenre] = useState([]);

  useEffect(() => {
    const fetchDataGenre = async () => {
      try {
        const response = await axios.get(`${baseURL}/browse/genre`);
        setDataGenre(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataGenre();
  }, []);

  const handleRegister = async () => {
    try {
      await axios
        .post('http://localhost:3030/api/register/artist', {
          email: email,
          password: password,
          confirm_password: confirm_password,
          username: username,
          genre: genre,
          name: name,
        })
        .then((res) => {
          console.log(res.data);
        });
    } catch (error) {
      console.error('Error during registration:', error.response.data.error);
    }
  };
  return (
    <div className="flex h-screen w-full flex-col items-center overflow-auto px-3 sm:px-8">
      <Head>
        <title>Sign up - Musickvlt</title>
        <link></link>
      </Head>
      <header className="mt-10 flex w-full items-center justify-center">
        <Image src={Musickvlt} height={40} priority={true} />
      </header>
      <form className="flex w-full flex-col items-center justify-center py-8 sm:w-[450px]">
        <h1 className="text-dark mb-4 mt-4 text-center text-3xl font-bold tracking-tighter">
          Sign up to share your music in indonesia.
        </h1>
        <div className="flex w-full flex-col items-center px-3 sm:px-8">
          <div className="flex w-full flex-col font-bold">
            <label className="text-sm">What&apos;s your email?</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2 focus:border-black"
            />
          </div>
          <div className="mt-8 flex w-full flex-col font-bold">
            <label className="text-sm">What&apos;s your username?</label>
            <input
              type="username"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2 focus:border-black"
            />
          </div>
          <div className="mt-8 flex w-full flex-col font-bold">
            <label className="text-sm">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2"
            />
          </div>
          <div className="mt-8 flex w-full flex-col font-bold">
            <label className="text-sm">Confirm Password</label>
            <input
              type="confirm_password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2"
            />
          </div>
          <div className="mt-8 flex w-full flex-col font-bold">
            <label className="text-sm">What&apos; your band name?</label>
            <input
              type="username"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name as Artist"
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2"
            />
          </div>
          <div className="mt-8 flex w-full flex-col font-bold">
            <label className="text-sm">Choose a genre</label>
            <input
              list="genres"
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Choose your genre"
              className="font-book foucs:border-2 mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500"
            />
            <datalist id="genres">
              {dataGenre.map((item, i) => (
                <option key={i} value={item.name}>
                  {item.name}
                </option>
              ))}
            </datalist>
          </div>
        </div>
        <div className="flex w-full flex-col items-center pb-3 pt-8 sm:px-3">
          <button
            type="submit"
            onClick={() => handleRegister()}
            className="text-md text-dark w-full rounded-full bg-[#D1E9F6] px-12 py-3 font-bold uppercase transition-transform hover:scale-105"
          >
            create an account
          </button>
        </div>
        <div className="font-book flex w-full flex-col items-center px-8 pb-16 pt-4">
          <p className="h-[0.05rem] w-full bg-slate-400"></p>
          <h1 className="mt-6 text-xl font-bold">Do you have account?</h1>
          <a
            onClick={(e) => router.push('/')}
            className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-full border-slate-500 bg-white py-3 text-sm uppercase text-slate-500 transition-transform hover:scale-105"
          >
            Sign in for Musickvlt
          </a>
        </div>
      </form>
    </div>
  );
}
export default SignUpArtist;
