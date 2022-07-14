import NextAuth, { type NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0"

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    // ...add more providers here
    Auth0Provider({
      // for some reason env vars are throwing errors, clientId + secret should be string | undefined?
      // @ts-ignore
      clientId: process.env.AUTH0_CLIENT_ID,
      // @ts-ignore
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      user && (token.user = user)
      return token
    },
    async session({session, token, user}) {
      session = {
        ...session,
        user: {
          // @ts-ignore
          id: user.id, 
          ...session.user
        }
      }
      return session
    }
  }
};

export default NextAuth(authOptions);
