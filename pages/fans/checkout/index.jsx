import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';

export default function index() {
  const router = useRouter();
  const { data: session } = useSession();
  const [id, setId] = useState();

  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const [dataCart, setDataCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [idFans, setIdFans] = useState();

  const [codeProvince, setCodeProvince] = useState();
  const [codeCities, setCodeCities] = useState();

  const [courier, setCourier] = useState();
  const [service, setService] = useState([]);
  const [costShipping, setCostShipiing] = useState(0);

  const [citiesByState, setCitiesByState] = useState([]);
  const [cities, setCities] = useState([]);
  const [zipcode, setZipcode] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();

  const [snapToken, setSnapToken] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/fans?email=${session.user.email}`,
        );
        setId(response.data.id_fans);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    const loadMidtransScript = () => {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      scriptTag.setAttribute('data-client-key', process.env.CLIENT_KEY);
      document.body.appendChild(scriptTag);
    };
    loadMidtransScript();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`${baseURL}/shipping/province`);
        if (
          response.data &&
          response.data.rajaongkir &&
          response.data.rajaongkir.results
        ) {
          setCitiesByState(response.data.rajaongkir.results);
        } else {
          console.error('Unexpected API response structure for provinces');
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/shipping/city?province_id=${codeProvince}`,
        );
        setCities(response.data.rajaongkir.results);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, [codeProvince]);

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
        setTotalItems(response.data.totalItems);
        setTotalQty(response.data.totalQty);
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

  const calculateSubtotal = () => {
    return dataCart.reduce(
      (acc, item) => acc + item.Merchandise.price * item.qty,
      0,
    );
  };

  useEffect(() => {
    const checkCostService = async () => {
      const tempCodeCities = parseInt(codeCities);
      const tempCodeOrigin = parseInt(444);
      if (!courier || !codeCities || totalQty <= 0) {
        console.log('Missing required data for shipping cost calculation');
        return;
      }
      try {
        const response = await axios.post(`${baseURL}/fans/shipping/cost`, {
          origin: tempCodeOrigin,
          destination: tempCodeCities,
          weight: totalQty * 1000,
          courier: courier,
        });

        if (response.data && response.data.length > 0) {
          setService(response.data);
        } else {
          console.log('No shipping services returned.');
          setService([]);
        }
      } catch (error) {
        console.error('Error fetching shipping cost:', error);
      }
    };

    checkCostService();
  }, [courier, codeCities, totalQty]);

  const subtotal = calculateSubtotal();
  const total = subtotal + parseInt(costShipping);

  useEffect(() => {
    const loadMidtransScript = () => {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      scriptTag.setAttribute('data-client-key', process.env.CLIENT_KEY);
      document.body.appendChild(scriptTag);
    };
    loadMidtransScript();
  }, []);

  const handleBuyNow = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/fans/order?id=${id}`,
        {
          amount: total,
          address: address + ', ' + zipcode,
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          courier: courier,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const { token } = response.data;
      setSnapToken(token);
      // console.log(response.data.data);
      window.snap.pay(token, {
        onSuccess: function (result) {
          router.push('/fans');
        },
        onPending: function (result) {
          alert('Payment pending:' + result);
        },
        onError: function (result) {
          alert('Payment error:' + result);
        },
        onClose: function () {
          console.log('Payment popup closed');
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto w-full p-4">
        <div className="space-y-6 px-2">
          <section>
            <h2 className="mb-2 text-xl font-bold">Contact Information</h2>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold">Shipping Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300"
                >
                  First Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300 "
                >
                  Last Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-300"
              >
                Address
              </label>
              <input
                type="text"
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-300"
                >
                  Province
                </label>
                <select
                  onChange={(e) => setCodeProvince(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
                >
                  <option value="#">Please select province...</option>
                  {citiesByState.map((item, i) => (
                    <option key={i} value={item.province_id}>
                      {item.province}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-300"
                >
                  Cities
                </label>
                <select
                  onChange={(e) => setCodeCities(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
                >
                  <option className="text-black" value="#">
                    Please select cities...
                  </option>
                  {cities.map((item, i) => (
                    <option className="text-black" key={i} value={item.city_id}>
                      {item.city_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-300"
              >
                Zipcode
              </label>
              <input
                type="text"
                onChange={(e) => setZipcode(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300"
              >
                Phone Number
              </label>
              <input
                type="text"
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
              />
            </div>
          </section>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-300"
              >
                Courier
              </label>
              <select
                onChange={(e) => setCourier(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
              >
                <option value="#">Please select courier...</option>
                <option value="jne">JNE</option>
                <option value="pos">POS</option>
                <option value="tiki">TIKI</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-300"
              >
                Service
              </label>
              <select
                onChange={(e) => setCostShipiing(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm"
              >
                <option className="text-black" value="#">
                  Please select service...
                </option>
                {service.map((item, i) => (
                  <option key={i} value={item.cost[0].value}>
                    {item.service}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <section>
            <h2 className="mb-2 text-xl font-bold">Order Summary</h2>
            <div className="space-y-4">
              {dataCart.map((item, i) => (
                <div key={i} className="flex items-center">
                  <img
                    src={`${baseURLFile}/assets/image/merchandise/${item.Merchandise.ImageMerches[0].name}`}
                    className="mr-4 h-16 w-16 rounded-md object-cover"
                    alt={item.Merchandise.name}
                  />
                  <div>
                    <h3 className="font-bold">{item.Merchandise.name}</h3>
                    <p className="text-sm text-gray-500">{item.size}</p>
                    <p className="text-sm">Quantity: {item.qty}</p>
                  </div>
                  <span className="ml-auto">
                    {formatCurrency(item.Merchandise.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Qty</span>
                <span>{totalQty}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping charges</span>
                <span>{formatCurrency(costShipping)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold">Payment Method</h2>
          </section>

          <button
            onClick={handleBuyNow}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Place Order
          </button>
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
