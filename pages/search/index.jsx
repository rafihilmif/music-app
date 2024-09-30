import Navbar from '@/components/user/Navbar';
import React from 'react';
import { useSession, getSession } from 'next-auth/react';
import BrowseSection from '@/components/user/general/search/browse/Section';
export default function index() {
  return (
    <>
      <Navbar />
      <div className="mb-4 px-2">
        <h1 className="my-5 text-2xl font-bold">Browse all</h1>
        <div className="flex flex-wrap gap-6 overflow-auto">
          <BrowseSection />
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

  return {
    props: {
      ...session,
    },
  };
}
