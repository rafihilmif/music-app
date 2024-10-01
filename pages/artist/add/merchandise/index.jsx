import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
export default function index() {
  const router = useRouter();
  const [id, setId] = useState();

  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState({});

  const [dataCategory, setDataCategory] = useState([]);

  const [artist, setArtist] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState([]);
  const [category, setCategory] = useState('');
  const [sizeS, setSizeS] = useState(0);
  const [sizeM, setSizeM] = useState(0);
  const [sizeL, setSizeL] = useState(0);
  const [sizeXL, setSizeXL] = useState(0);
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState();

  const email =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('email'))
      : null;

  const checkboxRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    if (checkboxRef.current) {
      setIsChecked(checkboxRef.current.checked);
    }
  };

  useEffect(() => {
    fetchDataCategory();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/artist?email=${email}`,
        );
        setId(response.data.id_artist);
        setArtist(response.data.name);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [email]);

  const uploadImageToClient = (event) => {
    const newFiles = Array.from(event.target.files);
    setImage((prevFiles) => [...prevFiles, ...newFiles]);

    newFiles.forEach((file) => {
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [file.name]: 0,
      }));
    });
  };

  useEffect(() => {
    if (isChecked) {
      setStatus(1);
    }
    if (!isChecked) {
      setStatus(0);
    }
  }, [isChecked]);

  const fetchDataCategory = async () => {
    await axios
      .get(`${baseURL}/category`)
      .then((res) => {
        setDataCategory(res.data);
      })
      .catch((err) => console.error('error' + err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const removeImage = (index) => {
    const newImages = image.filter((_, i) => i !== index);
    setImage(newImages);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('artist', artist);
    formData.append('category', category);

    formData.append('price', price);
    formData.append('description', desc);
    formData.append('status', status);

    if (
      sizeS === 0 &&
      sizeM === 0 &&
      sizeM === 0 &&
      (sizeL === 0) & (sizeXL === 0)
    ) {
      formData.append('sizeS', 0);
      formData.append('sizeM', 0);
      formData.append('sizeL', 0);
      formData.append('sizeXL', 0);
      formData.append('stock', stock);
    } else {
      const totalStock =
        parseInt(sizeS) + parseInt(sizeM) + parseInt(sizeL) + parseInt(sizeXL);
      formData.append('sizeS', sizeS);
      formData.append('sizeM', sizeM);
      formData.append('sizeL', sizeL);
      formData.append('sizeXL', sizeXL);
      formData.append('stock', totalStock);
    }

    image.forEach((image) => {
      formData.append('image', image);
    });

    try {
      await axios.post(`${baseURL}/artist/merchandise/add?id=${id}`, formData);
      alert('Successfully added merchandise');
    } catch (error) {
      if (error.response) {
        alert('Error uploading file: ' + error.response.data.message);
      } else if (error.request) {
        alert('Error sending request to server.');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <h1 className="mb-4 text-3xl font-bold">Create new Merchandise</h1>
        <form
          onSubmit={handleUpload}
          className="mb-2 flex w-full justify-center space-x-6 "
        >
          <div className="h-full w-9/12 rounded-lg border  p-6 shadow-md md:mt-0">
            <div className=" w-full border px-4 ">
              <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div className="mr-auto shrink-0 sm:py-3">
                  <p className="text-lg font-medium">Merchandise Details</p>
                  <p className="text-sm text-gray-400">Add your Merchandise</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium"> Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type merchandise name"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>

              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Category</p>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                >
                  <option className="text-black" value="#">
                    Please select category...
                  </option>
                  {dataCategory.map((item, i) => (
                    <option className="text-black" key={i} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {category === 'T-shirt' ||
              category === 'Long Sleeve' ||
              category === 'Hoodie' ||
              category === 'Zipper Hoodie' ||
              category === 'Sweatshirt' ? (
                <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                  <p className="w-32 shrink-0 text-lg font-medium">Size</p>
                  <input
                    onChange={(e) => setSizeS(e.target.value)}
                    placeholder="S"
                    type="number"
                    defaultValue={0}
                    className="mb-2 w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1 sm:mb-0 sm:mr-4"
                  />
                  <input
                    onChange={(e) => setSizeM(e.target.value)}
                    placeholder="M"
                    type="number"
                    defaultValue={0}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  />
                  <input
                    onChange={(e) => setSizeL(e.target.value)}
                    placeholder="L"
                    type="number"
                    defaultValue={0}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  />
                  <input
                    onChange={(e) => setSizeXL(e.target.value)}
                    placeholder="XL"
                    type="number"
                    defaultValue={0}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                  <p className="w-32 shrink-0 text-lg font-medium">Stock</p>
                  <input
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Stock"
                    type="number"
                    defaultValue={0}
                    className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                  />
                </div>
              )}
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Price</p>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="Rp. "
                  defaultValue={0}
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div className="flex flex-col gap-4 py-4 lg:flex-row">
                <div className="w-32 shrink-0  sm:py-4">
                  <p className="mb-auto text-lg font-medium">Image</p>
                </div>
                <div class="w-full rounded-md border bg-transparent px-2 py-2 text-blue-600 outline-none ring-blue-600 focus:ring-1">
                  <div class="mb-8">
                    <input
                      type="file"
                      onChange={uploadImageToClient}
                      name="image"
                      id="file"
                      class="sr-only"
                    />
                    <label
                      for="file"
                      class="relative flex min-h-[100px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                    >
                      <div>
                        <span class="inline-flex cursor-pointer rounded border border-[#e0e0e0] px-7 py-2 text-base font-medium text-white">
                          Browse
                        </span>
                      </div>
                    </label>
                  </div>
                  {image.map((file, index) => (
                    <div class="mb-4 rounded-md bg-[#F5F7FB] px-8 py-4">
                      <div class="flex items-center justify-between">
                        <span class="truncate pr-3 text-base font-medium text-[#07074D]">
                          {file.name}
                        </span>
                        <button
                          class="text-[#07074D]"
                          onClick={() => removeImage(index)}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                              fill="currentColor"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                      <div class="relative mt-5 h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                        <div class="absolute left-0 right-0 h-full w-[75%] rounded-lg bg-[#6A64F1]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-full w-3/12 rounded-lg border p-6 shadow-md md:mt-0">
            <div className="flex justify-between">
              <p className="text-white">Visible</p>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  ref={checkboxRef}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              </label>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between ">
              <p className="mb-1 text-white">Description</p>
            </div>
            <div className="flex justify-between rounded-lg border">
              <textarea
                onChange={(e) => setDesc(e.target.value)}
                className="peer block min-h-[auto] w-full rounded-lg border-gray-300 bg-transparent py-[0.32rem]  leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 "
                rows="13"
                placeholder="Message"
              />
            </div>
            <div className="my-4"></div>
            <div className="mt-7 w-full">
              <button
                type="submit"
                className="hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 inline-block w-full rounded bg-blue-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white"
              >
                Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  if (session.user.role === 'fans') {
    return {
      redirect: {
        destination: '/fans',
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...session,
    },
  };
}
