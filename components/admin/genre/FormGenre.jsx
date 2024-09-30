import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { useForm } from 'react-hook-form';
const FormGenre = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${baseURL}/admin/genre/add`, data);
      alert('Genre berhasil ditambahkan');
    } catch (error) {
      alert('Error add data:', error);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        class="relative my-4 w-full border bg-white px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4"
      >
        <div class="flex flex-col border-b py-4 sm:flex-row sm:items-start">
          <div class="mr-auto shrink-0 sm:py-3">
            <p class="font-medium">Genre Details</p>
            <p class="text-sm text-gray-600">Add new genre</p>
          </div>
          <button
            onClick={() => reset()}
            class="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring sm:inline"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="hidden rounded-lg border-2 border-transparent bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring sm:inline"
          >
            Add
          </button>
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Genre Name</p>
          <input
            {...register('name', { required: true })}
            placeholder="Type genre name"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
      </form>
    </>
  );
};
export default FormGenre;
