import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("/google-auth")) {
        return `${baseUrl}/google-auth`;
      }
      // If URL starts with /, append it to baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // If it's an absolute URL on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to /google-auth
      return `${baseUrl}/google-auth`;
    },
  },
  trustHost: true,
});
