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

  const [dataPlanPayment, setDataPlanPayment] = useState([]);
  const [dataOrderPayment, setDataOrderPayment] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedType, setSelectedType] = useState('order');
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalPlan, setTotalPlan] = useState(0);
  

  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [currentPlanPage, setCurrentPlanPage] = useState(1);

  const [timeFilter, setTimeFilter] = useState('');


  useEffect(() => {
    const fetchDataPlanPayment = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/plan/payment?page=${currentPlanPage}&timeFilter=${timeFilter}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataPlanPayment(response.data.data);
        setTotalPlan(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataPlanPayment();
    }
  }, [session, currentPlanPage, timeFilter]);

  useEffect(() => {
    const fetchDataOrderPayment = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/fans/order?page=${currentOrderPage}&timeFilter=${timeFilter}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataOrderPayment(response.data.data);
        setTotalOrder(response.data.total);
        console.log(response.data.data);
        console.log(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchDataOrderPayment();
    }
  }, [session, currentOrderPage, timeFilter]);

  const handleConfirmPlanPayment = async (idPlanPayment) => {
    try {
      await axios
        .get(`${baseURL}/plan/confirm/payment?idPlanPayment=${idPlanPayment}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then(router.reload());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleConfirmOrderPayment = async (idOrderPayment) => {
    try {
      await axios
        .get(
          `${baseURL}/fans/order/confirm/payment?idOrderPayment=${idOrderPayment}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then(router.reload());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  const handleDurationChange = (event) => {
    setTimeFilter(event.target.value);
  };

  const handleNextPage = () => {
    if (selectedType === 'order') {
      setCurrentOrderPage(currentOrderPage + 1);
    } else {
      setCurrentPlanPage(currentPlanPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (selectedType === 'order') {
      setCurrentOrderPage(currentOrderPage - 1);
    } else {
      setCurrentPlanPage(currentPlanPage - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden px-2">
        <div className="w-full bg-transparent px-2 py-4 font-sans">
          <h1 className="mb-4 text-3xl font-bold">
            History Order & Subscription
          </h1>

          <div className="rounded-lg border bg-white px-2 py-4">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex rounded-lg bg-gray-100 p-1">
                <button
                  className={`rounded-md px-4 py-2 ${
                    selectedType === 'order'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setSelectedType('order')}
                >
                  Orders
                </button>
                <button
                  className={`rounded-md px-4 py-2 ${
                    selectedType === 'subscription'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setSelectedType('subscription')}
                >
                  Subscriptions
                </button>
              </div>
            </div>
            <div className="w-full">
              <div className="mx-auto max-w-7xl">
                <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    My {selectedType}
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
                {selectedType === 'order' ? (
                  <div className="mt-6 flow-root sm:mt-8">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {dataOrderPayment.map((item) => {
                        return (
                          <div
                            className="flex flex-wrap items-center gap-y-4 py-6"
                            key={item.id_order}
                          >
                            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                Order Payment ID:
                              </dt>
                              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                <a href="#" className="hover:underline">
                                  #{item.id_order}
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
                                      hoveredIndex === item.id_order
                                        ? null
                                        : item.id_order,
                                    )
                                  }
                                  className="flex h-6 w-6 items-center justify-center text-white hover:text-gray-400"
                                >
                                  <MoreHoriz className="h-5 w-5 text-black hover:text-opacity-30" />
                                </button>
                                {hoveredIndex === item.id_order && (
                                  <div className="absolute -left-12 mt-1 w-24 rounded bg-[#2f3135] shadow-lg">
                                    {item.status === 'Settlement' ? (
                                      <a
                                        href={`/fans/history/order/${item.id_order}`}
                                        className="block px-4 py-2 text-xs text-white hover:bg-gray-400"
                                      >
                                        View Details
                                      </a>
                                    ) : (
                                      <>
                                        <a
                                          href={`/fans/history/order/${item.id_order}`}
                                          className="block px-4 py-2 text-xs text-white hover:bg-gray-400"
                                        >
                                          View Details
                                        </a>
                                        <button
                                          onClick={() =>
                                            handleConfirmOrderPayment(
                                              item.id_order,
                                            )
                                          }
                                          className="block w-full bg-[#2f3135] px-4 py-2 text-left text-xs hover:bg-gray-400"
                                        >
                                          Confirm Payment
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : selectedType === 'subscription' ? (
                  <div className="mt-6 flow-root sm:mt-8">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {dataPlanPayment.map((item) => {
                        return (
                          <div
                            className="flex flex-wrap items-center gap-y-4 py-6"
                            key={item.id_plan_payment}
                          >
                            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                Plan Payment ID:
                              </dt>
                              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                <a href="#" className="hover:underline">
                                  #{item.id_plan_payment}
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
                                      hoveredIndex === item.id_plan_payment
                                        ? null
                                        : item.id_plan_payment,
                                    )
                                  }
                                  className="flex h-6 w-6 items-center justify-center text-white hover:text-gray-400"
                                >
                                  <MoreHoriz className="h-5 w-5 text-black hover:text-opacity-30" />
                                </button>
                                {hoveredIndex === item.id_plan_payment && (
                                  <div className="absolute -left-12 mt-1 w-24 rounded bg-[#2f3135] shadow-lg">
                                    {item.status === 'Settlement' ? (
                                      <a
                                        href={`/fans/history/subscription/${item.id_plan_payment}`}
                                        className="block px-4 py-2 text-xs text-white hover:bg-gray-400"
                                      >
                                        View Details
                                      </a>
                                    ) : (
                                      <>
                                        <a
                                          href={`/fans/history/subscription/${item.id_plan_payment}`}
                                          className="block px-4 py-2 text-xs text-white hover:bg-gray-400"
                                        >
                                          View Details
                                        </a>
                                        <button
                                          onClick={() =>
                                            handleConfirmPlanPayment(
                                              item.id_plan_payment,
                                            )
                                          }
                                          className="block w-full bg-[#2f3135] px-4 py-2 text-left text-xs hover:bg-gray-400"
                                        >
                                          Confirm Payment
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <nav
                  className="mt-6 flex items-center justify-center sm:mt-8"
                  aria-label="Page navigation example"
                >
                  <ul className="flex h-8 items-center -space-x-px text-sm">
                    <li>
                      <button
                        onClick={handlePrevPage}
                        disabled={
                          selectedType === 'order'
                            ? currentOrderPage === 1
                            : currentPlanPage === 1
                        }
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
                        disabled={
                          selectedType === 'order'
                            ? currentOrderPage * 9 >= totalOrder
                            : currentPlanPage * 9 >= totalPlan
                        }
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
