import Cards from '@/components/admin/Cards';
import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import React from 'react';

export default function dashboard() {
  return (
    <>
      <div className="flex h-screen w-full">
        <div className="absolute h-1/4 w-full bg-blue-500 dark:hidden"> </div>
        <div className="h-screen w-2/12">
          <Sidebar />
        </div>
        <div className="h-screen w-10/12 ">
          <div className="mt-3">
            <Navbar />
          </div>
          <div className="mt-6 flex h-auto w-full">
            <Cards />
          </div>
          <div className="mt-3 flex h-auto w-full"></div>
        </div>
      </div>
    </>
  );
}
