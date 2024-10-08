import Navbar from '@/components/user/Navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import { Clear } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

export default function index() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  const [hovered, setHovered] = useState(false);

  const [OldName, setOldName] = useState('');
  const [OldDesc, setOldDesc] = useState('');
  const [OldImage, setOldImage] = useState();
  const [OldLocation, setOldLocation] = useState();
  const [OldContact, setOldContact] = useState();

  const [formData, setFormData] = useState({});
  const [newStatus, setNewStatus] = useState();
  const [newImage, setNewImage] = useState([]);

  const checkboxRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/detail/show?id=${id}`);
        setOldName(response.data.name);
        setOldDesc(response.data.description);
        setOldLocation(response.data.location);
        setOldContact(response.data.contact);
        setOldImage(response.data.image);

        setIsChecked(response.data.status === 1);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const uploadImageToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setNewImage(i);
    }
  };

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    if (isChecked) {
      setNewStatus(1);
    } else {
      setNewStatus(0);
    }
  }, [isChecked]);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleUpdate = async () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    data.append('status', newStatus);
    data.append('image', newImage);

    try {
      await axios.put(`${baseURL}/artist/show/update?id=${id}`, data);
      alert('Successfully updated show', router.reload());
    } catch (error) {
      console.error('Error updating show:', error);
      alert('Error updating show: ' + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <h1 className="mb-4 text-3xl font-bold">Update an Show</h1>
        <div className="mb-2 flex w-full justify-center space-x-6 ">
          <div className="h-full w-9/12 rounded-lg border  p-6 shadow-md md:mt-0">
            <div className=" w-full border px-4 ">
              <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div className="mr-auto shrink-0 sm:py-3">
                  <p className="text-lg font-medium">Show Details</p>
                  <p className="text-sm text-gray-400">Update your Show</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Name Show</p>
                <input
                  defaultValue={OldName}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Type show name"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>

              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Location</p>
                <input
                  defaultValue={OldLocation}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Type adress show"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Contact</p>
                <input
                  defaultValue={OldContact}
                  onChange={(e) => updateField('contact', e.target.value)}
                  placeholder="Type adress show"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div className="flex flex-col gap-4 py-4 lg:flex-row">
                <div className="w-32 shrink-0  sm:py-4">
                  <p className="mb-auto text-lg font-medium">Image</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <label
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="relative flex min-h-[200px] w-64 items-center justify-center rounded-md border border-solid border-gray-300 p-4 text-center shadow-lg"
                  >
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                      <img
                        height={100}
                        width={100}
                        className="block h-full w-auto rounded-xl"
                        alt=""
                        src={`${baseURLFile}/assets/image/shows/${OldImage}`}
                      />
                      {hovered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex flex-col items-center">
                            <label
                              htmlFor={`file-input`}
                              className="text-md group relative h-10 w-36 cursor-pointer overflow-hidden rounded-md bg-blue-500 p-2 font-bold text-white"
                            >
                              Change Picture
                              <input
                                id={`file-input`}
                                type="file"
                                name="image"
                                className="hidden"
                                onChange={(event) => uploadImageToClient(event)}
                              />
                              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
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
                  checked={isChecked}
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
                onChange={(e) => updateField('description', e.target.value)}
                defaultValue={OldDesc}
                className="peer block min-h-[auto] w-full rounded-lg border-gray-300 bg-transparent py-[0.32rem]  leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 "
                rows="13"
                placeholder="Message"
              />
            </div>
            <div className="my-4"></div>
            <div className="mt-7 w-full">
              <button
                onClick={handleUpdate}
                className="hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 inline-block w-full rounded bg-purple-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white hover:bg-purple-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
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
