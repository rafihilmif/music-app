import React, { useState, useEffect } from 'react';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Search,
  ShoppingBag,
  Inventory2Outlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import debounce from 'lodash.debounce';
import { redirect } from 'next/dist/server/api-utils';

export default function Navbar() {
  const router = useRouter();
  const path = router?.asPath;
  const { name } = router.query;
  const { data: session, status } = useSession();
  const [totalItems, setTotalItems] = useState(0);

  const [avatar, setAvatar] = useState();
  const [nameUser, setNameUser] = useState();

  const [role, setRole] = useState();

  const [idFans, setIdFans] = useState('');
  const [dataCart, setDataCart] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchQueryFromURL = name || '';
  const [searchQuery, setSearchQuery] = useState(searchQueryFromURL);

  const sanitizeSearchQuery = (query) => {
    return query.replace(/[^\w\s]/gi, '').trim();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (session?.user) {
      setRole(session.user.role);
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'authenticated') {
          let response;
          if (role === 'artist') {
            response = await axios.get(
              `${baseURL}/detail/artist?email=${session.user.email}`,
            );
            setNameUser(response.data.name);
            setAvatar(response.data.avatar);
          } else if (role === 'fans') {
            response = await axios.get(
              `${baseURL}/detail/fans?email=${session.user.email}`,
            );
            setIdFans(response.data.id_fans);
            setNameUser(response.data.username);
            setAvatar(response.data.avatar);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (role) {
      fetchData();
    }
  }, [role, session, status]);

  const debouncedSearch = debounce((query) => {
    const sanitizedQuery = sanitizeSearchQuery(query);
    if (sanitizedQuery !== '') {
      router.push(`/search/${sanitizedQuery}`);
    } else {
      router.push('/search');
    }
  }, 400);

  useEffect(() => {
    if (
      router.pathname === '/search' ||
      router.pathname.startsWith('/search/')
    ) {
      debouncedSearch(searchQuery);
      return () => {
        debouncedSearch.cancel();
      };
    }
  }, [searchQuery, router.pathname]);

  useEffect(() => {
    if (
      router.pathname === '/search' ||
      router.pathname.startsWith('/search/')
    ) {
      setSearchQuery(searchQueryFromURL);
    }
  }, [searchQueryFromURL, router.pathname]);

  const [isListVisible, setIsListVisible] = useState(false);

  const toggleItemList = () => {
    setIsListVisible(!isListVisible);
  };

  useEffect(() => {
    const fetchDataCart = async () => {
      if (status === 'authenticated' && role === 'fans' && idFans) {
        try {
          const response = await axios.get(`${baseURL}/fans/cart?id=${idFans}`);
          setDataCart(response.data.data);
          setTotalItems(response.data.totalItems);
        } catch (error) {
          if (error.response.data.status === 'Cart has been empty') {
            console.log(response.data.status);
          } else {
            console.log('Error:', error.message);
          }
        }
      }
    };
    if (idFans) {
      fetchDataCart();
    }
  }, [status, role, idFans]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: `${baseURL}/` });
    localStorage.clear();
  };

  return (
    <>
      <div className="flex w-full items-center justify-between bg-transparent font-semibold">
        {path === '/search' || path === `/search/${name}` ? (
          <div className="flex w-80 items-center rounded-full bg-white p-2 shadow-md hover:bg-gray-200">
            <Search className="ml-3 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full bg-transparent pl-3 font-medium text-gray-600 focus:outline-none"
              placeholder="What do you want to play?"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2"></div>
        )}

        <div className="flex items-center gap-4">
          {path === '/artist/collection/albums' ||
          path === '/artist/collection/albums/new' ||
          path === '/artist/collection/albums/old' ? (
            <a
              href="/artist/add/album"
              className="hidden cursor-pointer rounded-2xl bg-green-400 px-4 py-1 text-[15px] text-black md:block"
            >
              Add an Album
            </a>
          ) : path === '/artist/collection/song' ? (
            <a
              href="/artist/add/track"
              className="hidden cursor-pointer rounded-2xl bg-green-400 px-4 py-1 text-[15px] text-black md:block"
            >
              Add an Tracks
            </a>
          ) : path === '/artist/collection/merchandise' ? (
            <a
              href="/artist/add/merchandise"
              className="hidden cursor-pointer rounded-2xl bg-green-400 px-4 py-1 text-[15px] text-black md:block"
            >
              Add an Merchandise
            </a>
          ) : path === '/artist/collection/shows' ? (
            <a
              href="/artist/add/show"
              className="hidden cursor-pointer rounded-2xl bg-green-400 px-4 py-1 text-[15px] text-black md:block"
            >
              Add an Shows
            </a>
          ) : null}
          {role === 'fans' ? (
            <div className="relative">
              <div
                onClick={toggleItemList}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-black hover:bg-gray-200"
              >
                <ShoppingBag />
              </div>
              {totalItems > 0 && (
                <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {totalItems}
                </div>
              )}
              {isListVisible && (
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <ul className="list-none">
                    {dataCart.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        <ul>
                          {dataCart.map((item, index) => (
                            <li
                              key={index}
                              className="relative flex items-start border-b border-gray-200 px-4 py-4"
                            >
                              <img
                                src={`${baseURLFile}/assets/image/merchandise/${item.Merchandise.ImageMerches[0].name}`}
                                alt="Product Image"
                                className="mr-4 h-24 w-24 rounded-md object-cover"
                              />
                              <div className="flex flex-1 flex-col">
                                <a
                                  href="#"
                                  className="text-sm font-semibold text-gray-900 hover:underline dark:text-white"
                                >
                                  {item.Merchandise.name} - {item.size}
                                </a>
                                <p className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                                  {formatCurrency(item.Merchandise.price)}
                                </p>
                                <div className="mt-1 flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                      Qty :{' '}
                                    </p>
                                    <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                      {item.qty}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    className="absolute right-1 top-0 z-10 mr-2 mt-2 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7.7-3.7a1 1 0 0 0-1.4 1.4l2.3 2.3-2.3 2.3a1 1 0 1 0 1.4 1.4l2.3-2.3 2.3 2.3a1 1 0 0 0 1.4-1.4L13.4 12l2.3-2.3a1 1 0 0 0-1.4-1.4L12 10.6 9.7 8.3Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}

                          <div className="px-4 py-2">
                            <div className="mb-5 mt-5 flex justify-between">
                              <p className="text-base font-semibold text-gray-900 dark:text-white">
                                Subtotal
                              </p>
                              <p className="text-base font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(1950000)}
                              </p>
                            </div>
                            <div className="mb-5">
                              <p className="text-xs font-extralight text-gray-400 dark:text-white">
                                Tax included. Shipping calculated at checkout.
                              </p>
                            </div>
                            <button
                              onClick={() => router.push('/fans/cart')}
                              type="button"
                              className="w-full rounded-lg bg-gray-800 py-2 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                            >
                              Checkout
                            </button>
                          </div>
                        </ul>
                      </div>
                    ) : (
                      <div className="flex h-80 flex-col items-center justify-center p-4 text-center">
                        <Inventory2Outlined className="mb-4 h-24 w-24 text-gray-700" />
                        <h3 className="mb-2 text-lg font-semibold text-gray-700">
                          Your cart is empty
                        </h3>
                        <p className="mb-4 text-sm text-gray-500">
                          Looks like you haven't added any items to your cart
                          yet.
                        </p>
                        <button
                          className="w-full rounded-lg bg-gray-800 py-2 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                          onClick={() => router.push('/search')}
                        >
                          Start Shopping
                        </button>
                      </div>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
          <div className="relative">
            {avatar !== null ? (
              <img
                onClick={toggleDropdown}
                src={`${baseURLFile}/assets/image/avatar/${avatar}`}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  text-white hover:ring-4 hover:ring-gray-500"
              />
            ) : (
              <p
                onClick={toggleDropdown}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-purple-500 text-black hover:bg-purple-200"
              >
                {nameUser?.slice(0, 1)}
              </p>
            )}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-36 w-48 rounded-md bg-[#202020] py-2 shadow-lg">
              {role === 'fans' ? (
                <div className="block cursor-pointer px-4 py-2 text-white hover:bg-gray-500">
                  <a href="/fans/account">Account</a>
                </div>
              ) : (
                <div className="block cursor-pointer px-4 py-2 text-white hover:bg-gray-500">
                  <a href="/artist/account">Account</a>
                </div>
              )}
              {role === 'fans' && (
                <div className="block cursor-pointer px-4 py-2 text-white hover:bg-gray-500">
                  <a href="/fans/subscribe">Subscribe</a>
                </div>
              )}

              <div
                onClick={() => handleSignOut()}
                className="block cursor-pointer px-4 py-2 text-white hover:bg-gray-500"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
