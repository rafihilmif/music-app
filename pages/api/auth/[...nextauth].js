import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { baseURL } from '@/baseURL';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(`${baseURL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });
          const user = response.data;
          if (user && user.token) {
            return {
              id: user.id_fans || user.id_artist,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
              accessToken: user.token,
              username: user.username,
              name: user.name,
            };
          } else {
            console.error('Access token is missing in user data');
            return null;
          }
        } catch (error) {
          console.log('Login error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.image = user.avatar;
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.avatar = token.image;
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET_KEY,
});
