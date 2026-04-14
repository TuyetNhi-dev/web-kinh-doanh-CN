import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
        async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let connection;
        try {
          connection = await getConnection();
          const [rows] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          );

          const user = rows[0];
          console.log("Tìm thấy user:", user?.email, "Role:", user?.role);

          if (user && await bcrypt.compare(credentials.password, user.password)) {
            console.log("Mật khẩu khớp!");
            return {
              id: user.id,
              name: user.full_name,
              email: user.email,
              role: user.role,
            };
          }
          console.log("Mật khẩu KHÔNG khớp hoặc không tìm thấy user");
          return null;
        } catch (error) {
          console.error("Lỗi xác thực credentials:", error);
          return null;
        } finally {
          if (connection) connection.release();
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        let connection;
        try {
          connection = await getConnection();
          const [rows] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );

          if (rows.length === 0) {
            await connection.execute(
              "INSERT INTO users (email, full_name, role) VALUES (?, ?, ?)",
              [user.email, user.name, "customer"]
            );
          }
          return true;
        } catch (error) {
          console.error("Lỗi khi kiểm tra/tạo user:", error);
          return false;
        } finally {
          if (connection) connection.release();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
