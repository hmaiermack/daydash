import NextAuth, { type NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0"
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { compare } from "bcrypt";

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
    }),
    CredentialsProvider({
      credentials: {

      },
      // @ts-ignore
      async authorize(credentials, _) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) {
          throw new Error("Missing username or password");
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        // if user doesn't exist or password doesn't match
        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid username or password");
        }
        return user;
      },
    }),
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
          //previously this was user.id, but after moving to credentials provider user is undefined
          // not sure why this change happened
          // @ts-ignore
          id: token.user.id, 
          ...session.user
        }
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
