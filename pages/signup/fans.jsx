'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { baseURL } from '@/baseURL';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function SignUpFans (){
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${baseURL}/register/fans`, {
        email: email,
        username: username,
        confirm_password: confirm_password,
        password: password,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
          confirmButtonText: 'OK',
          confirmButtonColor: "#3085d6"
        }).then(() => {
          window.location.reload();
          //  console.log(response.data.message);
          //  console.log(response.data.data);
        });
      }
    } catch (error) {
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
    <div className="flex h-screen w-full flex-col items-center overflow-auto px-3 sm:px-8">
      <Head>
        <title>Sign up - Musickvlt</title>
        <link></link>
      </Head>
      <header className="mt-10 flex w-full items-center justify-center">
        <img src="/images/icons/musickvlt.png" className="h-15" />
      </header>
      <div className="flex w-full flex-col items-center justify-center py-8 sm:w-[450px]">
        <h1 className="text-dark mb-4 mt-4 text-center text-3xl font-bold tracking-tighter">
          Sign up for free listening music in indonesia.
        </h1>
        <div className="flex w-full flex-col items-center px-3 sm:px-8">
          <div className="flex w-full flex-col font-bold">
            <label className="text-sm">What&apos;s your email?</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2 focus:border-black"
            />
            {errors.email && (
              <p className="mb-1 text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="mt-8 flex w-full flex-col font-bold">
            <label className="text-sm">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2"
            />
            {errors.password && (
              <p className="mb-1 text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="mt-8 flex w-full flex-col font-bold">
            <label className="text-sm">Confirm Password</label>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2"
            />
            {errors.confirm_password && (
              <p className="mb-1 text-red-500">{errors.confirm_password}</p>
            )}
          </div>
          <div className="mt-8 flex w-full flex-col font-bold">
            <label className="text-sm">What&apos; we should call you?</label>
            <input
              type="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="font-book mt-2 rounded-md border border-slate-500 py-3 pl-4 outline-none transition-all placeholder:text-slate-500 focus:border-2"
            />
            {errors.username && (
              <p className="mb-1 text-red-500">{errors.username}</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-center pb-3 pt-8 sm:px-3">
          <button
            onClick={handleRegister}
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
      </div>
    </div>
  );
};
