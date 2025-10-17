
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import db from "./lib/db";
// types of accounts
// the expected types of a value get from database
import { Accounts } from "./types/AccountsType";
import bcrypt from "bcryptjs";
import { RandomString } from "./utils/randomStringGenerator/RandomString";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const [rows] = await db.query('SELECT * FROM accounts WHERE email = ?', [credentials.email]);
          const accounts = rows as Accounts[];
          const password = credentials?.password as string
          console.log(credentials)
          const isPasswordCorrect = await bcrypt.compare(password, accounts[0].password)
          if (isPasswordCorrect) {
            return {
              email: accounts[0].email,
              name: accounts[0].username,
              image: accounts[0].profile_Image,
            }
          }
          return null
        } catch (err) {
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { email, name, image } = user;
      if (!email) {
        return false
      }
      console.log("Provider used:", account?.provider);
      const [rows] = await db.query('SELECT * FROM accounts WHERE email = ?', [email]);
      const accounts = rows as Accounts[];
      if (account?.provider == 'google') {
        const randomPassword = RandomString()
        console.log(randomPassword)
        const hashedPassword = await bcrypt.hash(randomPassword, 10)
        if (accounts.length === 0) {
          await db.query('INSERT INTO accounts (email,password,username,profile_Image,role,firstTime_signin) VALUES (?,?,?,?,?,?)', [email, hashedPassword, name, image, 'client', true])
        } else {
          await db.query('UPDATE accounts SET email = ?, firstTime_signin = ? WHERE email = ?', [email, false, email])
        }
      }

      return true

    },

  }
})