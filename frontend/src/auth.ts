import NextAuth from "next-auth";

import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If the user is signing in for the first time, add their ID to the token...
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
