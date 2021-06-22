import { Avatar, Button, IconButton } from "@material-ui/core";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import DonutLargeRoundedIcon from "@material-ui/icons/DonutLargeRounded";
import SearchIcon from "@material-ui/icons/Search";
import Chat from "./Chat";
import { useCollection } from "react-firebase-hooks/firestore";
import * as EmailValidator from "email-validator";
import { useRouter } from "next/router";
import { PersonOutline } from "@material-ui/icons";
import useDarkMode from "./useDarkMode";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Sidebar() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const userChatsRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatsRef);
  const [colorTheme, setTheme] = useDarkMode();

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );

    if (!input) return;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
      toast.success("Chat created successfully");
    }
  };

  const chatAlreadyExist = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <div className="border-r-[1px] w-[30vw] border-indigo-500 dark:border-gray-700 h-[90vh] m-10 min-w-[300px] max-w-[400px] overflow-y-scroll hidescrollbar rounded-xl">
      <div className="flex sticky top-0 justify-between items-center p-4 h-20 dark:bg-bgdarkSecondary bg-indigo-300 border-b-[1px] border-indigo-500 dark:border-gray-700 z-10">
        <Avatar
          className="cursor-pointer hover:opacity-80"
          onClick={() => router.push("/details")}
          src={user.photoURL}
        />

        <div>
          <IconButton className="focus:outline-none">
            <DonutLargeRoundedIcon className="text-black   dark:text-gray-50" />
          </IconButton>
          <IconButton
            className="focus:outline-none"
            onClick={() => router.push("/users")}
          >
            <PersonOutline className="text-black dark:text-gray-50" />
          </IconButton>
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
      </div>

      <div className="flex items-center justify-center dark:bg-bgdarkSecondary bg-indigo-300 p-3 border-b-[1px] border-indigo-500 dark:border-gray-700">
        <div className="flex items-center justify-center backdrop-filter backdrop-blur-2xl bg-white bg-opacity-10 text-black rounded-xl p-3 w-80">
          <SearchIcon className="text-black dark:text-gray-50" />
          <input
            className="outline-none border-none text-black dark:text-white flex-1 ml-3 bg-transparent"
            placeholder="Search in chats"
            type="text"
          />
        </div>
      </div>

      <button
        className="w-full focus:outline-none border-b-[1px] py-2 border-indigo-500 dark:border-gray-700 hover:bg-indigo-400 dark:!bg-bgdarkSecondary bg-indigo-300 dark:!text-white"
        onClick={createChat}
      >
        Start a new chat
      </button>

      {/* Components */}
      <div className="dark:bg-bgdarkSecondary bg-indigo-300  min-h-screen">
        {chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
