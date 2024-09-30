import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import category from '../../category';
const updateMerchById = () => {
  const router = useRouter();
  const fileInputRef = useRef();

  const [dataCategory, setDataCategory] = useState([]);

  const [oldName, setOldName] = useState('');
  const [oldArtist, setOldArtist] = useState('');
  const [oldSizeS, setOldSizeS] = useState(0);
  const [oldSizeM, setOldSizeM] = useState(0);
  const [oldSizeL, setOldSizeL] = useState(0);
  const [oldSizeXL, setOldSizeXL] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [oldDesc, setOldDesc] = useState('');
  const [oldImage, setOldImage] = useState('');

  const { id } = router.query;

  const [formData, setFormData] = useState({});
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${baseURL}/admin/merch?id=${id}`);
        setOldName(response.data.name);
        setOldArtist(response.data.artist);
        setOldSizeS(response.data.s);
        setOldSizeM(response.data.m);
        setOldSizeL(response.data.l);
        setOldSizeXL(response.data.xl);
        setOldPrice(response.data.price);
        setOldDesc(response.data.description);
        setOldImage(response.data.image);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    fetchDataCategory();
  }, []);

  const fetchDataCategory = async () => {
    await axios
      .get(`${baseURL}/category`)
      .then((res) => {
        setDataCategory(res.data.data);
        console.log(dataCategory);
      })
      .catch((err) => console.error('error' + err));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleUpdate = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (newImage) {
      data.append('image', newImage);
    }
    await axios
      .put(`${baseURL}/admin/merch?id=${id}`, data)
      .then(
        alert('Data berhasil diubah'),
        router.push('/admin/merchandise/data'),
      )
      .catch((err) => console.error('error' + err));
  };

  const removeImageSong = async () => {
    await axios
      .put(`${baseURL}/admin/song/remove/avatar?id=${id}`)
      .then(router.reload())
      .catch((err) => console.error('error' + err));
  };
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
            <div class="relative my-4 w-full border bg-white px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4">
              <div class="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div class="mr-auto shrink-0 sm:py-3">
                  <p class="font-medium">Product Details</p>
                  <p class="text-sm text-gray-600">Add your product details</p>
                </div>
                <a
                  href="/admin/merchandise/data"
                  class="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring sm:inline"
                >
                  Cancel
                </a>
                <button
                  onClick={handleUpdate}
                  class="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring sm:inline"
                >
                  Save
                </button>
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Product Name</p>
                <input
                  defaultValue={oldName}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Type product name"
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Artist</p>
                <input
                  readOnly={true}
                  defaultValue={oldArtist}
                  placeholder="Type product name"
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Category</p>
                <div class="relative w-full rounded-lg ">
                  <select
                    onChange={(e) => updateField('category', e.target.value)}
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
                  onChange={(e) => updateField('s', e.target.value)}
                  defaultValue={oldSizeS}
                  placeholder="S"
                  type="number"
                  class="mb-2 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1 sm:mb-0 sm:mr-4"
                />
                <input
                  onChange={(e) => updateField('m', e.target.value)}
                  defaultValue={oldSizeM}
                  placeholder="M"
                  type="number"
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
                <input
                  onChange={(e) => updateField('l', e.target.value)}
                  defaultValue={oldSizeL}
                  placeholder="L"
                  type="number"
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
                <input
                  onChange={(e) => updateField('xl', e.target.value)}
                  defaultValue={oldSizeXL}
                  placeholder="XL"
                  type="number"
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Price</p>
                <input
                  onChange={(e) => updateField('price', e.target.value)}
                  defaultValue={oldPrice}
                  placeholder="Rp. "
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Description</p>
                <textarea
                  onChange={(e) => updateField('description', e.target.value)}
                  defaultValue={oldDesc}
                  placeholder="Write product description here"
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 py-4  lg:flex-row">
                <div class="w-32 shrink-0  sm:py-4">
                  <p class="mb-auto font-medium">Pict</p>
                  <p class="text-sm text-gray-600">Change your image</p>
                </div>
                <div class="flex h-56 w-80 flex-col items-center rounded-xl border border-dashed border-gray-300 p-5 text-center">
                  <img
                    class="h-full w-full"
                    src={`${baseURLFile}/assets/image/merchandise/${oldImage}`}
                  />
                  <button
                    class="my-2 -mt-32 items-center rounded-md border border-transparent bg-gray-900 px-2 py-2 text-xs
        font-semibold uppercase tracking-widest text-gray-50 shadow-md ring-gray-300 transition duration-150 
       ease-in-out hover:bg-gray-700 focus:border-gray-900 focus:outline-none focus:ring active:bg-gray-900 disabled:opacity-25"
                  >
                    remove image
                  </button>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    class="my-2 items-center rounded-md border border-transparent bg-gray-900 px-2 py-2 text-xs
        font-semibold uppercase tracking-widest text-gray-50 shadow-md ring-gray-300 transition duration-150 
       ease-in-out hover:bg-gray-700 focus:border-gray-900 focus:outline-none focus:ring active:bg-gray-900 disabled:opacity-25"
                  >
                    replace image
                  </button>
                  <input
                    onChange={handleImageChange}
                    type="file"
                    ref={fileInputRef}
                    hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default updateMerchById;
