import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/UserModels";
import bcrypt from "bcryptjs";

export const authOptions = {
  // Configure one or more authentication providers
providers: [
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
     return { id: user._id, name: user.username, email: user.email };
   
    }
  })
],
pages: {
    signIn: '/login',
},
  debug: true,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }