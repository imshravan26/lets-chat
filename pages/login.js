import React from "react";
import { auth, provider } from "../firebase";
import { Button } from "@material-ui/core";
import Head from "next/head";
import Image from "next/image";

function login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(console.error);
  };

  return (
    <div className="grid place-items-center dark:bg-gray-900 bg-indigo-100 h-screen">
      <Head>
        <title>Login</title>
        <meta name="description" content="Let's start chatting" />
      </Head>
      <div className="flex flex-col items-center dark:bg-bgdarkSecondary bg-indigo-300 p-28 rounded-md shadow-md">
        <Image
          width={208}
          height={208}
          className="h-52 w-52 mb-14"
          src="https://cdn.icon-icons.com/icons2/1875/PNG/512/chat_120238.png"
          alt=""
        />
        <button
          className="w-full focus:outline-none py-2  rounded-lg dark:!bg-bgdarkSecondary bg-indigo-400 dark:!text-white"
          onClick={signIn}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default login;
