import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { getSession, useSession } from 'next-auth/react';
import Navbar from '@/components/user/Navbar';

export default function index() {
  const { data: session } = useSession();
  const router = useRouter();

  const [dataGenre, setDataGenre] = useState([]);

  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [avatar, setAvatar] = useState();
  const [genre, setGenre] = useState();
  const [formed, setFormed] = useState();
  const [desc, setDesc] = useState();

  const [formData, setFormData] = useState({});
  const [newImageProfile, setNewImageProfile] = useState(null);

  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/artist?email=${session.user.email}`,
        );
        setUsername(response.data.username);
        setName(response.data.name);
        setEmail(response.data.email);
        setAvatar(response.data.avatar);
        setFormed(response.data.formed);
        setDesc(response.data.description);
        setGenre(response.data.genre);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  const uploadImageToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setNewImageProfile(i);
    }
  };

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    const fetchDataGenre = async () => {
      try {
        const response = await axios.get(`${baseURL}/genre?name=${genre}`);
        setDataGenre(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (genre) {
      fetchDataGenre();
    }
  }, [genre]);

  const handleUpdate = async () => {
    const data = new FormData();

    if (newPassword || confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        alert('New password and confirm password do not match.');
        return;
      }
      data.append('old_password', password);
      data.append('new_password', newPassword);
    }

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (newImageProfile != null) {
      data.append('image', newImageProfile);
    }

    try {
      await axios.put(`${baseURL}/account/artist?email=${email}`, data);
      alert('Successfully updated bio', router.reload());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Old password is incorrect. Please try again.');
      } else {
        console.error('Error updating profile:', error);
        alert('Error updating profile: ' + error.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center ">
        <div className="w-full max-w-3xl rounded-lg p-6 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold">Edit Profile</h1>
          <div className="w-full">
            <div className="p-2 md:p-4">
              <div className="mx-auto w-full px-6 pb-8 sm:max-w-xl sm:rounded-lg">
                <div className="mx-auto mt-1 grid max-w-2xl">
                  {avatar !== null ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="group relative">
                        <img
                          className="h-40 w-40 rounded-full object-cover p-1 ring-2 ring-white"
                          src={`${baseURLFile}/assets/image/avatar/${avatar}`}
                          alt="avatar"
                        />
                        <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 text-sm font-medium text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                          Change Avatar
                          <input
                            onChange={(event) => uploadImageToClient(event)}
                            type="file"
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="group relative">
                        <img
                          className="h-40 w-40 rounded-full object-cover p-1 ring-2 ring-white"
                          src="/images/commonthumbnails/iconblackmetal.png"
                          alt="avatar"
                        />
                        <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 text-sm font-medium text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                          Change Avatar
                          <input
                            onChange={(event) => uploadImageToClient(event)}
                            type="file"
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                  <div className="mt-8 items-center text-[#202142] sm:mt-14">
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue={username}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="username"
                        readOnly
                      />
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        defaultValue={name}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="name"
                        readOnly
                      />
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Email
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="your.email@mail.com"
                        defaultValue={email}
                        readOnly
                      />
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Formed
                      </label>
                      <input
                        type="date"
                        onChange={(e) => updateField('formed', e.target.value)}
                        defaultValue={formed}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="your birthday"
                      />
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Genre
                      </label>
                      <select
                        onChange={(e) => updateField('genre', e.target.value)}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                      >
                        <option value={genre} className="text-black">
                          {genre}
                        </option>
                        {dataGenre.map((item, i) => (
                          <option
                            className="text-black"
                            key={i}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Description
                      </label>
                      <textarea
                        type="text"
                        defaultValue={desc}
                        rows="10"
                        onChange={(e) =>
                          updateField('description', e.target.value)
                        }
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="about your band"
                      />
                    </div>
                    <hr className="mb-6 mt-6" />
                    <div className="mb-2 mt-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Old Password
                      </label>
                      <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="old password"
                      />
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        New Password
                      </label>
                      <input
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="new password"
                      />
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="confirm new password"
                      />
                    </div>
                    <div className="flex w-full justify-center">
                      <button
                        type="submit"
                        onClick={handleUpdate}
                        className="w-full rounded-lg bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 sm:w-auto dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
        destination: '/login',
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
