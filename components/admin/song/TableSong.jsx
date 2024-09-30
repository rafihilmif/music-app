import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { FaTrash, FaPen, FaEye, FaEyeSlash } from 'react-icons/fa';
const TableSong = () => {
  const [data, setData] = useState([]);
  const [totalSong, setTotalSong] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/songs?page=${currentPage}`,
          {},
        );
        setData(response.data.data);
        setTotalSong(response.data.total);
        console.log(test);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div class="relative my-1 w-full border bg-white px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-1">
      <div class="flex flex-col  py-4 sm:flex-row sm:items-start">
        <section class="container relative mx-auto px-4">
          <div class="mr-auto shrink-0 sm:py-3">
            <p class="font-medium">Data All Merchandise</p>
          </div>
          <div class="flex flex-col">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 md:rounded-lg dark:border-gray-700">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          <div class="flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              class="rounded border-gray-300 text-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:ring-offset-gray-900"
                            />
                            <button class="flex items-center gap-x-2">
                              <span>ID</span>

                              <svg
                                class="h-3"
                                viewBox="0 0 10 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  stroke-width="0.1"
                                />
                                <path
                                  d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  stroke-width="0.1"
                                />
                                <path
                                  d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  stroke-width="0.3"
                                />
                              </svg>
                            </button>
                          </div>
                        </th>

                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          ID Artist/Name
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          Track
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          Album
                        </th>

                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          Genre
                        </th>

                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          Credit
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          Release Date
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          Visible
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          Created/At
                        </th>

                        <th
                          scope="col"
                          class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                      {data.map((item) => (
                        <tr>
                          <td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                            <div class="inline-flex items-center gap-x-3">
                              <input
                                type="checkbox"
                                class="rounded border-gray-300 text-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:ring-offset-gray-900"
                              />
                              <span>{item.id_song}</span>
                            </div>
                          </td>
                          <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                            <div class="flex items-center gap-x-2">
                              <img
                                class="h-8 w-8 rounded-full object-cover"
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                alt=""
                              />
                              <div>
                                <h2 class="text-sm font-medium text-gray-800 dark:text-white ">
                                  {item.id_artist}
                                </h2>
                                <p class="text-xs font-normal text-gray-600 dark:text-gray-400">
                                  {item.Artist.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
                            <div class="flex items-center gap-x-2">
                              <img
                                class="h-8 w-8 rounded-full object-cover"
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                alt=""
                              />
                              <div>
                                <p class="text-xs font-normal text-gray-500 dark:text-gray-400">
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          {item.album != '-' ? (
                            <td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
                              <div class="flex items-center gap-x-2">
                                <img
                                  class="h-8 w-8 rounded-full object-cover"
                                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                  alt=""
                                />
                                <div>
                                  <p class="text-xs font-normal text-gray-500 dark:text-gray-400">
                                    {item.album}
                                  </p>
                                </div>
                              </div>
                            </td>
                          ) : item.album == '-' ? (
                            <td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
                              <div class="flex items-center gap-x-2">
                                <img
                                  class="h-8 w-8 rounded-full object-cover"
                                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                  alt=""
                                />
                                <div>
                                  <p class="text-xs font-normal text-gray-500 dark:text-gray-400">
                                    -
                                  </p>
                                </div>
                              </div>
                            </td>
                          ) : null}

                          <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {item.genre}
                          </td>
                          <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                            <button class="text-gray-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none dark:text-gray-300 dark:hover:text-indigo-500">
                              View
                            </button>
                          </td>
                          <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {item.release_date}
                          </td>
                          {item.status == 1 ? (
                            <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                              True
                            </td>
                          ) : item.status == 0 ? (
                            <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                              False
                            </td>
                          ) : null}
                          <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {item.created_at}
                          </td>
                          <td class="whitespace-nowrap px-4 py-4 text-sm">
                            <div class="flex items-center gap-x-6">
                              <button class="text-gray-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none dark:text-gray-300 dark:hover:text-indigo-500">
                                <FaTrash className="h-6 w-6" />
                              </button>
                              <a
                                href={`/admin/song/update/${item.id_song}`}
                                class=" text-gray-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                              >
                                <FaPen className="h-6 w-6" />
                              </a>
                              <button class=" text-gray-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none">
                                <FaEye className="h-6 w-6" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              href="#"
              class="flex items-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 rtl:-scale-x-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <span>previous</span>
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage * 12 >= totalSong}
              href="#"
              class="flex items-center gap-x-2 rounded-md border bg-white px-5 py-2 text-sm capitalize text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span>Next</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 rtl:-scale-x-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
export default TableSong;
