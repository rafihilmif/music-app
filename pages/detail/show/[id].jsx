import Navbar from '@/components/user/Navbar';
import React, { useState, useEffect, useContext } from 'react';
import { Place, Call } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { baseURL } from '@/baseURL';
import { baseURLFile } from '@/baseURLFile';
export default function detailShowById() {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState();
  const [image, setImage] = useState([]);
  const [duedate, setDueDate] = useState();
  const [desc, setDesc] = useState();
  const [location, setLocation] = useState();
  const [contact, setContact] = useState();

  useEffect(() => {
    const fetchMerchandiseData = async () => {
      try {
        const response = await axios.get(`${baseURL}/detail/show?id=${id}`);
        setName(response.data.name);
        setDueDate(response.data.duedate);
        setDesc(response.data.description);
        setLocation(response.data.location);
        setContact(response.data.contact);
        setImage(response.data.image);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {
      fetchMerchandiseData();
    }
  }, [id]);
  return (
    <>
      <Navbar />
      <section className="mt-10 h-auto w-full overflow-hidden rounded-lg bg-transparent">
        <div className="mx-auto max-w-xl lg:max-w-6xl">
          <div className="-mx-4 flex flex-wrap">
            <div className="mb-12 w-full px-2 lg:mb-0 lg:w-1/2">
              <div className="-mx-3 flex">
                <div className="w-auto px-3">
                  <img
                    className="block h-full w-full rounded-xl"
                    src={`${baseURLFile}/assets/image/shows/${image}`}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="max-w-lg lg:ml-auto">
                <div className="mb-4 inline-block rounded-full bg-green-500 px-4 py-1 text-center text-xs font-bold uppercase tracking-widest text-white">
                  {duedate}
                </div>
                <h1 className="font-heading text-rhino-700 mb-4 cursor-pointer text-4xl font-semibold ">
                  {name}
                </h1>
                <p className="text-rhino-400 mb-6 text-justify text-sm font-medium">
                  {desc}
                </p>
                <div className="mb-8">
                  <h3 className="font-heading text-rhino-700 mb-2 cursor-pointer text-xl font-semibold ">
                    Venue
                  </h3>
                  <div className="flex items-center">
                    <Place className="text-rhino-700 mr-2" />
                    <span>{location}</span>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="font-heading text-rhino-700 mb-2 cursor-pointer text-xl font-semibold ">
                    Contact Person
                  </h3>
                  <div className="flex items-center">
                    <Call className="text-rhino-700 mr-2" />
                    <span>{contact}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mx-auto mb-4 mt-10 flex w-full max-w-xl flex-col items-center lg:max-w-6xl">
          <h1 className="mb-4 text-xl font-bold">YOU MAY ALSO LIKE</h1>
          <div className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {relatedMerch.map((item, i) => (
              <a
                key={i}
                href={`/artist/detail/merchandise/${item.id_merchandise}`}
              >
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
        </div> */}
      </section>
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

  return {
    props: {
      ...session,
    },
  };
}
