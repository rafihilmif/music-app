import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

const updateFansById = () => {
  const router = useRouter();
  const fileInputRef = useRef();

  const [oldFirstName, setOldFirstName] = useState('');
  const [oldLastName, setOldLastName] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [oldUsername, setOldUsername] = useState('');
  const [oldBirthday, setOldBirthday] = useState('');
  const [oldGender, setOldGender] = useState('');
  const [oldAvatar, setOldAvatar] = useState('');

  const [formData, setFormData] = useState({});
  const [newAvatar, setNewAvatar] = useState(null);
  const { id } = router.query;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${baseURL}/admin/fan?id=${id}`);
        setOldFirstName(response.data.first_name);
        setOldLastName(response.data.last_name);
        setOldEmail(response.data.email);
        setOldUsername(response.data.username);
        setOldBirthday(response.data.birth);
        setOldGender(response.data.gender);
        setOldAvatar(response.data.avatar);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [id]);

  const handleAvatarChange = (event) => {
    setNewAvatar(event.target.files[0]);
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
    if (newAvatar) {
      data.append('image', newAvatar);
    }
    await axios
      .put(`${baseURL}/admin/fan?id=${id}`, data)
      .then(alert('Data berhasil diubah'), router.push('/admin/fans/data'))
      .catch((err) => console.error('error' + err));
  };

  const removeImage = async () => {
    await axios
      .put(`${baseURL}/admin/fan/remove/avatar?id=${id}`)
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
                  <p class="font-medium">Identity Details</p>
                  <p class="text-sm text-gray-600">Update existing data</p>
                </div>
                <a
                  href="/admin/fans/data"
                  class="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring sm:inline"
                >
                  Back
                </a>
                <button
                  onClick={handleUpdate}
                  class="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring sm:inline"
                >
                  Update
                </button>
              </div>

              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Name</p>
                <input
                  placeholder="First Name"
                  defaultValue={oldFirstName}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  class="mb-2 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1 sm:mb-0 sm:mr-4"
                />
                <input
                  placeholder="Last Name"
                  defaultValue={oldLastName}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Email</p>
                <input
                  readOnly={true}
                  value={oldEmail}
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Username</p>
                <input
                  readOnly={true}
                  value={oldUsername}
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">New Password</p>
                <input
                  type="password"
                  placeholder="********"
                  onChange={(e) => updateField('password', e.target.value)}
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Birthday</p>
                <input
                  defaultValue={oldBirthday}
                  onChange={(e) => updateField('birth', e.target.value)}
                  type="date"
                  class="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div class="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p class="w-32 shrink-0 font-medium">Gender</p>
                <div class="relative w-full rounded-lg ">
                  <select
                    onChange={(e) => updateField('gender', e.target.value)}
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
                <div class="flex h-56 w-80 flex-col items-center rounded-xl border border-dashed border-gray-300 p-5 text-center">
                  <img
                    class="h-full w-full"
                    src={`${baseURLFile}/assets/image/avatar/${oldAvatar}`}
                  />
                  <button
                    onClick={removeImage}
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
                    onChange={handleAvatarChange}
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
export default updateFansById;
