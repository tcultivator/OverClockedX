
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import db from "./lib/db";

// types of accounts
// the expected types of a value get from database
import { Accounts } from "./types/AccountsType";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      const { email, name, image } = user;
      if (!email) {
        return false
      }
      const [rows] = await db.query('SELECT * FROM accounts WHERE email = ?', [email]);
      const accounts = rows as Accounts[];
      if (accounts.length === 0) {
        await db.query('INSERT INTO accounts (email,password,username,profile_Image,role,login_method) VALUES (?,?,?,?,?,?)', [email, 'none', name, image, 'client', 'google'])
      } else {
        await db.query('UPDATE accounts SET email = ? WHERE email = ?', [email, email])
      }

      return true

    }

  }
})