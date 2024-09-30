import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import FormSubs from '@/components/admin/subscription/FormSubs';
import TableSubs from '@/components/admin/subscription/TableSubs';
import React from 'react';

const AddPlan = () => {
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
            <FormSubs />
          </div>
          <div className="mt-3 flex h-auto w-full">
            <TableSubs />
          </div>
        </div>
      </div>
    </>
  );
};
export default AddPlan;
