import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
export default function orderById() {
  const router = useRouter();
  const { id } = router.query;

  const [transactionDate, setTransactionDate] = useState();
  const [transactionStatus, setTransactionStatus] = useState();
  const [transactionName, setTransactionName] = useState();
  const [transactionAddress, setTransactionAddress] = useState();
  const [transactionCourier, setTransactionCourier] = useState();
  const [transactionTotal, setTransactionTotal] = useState();

  const [dataItemTransaction, setDataItemTransaction] = useState([]);

  useEffect(() => {
    const fetchDataDetailTransaction = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/detail/transaction?id=${id}`,
        );
        setTransactionDate(response.data.created_at);
        setTransactionStatus(response.data.status);
        setTransactionName(response.data.name);
        setTransactionAddress(response.data.address);
        setTransactionCourier(response.data.courier);
        setTransactionTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataDetailTransaction();
    }
  }, [id]);

  useEffect(() => {
    const fetchDataItemTransaction = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/item/transaction?id=${id}`,
        );
        setDataItemTransaction(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataItemTransaction();
    }
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  const tax = transactionTotal * 0.02;

  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden px-2">
        <div className="w-full bg-transparent px-2 py-4 font-sans">
          <h1 className="mb-4 text-3xl font-bold">Your Transaction Details</h1>
          <div className="mx-auto w-full rounded-lg border bg-white p-6">
            <p className="mb-6 text-gray-600">Transaction #{id}</p>
            <p className="mb-8 text-sm text-gray-500">
              Thank you for selling merchandise with us!
            </p>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h2 className="mb-4 font-semibold text-black">
                  Transaction Infomartion
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">Transaction Date</p>
                  <p className="text-black">{transactionDate}</p>
                  <p className="text-gray-600">Payment Status</p>
                  <p className="text-black">{transactionStatus}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="mb-4 font-semibold text-black">Customer</h2>
                </div>
                <p className="mb-1 text-sm text-gray-600">Name</p>
                <p className="mb-2 text-sm text-black">{transactionName}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="mb-4 font-semibold text-black">Address</h2>
                </div>
                <p className="mb-1 text-sm text-gray-600">Shipping Address</p>
                <p className="mb-4 text-sm text-black">{transactionAddress}</p>
                <p className="mb-1 text-sm text-gray-600">Courier</p>
                <p className="mb-4 text-sm text-black">{transactionCourier}</p>
              </div>
            </div>
            <div className="mb-8 space-y-4">
              {dataItemTransaction.map((item) => (
                <div
                  key={item.id_transaction_item}
                  className="flex items-center border-b pb-4"
                >
                  <img
                    src={`${baseURLFile}/assets/image/merchandise/${item.Merchandise.ImageMerches[0].name}`}
                    alt="Smart Watch"
                    className="mr-4 h-20 w-20 rounded object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.Merchandise.name}</h3>
                    {item.size !== null ? (
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    ) : (
                      <p className="text-sm text-gray-600">Size: - </p>
                    )}

                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                    <p className="text-sm text-gray-600">
                      Price:{' '}
                      <b className="text-red-500">
                        {formatCurrency(item.Merchandise.price * item.qty)}
                      </b>
                    </p>
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
                  {formatCurrency(transactionTotal)}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <p className="text-gray-600">Tax</p>
                <p className="font-semibold text-black">
                  {formatCurrency(tax)}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <p className="text-gray-600">You've getting</p>
                <p className="font-semibold text-black">
                  {formatCurrency(transactionTotal - tax)}
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
