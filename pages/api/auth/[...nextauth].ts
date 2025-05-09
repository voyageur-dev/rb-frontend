import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshToken } from "@/lib/api/users";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/users/signIn`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })

        if (res.status === 403) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const user = await res.json()

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + user.expiresIn * 1000;
      }

      // Token is still valid
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token expired, refresh it
      const data = await refreshToken(token.refreshToken);
      token.accessToken = data.accessToken;
      // the endpoint might return the new refresh token only in a rare case
      if (data.refreshToken) {
        token.refreshToken = data.refreshToken;
      }
      token.accessTokenExpires = Date.now() + data.expiresIn * 1000;
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
});