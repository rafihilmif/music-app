import '@/styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { PlayerContextProvider } from '@/context/PlayerContext';
import { useRouter } from 'next/router';
import Player from '@/components/user/Player';
import Sidebar from '@/components/user/Sidebar';
import Layout from '@/components/user/Layout';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <PlayerContextProvider>
          {router.pathname === '/' ||
          router.pathname === '/signup/artist' ||
          router.pathname === '/signup/fans' ? (
            <Component {...pageProps} />
          ) : (
            <>
              <div className="h-screen  bg-black">
                <main className="flex h-[90%]">
                  <Sidebar />
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </main>
                <Player />
              </div>
            </>
          )}
        </PlayerContextProvider>
      </SessionProvider>
    </>
  );
}
