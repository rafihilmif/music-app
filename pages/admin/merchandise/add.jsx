import React from 'react';
import Navbar from '@/components/admin/Navbar';
import Form from '@/components/admin/merchandise/FormMerch';
import Sidebar from '@/components/admin/Sidebar';

const addMerchandise = () => {
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
            <Form />
          </div>
        </div>
      </div>
    </>
  );
};
export default addMerchandise;
