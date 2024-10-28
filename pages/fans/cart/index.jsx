import React, { useState, useEffect } from 'react';
import Navbar from '@/components/user/Navbar';
import { Delete, ShoppingCartOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';

export default function Index() {
  const router = useRouter();
  const { data: session } = useSession();

  const [dataCart, setDataCart] = useState([]);
  const [idFans, setIdFans] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/fans?email=${session.user.email}`,
        );
        setIdFans(response.data.id_fans);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    const fetchDataCart = async () => {
      try {
        const response = await axios.get(`${baseURL}/fans/cart?id=${idFans}`);
        setDataCart(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (idFans) {
      fetchDataCart();
    }
  }, [idFans]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  const updateQuantity = async (id_cart_item, newQty) => {
    try {
      const response = await axios.put(
        `${baseURL}/fans/cart?id=${id_cart_item}`,
        {
          qty: newQty,
        },
      );

      if (response.status === 200) {
        setDataCart((prevDataCart) =>
          prevDataCart.map((item) =>
            item.id_cart_item === id_cart_item
              ? { ...item, qty: newQty }
              : item,
          ),
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
    }
  };

  const increment = (id_cart_item, currentQty) => {
    const newQty = currentQty + 1;
    updateQuantity(id_cart_item, newQty);
    if (updateQuantity) {
      router.reload();
    }
  };

  const decrement = (id_cart_item, currentQty) => {
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      updateQuantity(id_cart_item, newQty);
    }
    if (updateQuantity) {
      router.reload();
    }
  };

  const handleInputChange = (e, id_cart_item) => {
    const newQty = parseInt(e.target.value);
    if (!isNaN(newQty) && newQty > 0) {
      updateQuantity(id_cart_item, newQty);
    }
    if (updateQuantity) {
      router.reload();
    }
  };

  const calculateSubtotal = () => {
    return dataCart.reduce(
      (acc, item) => acc + item.Merchandise.price * item.qty,
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.15;
  const total = subtotal + tax;
  const isCartEmpty = dataCart.length === 0;

  const handleRemoveItem = async (idCartItem) => {
    try {
      await axios
        .delete(`${baseURL}/fans/cart/item?id=${idCartItem}`)
        .then(router.reload());
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden px-2">
        <div className="w-full bg-transparent px-2 py-4 font-sans">
          <h1 className="mb-4 text-3xl font-bold">Shopping Cart</h1>
          {isCartEmpty ? (
            <div className="mt-36 text-center">
              <ShoppingCartOutlined className="text-white-800 mx-auto h-48 w-48" />
              <h2 className="mt-4 text-xl font-semibold text-gray-600">
                Your cart is empty
              </h2>
              <p className="mb-4 mt-2 text-gray-500">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                onClick={() => router.push('/search')}
                className="text-white-800 w-2/4 cursor-pointer rounded-md border-2 border-gray-800 px-6 py-2 transition-colors duration-300 hover:bg-gray-800 hover:text-white"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="mt-36 grid gap-8 md:grid-cols-3">
              <div className="space-y-4 md:col-span-2">
                {dataCart.map((item) => (
                  <div
                    key={item.id_cart_item}
                    className="grid grid-cols-3 items-start gap-4 border-b px-1 py-4"
                  >
                    <div className="col-span-2 flex items-start gap-4">
                      <div className="h-28 w-28 shrink-0 rounded-md bg-gray-100 p-2 max-sm:h-24 max-sm:w-24">
                        <img
                          src={`${baseURLFile}/assets/image/merchandise/${item.Merchandise.ImageMerches[0].name}`}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="flex flex-col">
                        <h3 className="text-base font-bold text-white">
                          {item.Merchandise.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-gray-300">
                          SIZE : {item.size}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id_cart_item)}
                          className="mt-6 flex shrink-0 items-center gap-1 text-xs font-semibold text-red-500"
                        >
                          <Delete
                            height={15}
                            width={15}
                            className="hover:text-red-400"
                          />
                          REMOVE
                        </button>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <h4 className="text-lg font-bold text-white max-sm:text-base">
                        {formatCurrency(item.Merchandise.price * item.qty)}
                      </h4>

                      <div className="xs:w-full border-coolGray-200 mt-1 inline-flex h-full items-center justify-between gap-2 rounded-md border px-4 py-3">
                        <div
                          className="hover:text-coolGray-400 cursor-pointer text-white transition duration-200"
                          onClick={() => decrement(item.id_cart_item, item.qty)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            fill="none"
                          >
                            <path
                              d="M12.6667 7.49988H3.33341C3.1566 7.49988 2.98703 7.57012 2.86201 7.69514C2.73699 7.82016 2.66675 7.98973 2.66675 8.16654C2.66675 8.34336 2.73699 8.51292 2.86201 8.63795C2.98703 8.76297 3.1566 8.83321 3.33341 8.83321H12.6667C12.8436 8.83321 13.0131 8.76297 13.1382 8.63795C13.2632 8.51292 13.3334 8.34336 13.3334 8.16654C13.3334 7.98973 13.2632 7.82016 13.1382 7.69514C13.0131 7.57012 12.8436 7.49988 12.6667 7.49988Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <input
                          type="text"
                          className="w-9 rounded border border-transparent bg-transparent px-2 text-center text-sm  text-white focus:border-transparent focus:ring-0 "
                          defaultValue={item.qty}
                          onChange={(e) =>
                            handleInputChange(e, item.id_cart_item)
                          }
                        />
                        <div
                          className="hover:text-coolGray-400 cursor-pointer text-white transition duration-200"
                          onClick={() => increment(item.id_cart_item, item.qty)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            fill="none"
                          >
                            <path
                              d="M12.6667 7.4998H8.66675V3.4998C8.66675 3.32299 8.59651 3.15342 8.47149 3.02839C8.34646 2.90337 8.17689 2.83313 8.00008 2.83313C7.82327 2.83313 7.6537 2.90337 7.52868 3.02839C7.40365 3.15342 7.33341 3.32299 7.33341 3.4998V7.4998H3.33341C3.1566 7.4998 2.98703 7.57003 2.86201 7.69506C2.73699 7.82008 2.66675 7.98965 2.66675 8.16646C2.66675 8.34327 2.73699 8.51284 2.86201 8.63787C2.98703 8.76289 3.1566 8.83313 3.33341 8.83313H7.33341V12.8331C7.33341 13.0099 7.40365 13.1795 7.52868 13.3045C7.6537 13.4296 7.82327 13.4998 8.00008 13.4998C8.17689 13.4998 8.34646 13.4296 8.47149 13.3045C8.59651 13.1795 8.66675 13.0099 8.66675 12.8331V8.83313H12.6667C12.8436 8.83313 13.0131 8.76289 13.1382 8.63787C13.2632 8.51284 13.3334 8.34327 13.3334 8.16646C13.3334 7.98965 13.2632 7.82008 13.1382 7.69506C13.0131 7.57003 12.8436 7.4998 12.6667 7.4998Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-max rounded-md bg-gray-100 p-4">
                <h3 className="border-b border-gray-300 pb-2 text-lg font-bold text-gray-800 max-sm:text-base">
                  Order Summary
                </h3>

                <form className="mt-6">
                  <div>
                    <h3 className="mb-4 text-base  font-semibold text-gray-800">
                      Enter Details
                    </h3>
                    <div className="space-y-3"></div>
                  </div>
                </form>
                <ul className="mt-6 space-y-3 text-gray-800">
                  <li className="flex flex-wrap gap-4 text-sm">
                    Subtotal{' '}
                    <span className="ml-auto font-bold">
                      {formatCurrency(subtotal)}
                    </span>
                  </li>
                  <li className="flex flex-wrap gap-4 text-sm">
                    Tax{' '}
                    <span className="ml-auto font-bold">
                      {formatCurrency(tax)}
                    </span>
                  </li>
                  <hr className="border-gray-300" />
                  <li className="flex flex-wrap gap-4 text-sm font-bold">
                    Total{' '}
                    <span className="ml-auto">{formatCurrency(total)}</span>
                  </li>
                </ul>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => router.push('/fans/checkout')}
                    type="button"
                    className="w-full rounded-md bg-gray-800 px-4 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-gray-900"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => router.push('/search')}
                    className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-2.5 text-sm font-semibold tracking-wide text-gray-800"
                  >
                    Continue Shopping{' '}
                  </button>
                </div>
              </div>
            </div>
          )}
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
