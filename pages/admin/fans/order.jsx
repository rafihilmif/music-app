import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import TableOrder from '@/components/admin/user/fans/TableOrder';
import React from 'react';

const order = () => {
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
            <TableOrder />
          </div>
        </div>
      </div>
    </>
  );
};
export default order;
