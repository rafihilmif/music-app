import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
export default function subscriptionById() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const [userEmail, setEmail] = useState();
  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userPhone, setUserPhone] = useState();

  const [planDate, setPlanDate] = useState();
  const [planType, setPlanType] = useState();
  const [planStatus, setPlanStatus] = useState();
  const [planTotal, setPlanTotal] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/fans?email=${session.user.email}`,
        );
        setEmail(response.data.email);
        setUserFirstName(response.data.first_name);
        setUserLastName(response.data.last_name);
        setUserPhone(response.data.phone);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    const fetchDataPlanPayment = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/fans/detail/plan/payment?id=${id}`,
        );
        setPlanDate(response.data.created_at);
        setPlanType(response.data.type);
        setPlanStatus(response.data.status);
        setPlanTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchDataPlanPayment();
    }
  }, [id]);

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
          <h1 className="mb-4 text-3xl font-bold">Your Subscription Details</h1>
          <div className="mx-auto w-full rounded-lg border bg-white p-6">
            <p className="mb-6 text-gray-600">Subscription #{id}</p>
            {planStatus === 'Settlement' ? (
              <p className="mb-8 text-sm text-gray-500">
                Thank you for using us!
              </p>
            ) : (
              <p className="mb-8 text-sm text-gray-500">
                Your subscription total {formatCurrency(planTotal)}, should be
                pay
              </p>
            )}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h2 className="mb-4 font-semibold text-black">
                  Subscribe Information
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">Subscribe Date</p>
                  <p className="text-black">{planDate}</p>
                  <p className="text-gray-600">Subscribe Status</p>
                  <p className="text-black">{planStatus}</p>
                  <p className="text-gray-600">Subscribe Type</p>
                  <p className="text-black">{planType}</p>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h2 className="mb-4 font-semibold text-black">Customer</h2>
                </div>
                <p className="mb-1 text-sm text-gray-600">Email</p>
                <p className="mb-2 text-sm text-black">{userEmail}</p>
                <p className="mb-1 text-sm text-gray-600">Name</p>
                <p className="mb-2 text-sm text-black">
                  {userFirstName + ' ' + userLastName}
                </p>
                <p className="mb-1 text-sm text-gray-600">Phone</p>
                <p className="mb-2 text-sm text-black">{userPhone}</p>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <p className="text-gray-600">Total</p>
                <p className="font-semibold text-black">
                  {formatCurrency(planTotal)}
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
        destination: '/login',
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
