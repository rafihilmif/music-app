import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect } from 'react';
import { Done, Cancel, History, MoreHoriz } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
export default function index() {
  const router = useRouter();
  const { data: session } = useSession();
  const [id, setId] = useState('');

  const [dataOrderTransaction, setDataOrderTransaction] = useState([]);
  const [totalTransaction, setTotalTransaction] = useState();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [timeFilter, setTimeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    const fetchDataOrderTransaction = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/transaction?page=${currentPage}&timeFilter=${timeFilter}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataOrderTransaction(response.data.data);
        setTotalTransaction(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataOrderTransaction();
    }
  }, [session, timeFilter, currentPage]);

  const handleDurationChange = (event) => {
    setTimeFilter(event.target.value);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden px-2">
        <div className="w-full bg-transparent px-2 py-4 font-sans">
          <h1 className="mb-4 text-3xl font-bold">History Transaction</h1>
          <div className="rounded-lg border bg-white py-4">
            <div className="w-full">
              <div className="mx-auto max-w-7xl">
                <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    My Transaction
                  </h2>
                  <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                    <span className="inline-block text-gray-500 dark:text-gray-400">
                      Duration :
                    </span>

                    <div>
                      <label
                        htmlFor="duration"
                        className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Select duration
                      </label>
                      <select
                        id="duration"
                        value={timeFilter}
                        onChange={handleDurationChange}
                        className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      >
                        <option value="">All time</option>
                        <option value="this month">This month</option>
                        <option value="last 3 months">Last 3 months</option>
                        <option value="last 6 months">Last 6 months</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flow-root sm:mt-8">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dataOrderTransaction.map((item) => {
                      return (
                        <div
                          className="flex flex-wrap items-center gap-y-4 py-6"
                          key={item.id_transaction}
                        >
                          <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                              Transaction ID:
                            </dt>
                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                              <a href="#" className="hover:underline">
                                #{item.id_transaction}
                              </a>
                            </dd>
                          </dl>

                          <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                              Date:
                            </dt>
                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                              {item.created_at}
                            </dd>
                          </dl>

                          <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                              Price:
                            </dt>
                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(item.total)}
                            </dd>
                          </dl>

                          <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                              Status:
                            </dt>
                            <dd
                              className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium
                                    ${
                                      item.status === 'Settlement'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                        : item.status === 'Pending'
                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }`}
                            >
                              {item.status === 'Settlement' ? (
                                <Done className="me-1 h-3 w-3" />
                              ) : item.status === 'Pending' ? (
                                <History className="me-1 h-3 w-3" />
                              ) : (
                                <Cancel className="me-1 h-3 w-3" />
                              )}
                              {item.status}
                            </dd>
                          </dl>
                          <div className="grid w-full gap-4 sm:grid-cols-1 lg:flex lg:w-64 lg:items-center lg:justify-end">
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setHoveredIndex(
                                    hoveredIndex === item.id_transaction
                                      ? null
                                      : item.id_transaction,
                                  )
                                }
                                className="flex h-6 w-6 items-center justify-center text-white hover:text-gray-400"
                              >
                                <MoreHoriz className="h-5 w-5 text-black hover:text-opacity-30" />
                              </button>
                              {hoveredIndex === item.id_transaction && (
                                <div className="absolute -left-12 mt-1 w-24 rounded bg-[#2f3135] shadow-lg">
                                  <a
                                    href={`/artist/transaction/${item.id_transaction}`}
                                    className="block px-4 py-2 text-xs text-white hover:bg-gray-400"
                                  >
                                    View Details
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <nav
                  className="mt-6 flex items-center justify-center sm:mt-8"
                  aria-label="Page navigation example"
                >
                  <ul className="flex h-8 items-center -space-x-px text-sm">
                    <li>
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-4 w-4 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m15 19-7-7 7-7"
                          />
                        </svg>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage * 9 >= totalTransaction}
                        className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-4 w-4 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m9 5 7 7-7 7"
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </nav>
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
