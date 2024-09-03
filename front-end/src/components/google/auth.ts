// src.auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import google from 'next-auth/providers/google';

export const { handlers: { GET, POST }, auth, signIn, signOut, update } = NextAuth({
  ...authConfig,
  providers: [
    google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),   
  ],  
});