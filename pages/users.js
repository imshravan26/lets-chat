import { Avatar, Button, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useRouter } from "next/router";
import * as EmailValidator from "email-validator";
import { useCollection } from "react-firebase-hooks/firestore";
import useDarkMode from "../components/useDarkMode";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import Head from "next/head";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [user] = useAuthState(auth);
  const [colorTheme, setTheme] = useDarkMode();

  const userChatsRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot, loading] = useCollection(userChatsRef);

  useEffect(() => {
    db.collection("users")
      .orderBy("name")
      .onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const createChat = (input) => {
    if (!input) return;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExist = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <div className="border-r-[1px] w-[30vw] border-indigo-500 dark:border-gray-700 h-[90vh] m-10 min-w-[300px] max-w-[400px] overflow-y-scroll hidescrollbar rounded-xl">
      <Head>
        <title>Let's chat</title>
        <meta name="description" content="Let's start chatting" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex sticky top-0 z-50 justify-between items-center p-4 h-20 dark:bg-bgdarkSecondary bg-indigo-300 border-b-[1px] border-indigo-500 dark:border-gray-700">
        <IconButton
          className="focus:outline-none"
          onClick={() => router.push("/")}
        >
          <ArrowBackIcon className="h-9  dark:text-white text-black mr-2 cursor-pointer" />
        </IconButton>

        <p className="dark:text-gray-200">Click on any user to create a chat</p>

        <IconButton className="focus:outline-none">
          {colorTheme === "light" ? (
            <EmojiObjectsIcon
              onClick={() => setTheme("light")}
              className="h-9  dark:text-gray-200 mr-2 cursor-pointer"
            />
          ) : (
            <NightsStayIcon
              onClick={() => setTheme("dark")}
              className="h-9 text-black  mr-2 cursor-pointer"
            />
          )}
        </IconButton>
      </div>
      {users.map(({ data: { name, email, photoURL } }) => (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            createChat(email);
            toast.success("Chat created successfully");
          }}
        >
          {email === user.email ? (
            <div></div>
          ) : (
            <div className="flex items-center p-5 break-words text-black dark:bg-bgdarkSecondary bg-indigo-300 dark:text-white dark:hover:bg-gray-900">
              <Avatar
                className="cursor-pointer hover:opacity-80"
                src={photoURL}
              />
              <div
                className="flex cursor-pointer break-words flex-col ml-3"
                onClick={() => {
                  router.push("/");
                }}
              >
                <p>{name}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Users;
