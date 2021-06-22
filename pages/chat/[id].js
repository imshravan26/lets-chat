import React from "react";
import { auth, db } from "../../firebase";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <div className="flex shadow-md">
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <div className="md:flex hidden">
        <Sidebar />
      </div>
      <div className="overflow-scroll h-screen hidescrollbar">
        <ChatScreen chat={chat} messages={messages} />
      </div>
    </div>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  // Prep the Messages...
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // Prep the Chats...
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
