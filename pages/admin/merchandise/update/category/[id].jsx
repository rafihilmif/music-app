import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { baseURL } from '@/baseURL';

const updateCategoryId = () => {
  const router = useRouter();
  const [newName, setNewName] = useState('');
  const [name, setName] = useState('');
  const { id } = router.query;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${baseURL}/admin/category?id=${id}`);
        setName(response.data.name);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [id]);

  const onUpdate = async () => {
    await axios
      .put(`${baseURL}/admin/category?id=${id}`, {
        name: newName,
      })
      .then(alert('Data berhasil diubah'), router.reload())
      .catch((err) => console.error('error' + err));
  };
  return (
    <>
      <div class="relative my-4 w-full border bg-white px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4">
        <div class="flex flex-col border-b py-4 sm:flex-row sm:items-start">
          <div class="mr-auto shrink-0 sm:py-3">
            <p class="font-medium">Category Details</p>
            <p class="text-sm text-gray-600">Update existing data</p>
          </div>
          <a
            href="/admin/merchandise/category"
            class="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring sm:inline"
          >
            Back
          </a>
          <button
            onClick={onUpdate}
            class="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring sm:inline"
          >
            Update
          </button>
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">ID</p>
          <input
            readOnly={true}
            value={id}
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Genre Name</p>
          <input
            required
            defaultValue={name}
            onChange={(e) => setNewName(e.target.value)}
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
      </div>
    </>
  );
};
export default updateCategoryId;
