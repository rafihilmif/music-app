import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
export default function orderById() {
  const router = useRouter();
  const { id } = router.query;

  const { data: session } = useSession();

  const [orderDate, setOrderDate] = useState();
  const [orderStatus, setOrderStatus] = useState();
  const [orderFirstName, setOrderFirstName] = useState();
  const [orderLastName, setOrderLastName] = useState();
  const [orderPhone, setOrderPhone] = useState();
  const [orderAddress, setOrderAddress] = useState();
  const [orderCourier, setOrderCourier] = useState();
  const [orderTotal, setOrderTotal] = useState();

  const [dataItemOrder, setDataItemOrder] = useState([]);

  useEffect(() => {
    const fetchDataDetailOrder = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/fans/detail/order?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setOrderDate(response.data.created_at);
        setOrderStatus(response.data.status);
        setOrderFirstName(response.data.first_name);
        setOrderLastName(response.data.last_name);
        setOrderPhone(response.data.phone);
        setOrderAddress(response.data.address);
        setOrderCourier(response.data.courier);
        setOrderTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataDetailOrder();
    }
  }, [id, session]);

  useEffect(() => {
    const fetchDataItemOrder = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/fans/item/order?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setDataItemOrder(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataItemOrder();
    }
  }, [id, session]);

  useEffect(() => {
    console.log(dataItemOrder);
  }, [dataItemOrder]);
  
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
          <h1 className="mb-4 text-3xl font-bold">Your Order Details</h1>
          <div className="mx-auto w-full rounded-lg border bg-white p-6">
            <p className="mb-6 text-gray-600">Order #{id}</p>
            {orderStatus === 'Settlement' ? (
              <p className="mb-8 text-sm text-gray-500">
                Thank you for buying merchandise with us!
              </p>
            ) : (
              <p className="mb-8 text-sm text-gray-500">
                Your order total {formatCurrency(orderTotal)}, should be pay
              </p>
            )}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h2 className="mb-4 font-semibold text-black">
                  Order Information
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">Order Date</p>
                  <p className="text-black">{orderDate}</p>
                  <p className="text-gray-600">Payment Status</p>
                  <p className="text-black">{orderStatus}</p>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="mb-4 font-semibold text-black">Customer</h2>
                </div>
                <p className="mb-1 text-sm text-gray-600">Name</p>
                <p className="mb-2 text-sm text-black">
                  {orderFirstName + ' ' + orderLastName}
                </p>
                <p className="mb-1 text-sm text-gray-600">Phone</p>
                <p className="mb-2 text-sm text-black">{orderPhone}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="mb-4 font-semibold text-black">Address</h2>
                </div>
                <p className="mb-1 text-sm text-gray-600">Shipping Address</p>
                <p className="mb-4 text-sm text-black">{orderAddress}</p>
                <p className="mb-1 text-sm text-gray-600">Courier</p>
                <p className="mb-4 text-sm text-black">{orderCourier}</p>
              </div>
            </div>
            <div className="mb-8 space-y-4">
              {dataItemOrder.map((item) => (
                <div
                  key={item.id_order}
                  className="flex items-center border-b pb-4"
                >
                  <img
                    src={`${baseURLFile}/assets/image/merchandise/${item.Merchandise.ImageMerches[0].name}`}
                    alt="Smart Watch"
                    className="mr-4 h-20 w-20 rounded object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-black">
                      {item.Merchandise.name}
                    </h3>
                    {item.size !== null ? (
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    ) : (
                      <p className="text-sm text-gray-600">Size: - </p>
                    )}

                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.Merchandise.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <p className="text-gray-600">Total</p>
                <p className="font-semibold text-black">
                  {formatCurrency(orderTotal)}
                </p>
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
