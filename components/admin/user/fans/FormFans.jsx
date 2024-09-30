import React, { useState } from 'react';
import Image from 'next/image';
import Pict from '../../../../public/images/commonthumbnails/CapturePUNK.PNG';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
const FormFans = () => {
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      if (key === 'image') {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }
    try {
      await axios
        .post(`${baseURL}/admin/fans/add`, formData)
        .then(alert('Berhasil menambahkan akun fans'), router.reload());
    } catch (error) {
      if (error.response) {
        alert(
          'Terjadi kesalahan saat mengunggah file: ' +
            error.response.data.message,
        );
      } else if (error.request) {
        alert('Terjadi kesalahan saat mengirim permintaan ke server.');
      } else {
        alert('Terjadi kesalahan: ' + error.message);
      }
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative my-4 w-full  border bg-white px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4"
      >
        <div>
          <div class="flex flex-col border-b py-4 sm:flex-row sm:items-start">
            <div class="mr-auto shrink-0 sm:py-3">
              <p class="font-medium">Account Details</p>
              <p class="text-sm text-gray-600">Add your account details</p>
            </div>
            <button
              onClick={() => reset()}
              type="reset"
              class="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring sm:inline"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring sm:inline"
            >
              Save
            </button>
          </div>
          <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
            <p class="w-32 shrink-0 font-medium">Name</p>
            <input
              {...register('first_name', { required: true, maxLength: 20 })}
              placeholder="First Name"
              class="mb-2 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1 sm:mb-0 sm:mr-4"
            />
            <input
              {...register('last_name', { required: true, maxLength: 20 })}
              placeholder="Last Name"
              class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            />
          </div>
          <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
            <p class="w-32 shrink-0 font-medium">Email</p>
            <input
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              placeholder="your.email@domain.com"
              class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            />
          </div>
          <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
            <p class="w-32 shrink-0 font-medium">Username</p>
            <input
              {...register('username', { required: true, maxLength: 20 })}
              placeholder="Username"
              class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            />
          </div>
          <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
            <p class="w-32 shrink-0 font-medium">Password</p>
            <input
              {...register('password', { required: true })}
              placeholder="••••••••"
              type="password"
              class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            />
          </div>
          <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
            <p class="w-32 shrink-0 font-medium">Birthday</p>
            <input
              {...register('birth', { required: true })}
              type="date"
              class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            />
          </div>
          <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
            <p class="w-32 shrink-0 font-medium">Gender</p>
            <div class="relative w-full rounded-lg ">
              <select
                {...register('gender', { required: true })}
                class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              >
                <option value="#">Please select gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col gap-4 py-4  lg:flex-row">
            <div class="w-32 shrink-0  sm:py-4">
              <p class="mb-auto font-medium">Avatar</p>
              <p class="text-sm text-gray-600">Change your avatar</p>
            </div>
            <div class="flex h-56 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 p-5 text-center">
              <Image src={Pict} className="h-16 w-16 rounded-full" />
              <p class="text-sm text-gray-600">
                Drop your desired image file here to start the upload
              </p>
              <input
                {...register('image', { required: true })}
                type="file"
                class="max-w-full rounded-lg px-2 font-medium text-blue-600 outline-none ring-blue-600 focus:ring-1"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default FormFans;
