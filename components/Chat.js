import { Avatar } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  return (
    <div
      className="flex items-center cursor-pointer p-4 break-words dark:bg-bgdarkSecondary bg-indigo-300 hover:bg-indigo-400 border-b-[1px] border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-900 dark:text-white"
      onClick={enterChat}
    >
      {recipient ? (
        <Avatar className="m-1 mr-4 z-0" src={recipient?.photoURL} />
      ) : (
        <Avatar className="m-1 mr-4 z-0">{recipientEmail[0]}</Avatar>
      )}
      <p>{recipientEmail.slice(0, 25)}</p>
    </div>
  );
}

export default Chat;
