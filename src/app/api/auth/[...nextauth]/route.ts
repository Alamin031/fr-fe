import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/UserModels";

export const authOptions: NextAuthOptions = {
  providers: [
    // 🌐 Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🔑 Custom Email/Password Provider
    CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "email", type: "email", placeholder: "Enter your email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      // You need to provide your own logic here that takes the credentials
      // submitted and returns either a object representing a user or value
      // that is false/null if the credentials are invalid.
      // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
      // You can also use the `req` object to obtain additional parameters
      // (i.e., the request IP address)
      
     await connect();
     const user = await User.findOne({ email: credentials?.email });
     if (!user) {
       return null;
     }
     const isValid = await bcrypt.compare(credentials!.password, user.password);
     if (!isValid) {
       return null;
     }
     // If no error and we have user data, return it
     console.log("User authenticated:", user);
     return { id: user._id, name: user.username, email: user.email, role : user.role };
   
    }
  })
  ],

  callbacks: {
    // 🧭 Handle sign-in logic
    async signIn({ user, account }) {
      await connect();

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          if (existingUser.provider === "credentials") {
            console.log("⚠️ Email already registered via password — blocking Google login");
            return false;
          }
          return true; // Existing Google user — OK
        }

        // 🆕 Create new Google user
        const newUser = new User({
          username: user.name,
          email: user.email,
          image: user.image,
          role: user.role || "user", // Fixed syntax error and added default role
          provider: "google",
        });
        await newUser.save();
        return true;
      }

      return true;
    },

    // 🧾 Attach user data to token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.name;
        token.image = user.image;
        token.role = user.role; // Fixed syntax error
      }
      
      // Fetch fresh user data from database on each JWT update
      await connect();
      const dbUser = await User.findOne({ email: token.email });
      if (dbUser) {
        token.role = dbUser.role;
        token.id = dbUser._id.toString();
      }
      
      return token;
    },

    // 💬 Attach user data to session
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.username,
          email: token.email,
          image: token.image,
          role: token.role // Fixed: was `token` instead of `token.role`
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Custom login page
  },

  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };