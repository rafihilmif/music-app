import React from 'react';
import { useRouter } from 'next/router';

export default function index() {
  const router = useRouter();
  const { email } = router.query;

  return (
    <>
      <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white py-6 sm:py-12">
        <div class="max-w-xl px-5 text-center">
          <h2 class="mb-2 text-[42px] font-bold text-zinc-800">
            Check your inbox
          </h2>
          <p class="mb-2 text-lg text-zinc-500">
            We are glad, that you’re with us ? We’ve sent you a verification
            link to the email address{' '}
            <span class="font-medium text-indigo-500 ">{email}</span>.
          </p>
          <a
            href="/"
            class="mt-3 inline-block w-96 rounded bg-[#D1E9F6] px-5 py-3 font-medium text-black transition-transform hover:scale-105"
          >
            Open the App →
          </a>
        </div>
      </div>
    </>
  );
}
