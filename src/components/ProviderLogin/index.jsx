"use client";

import Image from "next/image";
import { IconButton } from "../IconButton";

import githubImg from "./github.png";
import { signIn } from "next-auth/react";

export const Github = (props) => {
  function loginAttempt() {
    console.log("Tenta login via github");
    signIn("github", {
      callbackUrl: "/",
    });
  }
  return (
    <IconButton {...props} onClick={loginAttempt}>
      <Image src={githubImg} alt="Github Logo" />
    </IconButton>
  );
};
