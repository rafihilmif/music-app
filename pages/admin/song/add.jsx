import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import FormSong from '@/components/admin/song/FormSong';
import React from 'react';

const AddSong = () => {
  return (
    <>
      <div className="flex h-screen w-full">
        <div className="absolute h-1/4 w-full bg-blue-500 dark:hidden"> </div>
        <div className="h-screen w-2/12">
          <Sidebar />
        </div>
        <div className="h-screen w-10/12">
          <Navbar />
          <div className="mt-1 flex h-auto w-full">
            <FormSong />
          </div>
        </div>
      </div>
    </>
  );
};
export default AddSong;
