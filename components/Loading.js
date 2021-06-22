import Head from "next/head";
import Image from "next/image";
import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center className="grid place-items-center h-screen">
      <div className="flex flex-col items-center dark:bg-bgdarkSecondary bg-indigo-300 p-28 rounded-md shadow-md">
        <Head>
          <title>Loading ...</title>
          <meta name="description" content="Let's start chatting" />
        </Head>
        <Image
          width={208}
          height={208}
          className="h-52 w-52 mb-14"
          src="https://cdn.icon-icons.com/icons2/1875/PNG/512/chat_120238.png"
          alt=""
        />
        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
}

export default Loading;
