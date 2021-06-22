import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import firebase from "firebase";
import TimeAgo from "timeago-react";
import { Avatar, IconButton } from "@material-ui/core";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import Message from "./Message";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const endOfMessagesRef = useRef(null);
  const [input, setInput] = useState("");
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const ScrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");

    ScrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  return (
    <div className="flex flex-col min-w-[60vw] h-[90vh] m-10 rounded-xl dark:bg-bgdarkSecondary bg-indigo-300">
      <div className="sticky rounded-t-xl dark:bg-bgdarkSecondary bg-indigo-300 z-50 top-0 flex p-4 h-20 items-center border-b-[1px] border-indigo-500 dark:border-gray-700">
        <IconButton
          className="focus:outline-none cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowBackIcon className="md:!hidden text-gray-50" />
        </IconButton>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <div className="ml-4 flex-1">
          <h3 className="mb-1 dark:text-white">{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p className="text-gray-500 text-sm">
              Last active:{` `}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p className="mb-1 dark:text-white">Loading Last active...</p>
          )}
        </div>
      </div>

      <div className="p-8 h-[66vh] overflow-scroll hidescrollbar">
        {showMessages()}
        <div className="" ref={endOfMessagesRef} />
      </div>

      <form className="flex items-center p-3 sticky rounded-b-xl border-t-[1px] border-indigo-500 dark:border-gray-700 dark:bg-bgdarkSecondary bg-indigo-300 z-50">
        <InsertEmoticonIcon className="text-black dark:text-gray-100" />
        <input
          className="border-none outline-none rounded-lg backdrop-filter backdrop-blur-2xl bg-white bg-opacity-10 p-5 mx-4 w-full dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
        />

        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon className="text-black dark:text-gray-100" />
      </form>
    </div>
  );
}

export default ChatScreen;
