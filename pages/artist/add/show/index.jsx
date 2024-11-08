import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { baseURL } from '@/baseURL';
import Swal from 'sweetalert2';
export default function index() {
  const citiesByState = {
    'Jawa Timur': [
      'Babat',
      'Balung',
      'Bangil',
      'Bangkalan',
      'Banyuwangi',
      'Batu',
      'Blitar',
      'Bojonegoro',
      'Bondowoso',
      'Jember',
      'Jombang',
      'Kediri',
      'Lamongan',
      'Lumajang',
      'Madiun',
      'Magetan',
      'Malang',
      'Mojokerto',
      'Nganjuk',
      'Ngawi',
      'Pacitan',
      'Pamekasan',
      'Pasuruan',
      'Ponorogo',
      'Probolinggo',
      'Sidoarjo',
      'Situbondo',
      'Sumenep',
      'Trenggalek',
      'Tuban',
      'Tulungagung',
      'Surabaya',
    ],
    'Jawa Tengah': [
      'Adiwerna',
      'Ambarawa',
      'Banyumas',
      'Batang',
      'Baturaden',
      'Blora',
      'Boyolali',
      'Prambanan',
      'Ceper',
      'Cepi',
      'Colomadu',
      'Delanggu',
      'Gatak',
      'Gebog',
      'Grogol',
      'Gombong',
      'Kartasura',
      'Magelang',
      'Salatiga',
      'Semarang',
      'Surakarta',
      'Tegal',
      'Kudus',
      'Lebaksiu',
      'Rembang',
      'Purwokerto',
      'Wonosobo',
    ],
    'Jawa Barat': [
      'Bandung',
      'Banjar',
      'Banjaran',
      'Bekasi',
      'Bogor',
      'Caringin',
      'Ciamis',
      'Ciampea',
      'Cibinong',
      'Cicurug',
      'Cikampek',
      'Cikarang',
      'Cileungsir',
      'Cirebon',
      'Garut',
      'Indramayu',
      'Majalengka',
      'Depok',
      'Sukabumi',
      'Tasikmalaya',
      'Kresek',
      'Margahayukencana',
      'Padalarang',
      'Pamulang',
      'Rengasdengklok',
      'Purwakarta',
      'Serpong',
      'Soreang',
      'Sumedang',
    ],
    'DKI Jakarta': [
      'Jakarta Pusat',
      'Jakarta Utara',
      'Jakarta Selatan',
      'Jakarta Barat',
      'Jakarta Timur',
    ],
    Banten: [
      'Tangerang',
      'Serang',
      'Cilegon',
      'Pandeglang',
      'Lebak',
      'Rangkasbitung',
      'Balaraja',
      'Ciputat',
    ],
    Bali: [
      'Denpasar',
      'Singaraja',
      'Tabanan',
      'Gianyar',
      'Ubud',
      'Bangli',
      'Amlapura',
      'Negara',
    ],
    Yogyakarta: [
      'Yogyakarta',
      'Bantul',
      'Sleman',
      'Kulon Progo',
      'Gunungkidul',
    ],
    'Kalimantan Timur': [
      'Balikpapan',
      'Bontang',
      'Berau',
      'Kutai Kartanegara',
      'Mahakam Hulu',
      'Paser',
      'Samarinda',
      'Loa Janan',
    ],
    'Kalimantan Tengah': [
      'Barito',
      'Gunung Mas',
      'Kapuas',
      'Katingan',
      'Kotawaringin',
      'Lamandau',
      'Murung Raya',
      'Pulang Pisau',
      'Seruyan',
      'Sukamara',
      'Palangka Raya',
      'Kualapuas',
      'Palangkaraya',
      'Pangkalbuun',
      'Sampit',
    ],
    'Sulawesi Selatan': [
      'Galesong',
      'Banteng',
      'Barru',
      'Bone',
      'Bulukumba',
      'Enrekang',
      'Gowa',
      'Jeneponto',
      'Luwu',
      'Maros',
      'Pinrang',
      'Sidenreng Rappang',
      'Sinjai',
      'Soppeng',
      'Takalar',
      'Tana Toraja',
      'Wajo',
      'Makassar',
      'Palopo',
      'Pare-Pare',
      'Rantepao',
      'Selayar',
      'Watampone',
    ],
    'Sulawesi Tenggara': [
      'Bombana',
      'Buton',
      'Kolaka',
      'Konawe',
      'Muna',
      'Katabu',
      'Kendari',
      'Bau-Bau',
      'Wakatobi',
    ],
    'Sulawesi Tengah': [
      'Banggi',
      'Buol',
      'Donggala',
      'Morowali',
      'Parigi Muotong',
      'Poso',
      'Sigi',
      'Toli-Toli',
      'Palu',
      'Luwuk',
      'Tojo Una-Una',
    ],
    'Sulawesi Utara': [
      'Bolang Mongondow',
      'Sangihe',
      'Minahasa',
      'Siau Tagulandan Biaro',
      'Bitung',
      'Kotamobagu',
      'Manado',
      'Tomohon',
      'Tondano',
    ],
    'Sumatera Selatan': [
      'Baturaja',
      'Empat Lawang',
      'Musi',
      'Ogan Ilir',
      'Ogan Komering Ulu',
      'Penukal Abab Lematang Ilir',
      'Lubuklinggau',
      'Pagar Alam',
      'Palembang',
      'Prambulih',
      'Lahat',
      'Tanjugagung',
    ],
    'Sumatera Barat': [
      'Bukit Tinggi',
      'Agam',
      'Dharmasraya',
      'Mentawai',
      'Lima Puluh',
      'Pasaman',
      'Pesisir',
      'Sijunjung',
      'Solok',
      'Tanah Datar',
      'Padang',
      'Pariaman',
    ],
    Aceh: [
      'Banda Aceh',
      'Langsa',
      'Lhokseumawe',
      'Sabang',
      'Subulussalam',
      'Takengon',
      'Meulaboh',
      'Bireuen',
      'Sigli',
      'Blangpidie',
    ],
    'Sumatera Utara': [
      'Medan',
      'Binjai',
      'Pematangsiantar',
      'Tebing Tinggi',
      'Sibolga',
      'Gunungsitoli',
      'Labuhan Batu',
      'Deli Serdang',
      'Karo',
    ],
    Riau: [
      'Pekanbaru',
      'Dumai',
      'Bengkalis',
      'Rokan Hilir',
      'Rokan Hulu',
      'Kampar',
      'Siak',
      'Indragiri Hulu',
      'Pelalawan',
    ],
    Lampung: [
      'Bandar Lampung',
      'Metro',
      'Lampung Selatan',
      'Lampung Tengah',
      'Lampung Timur',
      'Way Kanan',
      'Pringsewu',
    ],
    Maluku: [
      'Ambon',
      'Tual',
      'Masohi',
      'Saumlaki',
      'Namlea',
      'Dobo',
      'Piru',
      'Bula',
      'Tiakur',
    ],
    Papua: [
      'Jayapura',
      'Biak',
      'Manokwari',
      'Sorong',
      'Wamena',
      'Merauke',
      'Timika',
      'Serui',
      'Nabire',
    ],
    'Papua Barat': [
      'Sorong',
      'Fakfak',
      'Kaimana',
      'Raja Ampat',
      'Teluk Bintuni',
      'Teluk Wondama',
      'Manokwari',
      'Tambrauw',
    ],
  };

  const { data: session } = useSession();
  const router = useRouter();
  const [id, setId] = useState();

  const [name, setName] = useState('');
  const [date, setDate] = useState();
  const [location, setLocation] = useState();
  const [desc, setDesc] = useState();
  const [contact, setContact] = useState();
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState();

  const [createObjectImageURL, setCreateObjectImageURL] = useState(null);
  const [province, setProvince] = useState();
  const [cities, setCities] = useState();
  const [stateProvince, setStateProvince] = useState('');
  const [stateCities, setStateCities] = useState([]);
  const [address, setAddress] = useState();

  const checkboxRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const [imageProgress, setImageProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleCheckboxChange = () => {
    if (checkboxRef.current) {
      setIsChecked(checkboxRef.current.checked);
    }
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setStateProvince(selectedProvince);
    setStateCities(citiesByState[selectedProvince] || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/detail/artist?email=${session.user.email}`,
        );
        setId(response.data.id_artist);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (session) {
      fetchData();
    }
  }, [session]);

  const uploadImageToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectImageURL(URL.createObjectURL(i));
      setImageProgress(0);
    }
  };
  useEffect(() => {
    setLocation(address + ' ' + cities + ' ' + province);
  }, [province, cities, address]);

  useEffect(() => {
    if (isChecked) {
      setStatus(1);
    }
    if (!isChecked) {
      setStatus(0);
    }
  }, [isChecked]);

  const handleUploadShow = async () => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('date', date);
    formData.append('contact', contact);
    formData.append('location', location);
    formData.append('description', desc);
    formData.append('status', status);

    try {
      const response = await axios.post(
        `${baseURL}/artist/shows/add?id=${id}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setImageProgress(percentCompleted);
          },
        },
      );
      if (response.status === 201) {
        setIsUploading(false);
        setImageProgress(0);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      setIsUploading(false);
      setImageProgress(0);

      if (error.response && error.response.status === 400) {
        const { path, message } = error.response.data;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [path]: message,
        }));
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <h1 className="mb-4 text-3xl font-bold">Create new Show</h1>
        <div className="mb-2 flex w-full justify-center space-x-6">
          <div className="h-full w-9/12 rounded-lg border  p-6 shadow-md md:mt-0">
            <div className=" w-full border  px-4 ">
              <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
                <div className="mr-auto shrink-0 sm:py-3">
                  <p className="font-medium">Show Details</p>
                  <p className="text-sm text-gray-400">Add your Show</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Name Show</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type show name"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              {errors.name && (
                <p className="mb-1 text-red-500">{errors.name}</p>
              )}
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Date</p>
                <input
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              {errors.date && (
                <p className="mb-1 text-red-500">{errors.date}</p>
              )}
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">Province</p>
                <select
                  onChange={handleProvinceChange}
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                >
                  <option className="text-black" value="#">
                    Please select province...
                  </option>
                  {Object.keys(citiesByState).map((prov) => (
                    <option className="text-black" key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 text-lg font-medium">City</p>
                <select
                  onChange={(e) => setCities(e.target.value)}
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                >
                  <option className="text-black" value="#">
                    Please select cities...
                  </option>
                  {stateCities.map((city) => (
                    <option className="text-black" key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Address</p>
                <input
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Type adress show"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              {errors.location && (
                <p className="mb-1 text-red-500">{errors.location}</p>
              )}
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium">Contact Person</p>
                <input
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Type a contact person"
                  className="w-full rounded-md border bg-transparent px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                />
              </div>
              <div className="flex flex-col gap-4 py-4 lg:flex-row">
                <div className="w-32 shrink-0 sm:py-4">
                  <p className="mb-auto text-lg font-medium">Image</p>
                </div>
                <div className="w-full">
                  <input
                    onChange={uploadImageToClient}
                    name="image"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-md border bg-transparent px-2 py-2 text-blue-600 outline-none ring-blue-600 focus:ring-1"
                  />
                  {image && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">{image.name}</div>
                      <div className="relative mt-2 h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                        <div
                          className="absolute left-0 right-0 h-full rounded-lg bg-[#6A64F1]"
                          style={{ width: `${imageProgress}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {isUploading ? `${imageProgress}%` : 'Ready to upload'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-full w-3/12 rounded-lg border p-6 shadow-md md:mt-0">
            <div className="flex justify-between">
              <p className="text-white">Visible</p>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  ref={checkboxRef}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  value=""
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              </label>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between ">
              <p className="mb-1 text-white">About this show</p>
            </div>
            <div className="flex justify-between rounded-lg border">
              <textarea
                onChange={(e) => setDesc(e.target.value)}
                className="peer block min-h-[auto] w-full rounded-lg border-gray-300 bg-transparent py-[0.32rem]  leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 "
                rows="18"
                placeholder="Message"
              />
            </div>
            <div className="my-4"></div>
            <div className="mt-5 w-full">
              <button
                onClick={handleUploadShow}
                disabled={isUploading}
                className={`inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white ${
                  isUploading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-600 active:bg-blue-700'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Publish'}
              </button>
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
