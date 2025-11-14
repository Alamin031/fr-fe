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

        try {
          await connect();
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if user signed up with Google
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
            image: user.image 
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connect();

        if (account?.provider === "google") {
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // Prevent Google sign-in for credential-based users
            if (existingUser.provider === "credentials") {
              throw new Error("Account exists with email/password. Please sign in with credentials.");
            }
            
            // Update existing Google user with latest info
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
      } catch (error: any) {
        console.error("SignIn error:", error);
        // Redirect to login page with error
        return `/login?error=${encodeURIComponent(error.message)}`;
      }
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Refresh user data from database on each JWT update
      try {
        await connect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
          token.picture = dbUser.image;
        }
      } catch (error) {
        console.error("JWT callback error:", error);
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role  = token.role as string;
        session.user.image = token.picture as string;
      }
      return session;
    },

    
    
  },

  pages: {
    signIn: "/login",
    signOut: "/logout", 
    error: "/login", // Error code passed in query string as ?error=
  },

   debug: true,


  // Production security settings
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };