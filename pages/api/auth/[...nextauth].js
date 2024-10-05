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
      session: {
        jwt: true,
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(`${baseURL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });
          const user = response.data;
          if (user.role == 'artist') {
            return {
              id: user.id_artist,
              name: user.username,
              password: user.password,
              name: user.name,
              email: user.email,
              role: user.role,
              formed: user.formed,
              genre: user.genre,
              description: user.description,
              avatar: user.avatar,
            };
          } else if (user.role === 'fans') {
            return {
              id: user.id_fans,
              username: user.username,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              name: user.name,
              phone: user.phone,
              birth: user.birth,
              gender: user.gender,
              role: user.role,
              avatar: user.avatar,
            };
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.image = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.avatar = token.image;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET_KEY,
});