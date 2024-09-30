import React from 'react';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { useForm } from 'react-hook-form';
const FormSubs = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${baseURL}/admin/plan/add`, data);
      alert('Plan berhasil ditambahkan');
      reset();
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
            <p class="font-medium">Plan Details</p>
            <p class="text-sm text-gray-600">Add your plan</p>
          </div>
          <button
            onClick={() => reset()}
            class="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring sm:inline"
          >
            Cancel
          </button>
          <button class="hidden rounded-lg border-2 border-transparent bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring sm:inline">
            Add
          </button>
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Plan Name</p>
          <input
            {...register('name', { required: true })}
            placeholder="Type plan name"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Duration</p>
          <div class="relative w-full rounded-lg ">
            <select
              {...register('duration', { required: true })}
              class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            >
              <option value="#">Please select duration...</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Month">3 Month</option>
              <option value="6 Month">6 Month</option>
              <option value="12 Month">12 Month</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Description</p>
          <input
            {...register('desc', { required: true })}
            placeholder="Type a description"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Price</p>
          <input
            {...register('price', { required: true })}
            placeholder="Amount you want to charge"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
      </form>
    </>
  );
};
export default FormSubs;
