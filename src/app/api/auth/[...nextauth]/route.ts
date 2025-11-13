import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/UserModels";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) return null;

        return { id: user._id.toString(), name: user.username, email: user.email, role: user.role };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connect();

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          if (existingUser.provider === "credentials") return false;
          return true;
        }

        const newUser = new User({
          username: user.name,
          email: user.email,
          image: user.image,
          role: user.role || "user",
          provider: "google",
        });
        await newUser.save();
        return true;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.name;
        token.role = user.role;
      }

      await connect();
      const dbUser = await User.findOne({ email: token.email });
      if (dbUser) token.role = dbUser.role;

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.username,
          email: token.email,
          image: token.image,
          role: token.role,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
