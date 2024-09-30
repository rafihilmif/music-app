import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import TableShipping from '@/components/admin/user/fans/TableShipping';
import React from 'react';

const shipping = () => {
  return (
    <>
      <div className="flex h-screen w-full">
        <div className="absolute h-1/4 w-full bg-blue-500 dark:hidden"> </div>
        <div className="h-screen w-2/12">
          <Sidebar />
        </div>
        <div className="h-screen w-10/12">
          <Navbar />
          <div className="mt-6 flex h-auto w-full">
            <TableShipping />
          </div>
        </div>
      </div>
    </>
  );
};
export default shipping;
