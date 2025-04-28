import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import db from "../../../../../prisma/db";
import bcrypt from "bcrypt";

export const options = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 3000,
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialProvider({
      credentials: {
        email: {
          label: "E-mail",
          type: "email",
          placeholder: "Digite seu e-mail",
        },
        password: {
          label: "Senha",
          type: "password",
          placeholder: "Digite sua senha",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await db.user.findFirst({
            where: {
              email: credentials.email,
            },
          });

          if (!foundUser) {
            throw new Error("Usuário não encontrado!");
          }

          const passMath = bcrypt.compareSync(
            credentials.password,
            foundUser.password
          );

          if (passMath) {
            console.log("Usuário encontrado", foundUser);
            delete foundUser.password;
            return foundUser;
          }

          throw new Error("Senha incorreta!");
        } catch (error) {
          console.log("Error ao autorizar usuário", error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("session github", session);
      console.log("token", token);
      if (session?.user) {
        session.user.id = parseInt(token.sub);
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
