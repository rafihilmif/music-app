import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { getSession, useSession } from 'next-auth/react';
import Navbar from '@/components/user/Navbar';
import Swal from 'sweetalert2';

export default function index() {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [avatar, setAvatar] = useState();

  const [birth, setBirth] = useState();
  const [phone, setPhone] = useState();
  const [gender, setGender] = useState();

  const [formData, setFormData] = useState({});
  const [newImageProfile, setNewImageProfile] = useState(null);

  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/detail/fans`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setUsername(response.data.username);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
        setAvatar(response.data.avatar);
        setBirth(response.data.birth);
        setPhone(response.data.phone);
        setGender(response.data.gender);
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
      await axios.put(`${baseURL}/account/fan`, data, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while add song to playlist',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
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
                    <div className="mb-2 flex w-full flex-col items-center space-x-0 space-y-2 sm:mb-6 sm:flex-row sm:space-x-4 sm:space-y-0">
                      <div className="w-full">
                        <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                          First name
                        </label>
                        <input
                          type="text"
                          onChange={(e) =>
                            updateField('first_name', e.target.value)
                          }
                          className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                          placeholder="Your first name"
                          defaultValue={firstName}
                        />
                      </div>

                      <div className="w-full">
                        <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                          Last name
                        </label>
                        <input
                          onChange={(e) =>
                            updateField('last_name', e.target.value)
                          }
                          type="text"
                          className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                          placeholder="Your last name"
                          defaultValue={lastName}
                        />
                      </div>
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
                        Birth
                      </label>
                      <input
                        type="date"
                        onChange={(e) => updateField('birth', e.target.value)}
                        defaultValue={birth}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="your birthday"
                      />
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Phone
                      </label>
                      <input
                        type="text"
                        defaultValue={phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                        placeholder="your phone number"
                      />
                    </div>
                    <div className="mb-2 sm:mb-6">
                      <label className="mb-2 block text-sm font-medium text-white dark:text-white">
                        Gender
                      </label>
                      <select
                        onChange={(e) => updateField('gender', e.target.value)}
                        className="block w-full rounded-lg border border-white bg-transparent p-2.5 text-sm text-white focus:border-gray-500 focus:ring-gray-500"
                      >
                        {gender === 'Male' ? (
                          <>
                            <option value="Male" className="text-black">
                              Male
                            </option>
                            <option value="Female" className="text-black">
                              Female
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="Female" className="text-black">
                              Female
                            </option>
                            <option value="Male" className="text-black">
                              Male
                            </option>
                          </>
                        )}
                      </select>
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
        destination: '/',
        permanent: false,
      },
    };
  }
  if (session.user.role === 'artist') {
    return {
      redirect: {
        destination: '/artist',
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
