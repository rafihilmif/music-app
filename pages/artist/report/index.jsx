import React, { useState, useEffect, useRef } from 'react';
import { MoreVert } from '@mui/icons-material';
import Navbar from '@/components/user/Navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import { getSession, useSession } from 'next-auth/react';
export default function index() {
  const { data: session, status } = useSession();

  const [idArtist, setIdArtist] = useState(null);
  const [totalFollower, setTotalFollower] = useState(null);
  const [totalMerch, setTotalMerch] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalMerchSales, setTotalMerchSales] = useState(null);

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/artist?email=${session.user.email}`,
        );
        setIdArtist(response.data.id_artist);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    const fetchTotalFollower = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/total/follower?id=${idArtist}`,
        );
        setTotalFollower(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTotalFollower();
  }, [idArtist]);

  useEffect(() => {
    const fetchTotalMerch = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/total/merchadise?id=${idArtist}`,
        );
        setTotalMerch(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTotalMerch();
  }, [idArtist]);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/total/revenue?id=${idArtist}`,
        );
        setTotalRevenue(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTotalRevenue();
  }, [idArtist]);

  useEffect(() => {
    const fetchTotalMerchSales = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/total/merchandise/sales?id=${idArtist}`,
        );
        setTotalMerchSales(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTotalMerchSales();
  }, [idArtist]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/artist/merchandise/sales?id=${idArtist}`,
        );
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchSalesData();
  }, [idArtist]);

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
          <h1 className="mb-4 text-3xl font-bold">Total Revenue</h1>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>
        <div className="w-full p-4">
          <div className="mb-8 grid grid-cols-5 gap-4">
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-gray-500">Followers</h3>
                <button>
                  <MoreVert size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-2xl font-semibold text-black">
                  {totalFollower}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-gray-500">Merchandise</h3>
                <button>
                  <MoreVert size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-2xl font-semibold text-black">
                  {totalMerch}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-gray-500">Merchandise Sales</h3>
                <button>
                  <MoreVert size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-2xl font-semibold"></span>
                <span className="mb-1 text-2xl font-semibold text-black">
                  {totalMerchSales}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left text-black">#</th>
                  <th className="px-6 py-4 text-left text-black">
                    Name Merchandise
                  </th>
                  <th className="px-6 py-4 text-right text-black">Sales</th>
                  <th className="px-6 py-4 text-right text-black">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, index) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="px-6 py-4 text-black">{index + 1}</td>
                    <td className="px-6 py-4 text-black">{item.name}</td>
                    <td className="px-6 py-4 text-right text-black">
                      {item.totalSold}
                    </td>
                    <td className="px-6 py-4 text-right text-black">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
