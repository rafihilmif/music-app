import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import TableCustSubs from '@/components/admin/subscription/TableCustSubs';
import React from 'react';

const DataAllSubs = () => {
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
            <TableCustSubs />
          </div>
        </div>
      </div>
    </>
  );
};
export default DataAllSubs;
