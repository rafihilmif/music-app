import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import axios from 'axios';
import { TaskAlt } from '@mui/icons-material';

export default function index() {
  const router = useRouter();

  const { token } = router.query;

  // useEffect(() => {
  //  await axios.post(`${baseURL}/register/artist`, {
  //       email: email,
  //       password: password,
  //       confirm_password: confirm_password,
  //       username: username,
  //       genre: genre,
  //       name: name,
  //     });
  // }, [token]);

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <div className="flex flex-col items-center">
            <TaskAlt className="mb-4 h-24 w-24 text-green-500" />
            <h2 className="mb-2 text-2xl font-bold">Email Verified</h2>
            <p className="mb-6 text-gray-600">
              Thank you for verifying your email address. You can now proceed to
              access the full features of our application.
            </p>
            <a
              href="/"
              className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-300 hover:bg-blue-600"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
