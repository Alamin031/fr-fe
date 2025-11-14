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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Prevent credentials login if user signed up with Google
        if (user.provider === "google") {
          throw new Error("Please sign in with Google");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connect();

      // Handle Google login
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Prevent Google login if account exists with credentials
          if (existingUser.provider === "credentials") {
            // Redirect to login page with error
            return "/login?error=use-credentials";
          }

          // Update Google user info
          await User.findByIdAndUpdate(existingUser._id, {
            username: user.name || existingUser.username,
            image: user.image || existingUser.image,
            lastLogin: new Date(),
          });
          return true;
        }

        // Create new Google user
        const newUser = new User({
          username: user.name,
          email: user.email,
          image: user.image,
          role: "user",
          provider: "google",
          emailVerified: new Date(),
          lastLogin: new Date(),
        });

        await newUser.save();
        return true;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image;
      }

      // Refresh user from DB on each token update
      await connect();
      const dbUser = await User.findOne({ email: token.email });
      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.picture = dbUser.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login", // NextAuth will pass error in query string ?error=
  },

  debug: true,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
