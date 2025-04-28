"use client";

import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ childen }) => {
  return <SessionProvider>{childen}</SessionProvider>;
};
