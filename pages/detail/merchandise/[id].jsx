import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useContext } from 'react';
import { FavoriteBorder } from '@mui/icons-material';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';

export default function detailMerchById() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState();
  const [image, setImage] = useState([]);
  const [price, setPrice] = useState();
  const [desc, setDesc] = useState();
  const [sizeS, setSizeS] = useState();
  const [sizeM, setSizeM] = useState();
  const [sizeL, setSizeL] = useState();
  const [sizeXL, setSizeXL] = useState();
  const [stock, setStock] = useState();

  const [mainImage, setMainImage] = useState(null);
  const [count, setCount] = useState(0);

  const [relatedMerch, setRelatedMerch] = useState([]);

  const [idFans, setIdFans] = useState([]);

  const [selectedSize, setSelectedSize] = useState([]);

  const email =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('email'))
      : null;

  useEffect(() => {
    if (status === 'authenticated' && session.user.role === 'fans') {
      const fetchDataFans = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/detail/fans?email=${email}`,
          );
          setIdFans(response.data.id_fans);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchDataFans();
    }
  }, [session, status, email]);

  const fetchImageData = async (id) => {
    try {
      const response = await axios.get(
        `${baseURL}/artist/image/merchandise?id=${id}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching image data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchMerchandiseData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/merchandise?id=${id}`,
        );
        setName(response.data.name);
        setPrice(response.data.price);
        setDesc(response.data.description);
        setSizeS(response.data.s);
        setSizeM(response.data.m);
        setSizeL(response.data.l);
        setSizeXL(response.data.xl);
        setStock(response.data.stock);
        const images = await fetchImageData(id);
        setImage(images);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchMerchandiseData();
    }
  }, [id]);

  useEffect(() => {
    const fetchRelatedMerchandise = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/related/merchandise?id=${id}`,
        );

        const relatedMerchWithImages = await Promise.all(
          response.data.map(async (item) => {
            const images = await fetchImageData(item.id_merchandise);
            return {
              ...item,
              images,
            };
          }),
        );
        setRelatedMerch(relatedMerchWithImages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchRelatedMerchandise();
    }
  }, [id]);

  useEffect(() => {
    if (image.length > 0) {
      setMainImage(image[0].name);
    }
  }, [image]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count > 0 ? count - 1 : 0);

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setCount(value);
    } else if (event.target.value === '') {
      setCount('');
    }
  };

  const handleSizeSelect = (size) => {
    const sizeStock = {
      S: sizeS,
      M: sizeM,
      L: sizeL,
      XL: sizeXL,
    };
    if (sizeStock[size] > 0) {
      setSelectedSize(size);
    }
  };
  
  const addToCart = async () => {
    const sizeStock = {
      S: sizeS,
      M: sizeM,
      L: sizeL,
      XL: sizeXL,
    };

    const isGarmentType =
      selectedSize && ['S', 'M', 'L', 'XL'].includes(selectedSize);

    if (isGarmentType) {
      if (!selectedSize || sizeStock[selectedSize] <= 0) {
        alert('Selected size is out of stock');
        return;
      }
    }

    try {
      await axios
        .post(`${baseURL}/fans/cart`, {
          id_fans: idFans,
          id_merchandise: id,
          qty: count,
          size: isGarmentType ? selectedSize : null,
        })
        .then(alert('Successfully add item to cart'), router.reload());
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  const checkStockSize = (size) => {
    const sizeStock = {
      S: sizeS,
      M: sizeM,
      L: sizeL,
      XL: sizeXL,
    };
    return sizeStock[size] > 0;
  };

  return (
    <>
      <Navbar />
      <section className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <div className="mx-auto max-w-xl lg:max-w-6xl">
          <div className="-mx-4 flex flex-wrap">
            <div className="mb-12 w-full px-2 lg:mb-0 lg:w-1/2">
              <div className="-mx-3 flex">
                <div className="w-32 px-2 md:w-40 lg:w-60">
                  {image.map((item, i) => (
                    <div key={i} className="flex w-full flex-col">
                      <button
                        className="mb-3 block opacity-50 hover:opacity-100 sm:mb-6"
                        onClick={() => setMainImage(item.name)}
                      >
                        <img
                          className="block h-14 w-full rounded-xl sm:h-20 md:h-28"
                          alt=""
                          src={`${baseURLFile}/assets/image/merchandise/${item.name}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="w-auto px-3">
                  <img
                    className="block h-full w-full rounded-xl"
                    src={`${baseURLFile}/assets/image/merchandise/${mainImage}`}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="max-w-lg lg:ml-auto">
                {stock >= 1 ? (
                  <div className="mb-4 inline-block rounded-full bg-green-500 px-4 py-1 text-center text-xs font-bold uppercase tracking-widest text-white">
                    In stock
                  </div>
                ) : (
                  <div className="mb-4 inline-block rounded-full bg-red-500 px-4 py-1 text-center text-xs font-bold uppercase tracking-widest text-white">
                    Out of stock
                  </div>
                )}
                <h1 className="font-heading text-rhino-700 mb-4 text-4xl font-semibold">
                  {name}
                </h1>
                <p className="text-rhino-400 mb-6 text-justify text-sm font-medium">
                  {desc}
                </p>
                <div className="mb-8">
                  <p className="text-rhino-500 mb-3 text-xs font-bold uppercase">
                    SIZE
                  </p>
                  <div className="-mx-1 -mb-1 flex flex-wrap">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <div className="mb-1 w-1/3 px-1 md:w-1/6" key={size}>
                        <div
                          className={`border-coolGray-200 text-coolGray-700 w-full cursor-pointer rounded-sm border py-2 text-center text-sm transition duration-200 ${
                            checkStockSize(size)
                              ? `hover:border-purple-500 hover:text-purple-700 ${
                                  selectedSize === size
                                    ? 'border-purple-500 text-purple-700'
                                    : ''
                                }`
                              : 'cursor-not-allowed opacity-50'
                          }`}
                          onClick={() =>
                            checkStockSize(size) && handleSizeSelect(size)
                          }
                        >
                          {size}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <h2 className="text-rhino-700 font-heading mb-6 text-4xl font-semibold">
                  {formatCurrency(price)}
                </h2>
                <div className="-mx-2 mb-10 flex flex-wrap">
                  <div className="xs:w-4/12 xs:mb-0 mb-4 w-full px-2 md:w-3/12">
                    <div className="xs:w-full border-coolGray-200 inline-flex h-full items-center justify-between gap-2 rounded-md border px-4 py-3">
                      <div
                        className="text-coolGray-300 hover:text-coolGray-400 cursor-pointer transition duration-200"
                        onClick={decrement}
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
                        className="text-coolGray-700 w-9 rounded border border-transparent bg-transparent px-2 text-center text-sm focus:border-transparent focus:ring-0"
                        value={count}
                        onChange={handleInputChange}
                      />
                      <div
                        className="text-coolGray-300 hover:text-coolGray-400 cursor-pointer transition duration-200"
                        onClick={increment}
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
                  <div className="xs:w-5/12 xs:mb-0 mb-4 w-full px-2 md:w-7/12">
                    <button
                      className={`w-full rounded-md px-3 py-4 text-center text-sm font-medium text-white outline outline-1 transition duration-200 ${stock > 0 ? 'bg-transparent hover:bg-purple-600' : 'cursor-not-allowed bg-transparent'}`}
                      onClick={addToCart}
                      disabled={stock <= 0}
                    >
                      {stock > 0 ? 'Add to cart' : 'Out of stock'}
                    </button>
                  </div>
                  <div className="xs:w-3/12 w-full px-2 md:w-2/12">
                    <a
                      className="inline-flex h-14 cursor-not-allowed items-center justify-center rounded-md border border-purple-600 px-6 py-4 text-purple-500 transition duration-200 hover:bg-purple-500 hover:text-white"
                      href="#"
                    >
                      <FavoriteBorder
                        className="cursor-not-allowed"
                        width="16"
                        height="17"
                      />
                    </a>
                  </div>
                </div>

                <div className="border-coolGray-200 rounded-sm border">
                  <div className="border-coolGray-200 flex flex-wrap items-center justify-between gap-4 border-b px-6 py-3">
                    <p className="text-rhino-500 text-xs font-bold uppercase tracking-widest">
                      Specification
                    </p>
                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        fill="none"
                      >
                        <path
                          d="M12.2725 16.1666C12.1769 16.1667 12.0822 16.1479 11.9939 16.1113C11.9055 16.0747 11.8253 16.021 11.7578 15.9533L6.21332 10.4092C6.07681 10.2727 6.00012 10.0876 6.00012 9.89454C6.00012 9.70149 6.07681 9.51635 6.21332 9.37984C6.34983 9.24333 6.53497 9.16665 6.72802 9.16665C6.92107 9.16665 7.10621 9.24334 7.24271 9.37984L12.2725 14.4092L17.3023 9.37982C17.4388 9.24332 17.6239 9.16663 17.817 9.16663C18.01 9.16663 18.1952 9.24331 18.3317 9.37982C18.4682 9.51632 18.5449 9.70147 18.5449 9.89452C18.5449 10.0876 18.4682 10.2727 18.3317 10.4092L12.7872 15.9534C12.7197 16.0211 12.6394 16.0748 12.5511 16.1114C12.4628 16.148 12.3681 16.1667 12.2725 16.1666Z"
                          fill="#A0A5B8"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
                    <p className="text-rhino-500 text-xs font-bold uppercase tracking-widest">
                      Shipping & Returns
                    </p>
                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        fill="none"
                      >
                        <path
                          d="M12.2725 16.1666C12.1769 16.1667 12.0822 16.1479 11.9939 16.1113C11.9055 16.0747 11.8253 16.021 11.7578 15.9533L6.21332 10.4092C6.07681 10.2727 6.00012 10.0876 6.00012 9.89454C6.00012 9.70149 6.07681 9.51635 6.21332 9.37984C6.34983 9.24333 6.53497 9.16665 6.72802 9.16665C6.92107 9.16665 7.10621 9.24334 7.24271 9.37984L12.2725 14.4092L17.3023 9.37982C17.4388 9.24332 17.6239 9.16663 17.817 9.16663C18.01 9.16663 18.1952 9.24331 18.3317 9.37982C18.4682 9.51632 18.5449 9.70147 18.5449 9.89452C18.5449 10.0876 18.4682 10.2727 18.3317 10.4092L12.7872 15.9534C12.7197 16.0211 12.6394 16.0748 12.5511 16.1114C12.4628 16.148 12.3681 16.1667 12.2725 16.1666Z"
                          fill="#A0A5B8"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mb-4 mt-10 flex w-full max-w-xl flex-col items-center lg:max-w-6xl">
          <h1 className="mb-4 text-xl font-bold">YOU MAY ALSO LIKE</h1>
          <div className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {relatedMerch.map((item, i) => (
              <a key={i} href={`/detail/merchandise/${item.id_merchandise}`}>
                <div className="flex min-w-[180px] cursor-pointer flex-col rounded p-2 px-2 hover:bg-gray-700">
                  {item.images && (
                    <img
                      className="rounded"
                      width={210}
                      height={210}
                      src={`${baseURLFile}/assets/image/merchandise/${item.images[0].name}`}
                      alt={`Merchandise ${item.name}`}
                    />
                  )}
                  <p className="mb-1 mt-2 font-bold">{item.name}</p>
                  <p className="text-sm text-slate-200">{item.artist}</p>
                </div>
              </a>
            ))}
          </div>

          {/* <div
            // ref={lastElementRef}
            className="relative bottom-2 flex items-center justify-center p-4"
          >
            {isLoading && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline h-8 w-8 animate-spin fill-purple-600 text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div> */}
        </div>
      </section>
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

  return {
    props: {
      ...session,
    },
  };
}
