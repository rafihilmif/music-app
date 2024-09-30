import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { useForm } from 'react-hook-form';

const FormMerchandise = () => {
  const { register, handleSubmit, reset } = useForm();

  const [dataCategory, setDataCategory] = useState([]);
  const [dataArtist, setDataArtist] = useState([]);

  useEffect(() => {
    const fetchDataCategory = async () => {
      await axios
        .get(`${baseURL}/category`)
        .then((res) => {
          setDataCategory(res.data.data);
          console.log(dataCategory);
        })
        .catch((err) => console.error('error' + err));
    };

    const fetchDataArtist = async () => {
      await axios
        .get(`${baseURL}/artist`)
        .then((res) => {
          setDataArtist(res.data.data);
          console.log(dataArtist);
        })
        .catch((err) => console.error('error' + err));
    };

    fetchDataCategory();
    fetchDataArtist();
  }, []);

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
      await axios.post(`${baseURL}/admin/merchandise/add`, formData);
      alert('Berhasil menambahkan merchandise');
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
        class="relative my-4 w-full border bg-white px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4"
      >
        <div class="flex flex-col border-b py-4 sm:flex-row sm:items-start">
          <div class="mr-auto shrink-0 sm:py-3">
            <p class="font-medium">Product Details</p>
            <p class="text-sm text-gray-600">Add your product details</p>
          </div>
          <button
            onClick={() => reset()}
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
          <p class="w-32 shrink-0 font-medium">Product Name</p>
          <input
            {...register('name', { required: true })}
            placeholder="Type product name"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Artist</p>
          <div class="relative w-full rounded-lg ">
            <select
              {...register('id_artist', { required: true })}
              class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            >
              <option value="#">Please select artist...</option>
              {dataArtist.map((item) => (
                <option value={item.id_artist}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Category</p>
          <div class="relative w-full rounded-lg ">
            <select
              {...register('category', { required: true })}
              class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            >
              <option value="#">Please select category...</option>
              {dataCategory.map((item) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Size</p>
          <input
            {...register('sizeS', { required: true })}
            placeholder="S"
            type="number"
            class="mb-2 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1 sm:mb-0 sm:mr-4"
          />
          <input
            {...register('sizeM', { required: true })}
            placeholder="M"
            type="number"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
          <input
            {...register('sizeL', { required: true })}
            placeholder="L"
            type="number"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
          <input
            {...register('sizeXL', { required: true })}
            placeholder="XL"
            type="number"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Price</p>
          <input
            {...register('price', { required: true })}
            placeholder="Rp. "
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
        <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p class="w-32 shrink-0 font-medium">Description</p>
          <input
            {...register('desc')}
            placeholder="Write product description here"
            class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
        <div class="flex flex-col gap-4 py-4  lg:flex-row">
          <div class="w-32 shrink-0  sm:py-4">
            <p class="mb-auto font-medium">Image</p>
            <p class="text-sm text-gray-600">Insert product image</p>
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
      </form>
    </>
  );
};
export default FormMerchandise;
